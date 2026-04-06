import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: {
      status: "up" | "down";
      responseTime: number;
    };
    analyzeEmail: {
      status: "up" | "down";
      responseTime: number;
    };
  };
  uptime: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const startTime = Date.now();
    const health: HealthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: { status: "up", responseTime: 0 },
        analyzeEmail: { status: "up", responseTime: 0 },
      },
      uptime: process.uptime ? process.uptime().toFixed(2) : "unknown",
    };

    // Check database
    const dbStart = Date.now();
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const { error } = await supabase.from("email_analyses").select("id").limit(1);
      health.services.database.responseTime = Date.now() - dbStart;

      if (error) {
        health.services.database.status = "down";
        health.status = "degraded";
      }
    } catch {
      health.services.database.status = "down";
      health.services.database.responseTime = Date.now() - dbStart;
      health.status = "degraded";
    }

    // Check analyze-email edge function
    const emailStart = Date.now();
    try {
      const testEmail = "From: test@example.com\nSubject: Test\n\nThis is a test message";
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

      if (supabaseUrl && anonKey) {
        const response = await fetch(
          `${supabaseUrl}/functions/v1/analyze-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${anonKey}`,
            },
            body: JSON.stringify({ emailContent: testEmail }),
          }
        );

        health.services.analyzeEmail.responseTime = Date.now() - emailStart;

        if (!response.ok) {
          health.services.analyzeEmail.status = "down";
          health.status = "degraded";
        }
      }
    } catch {
      health.services.analyzeEmail.status = "down";
      health.services.analyzeEmail.responseTime = Date.now() - emailStart;
      health.status = "degraded";
    }

    // Log health status to database
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      await supabase.from("system_health_logs").insert({
        status: health.status,
        database_status: health.services.database.status,
        database_response_time: health.services.database.responseTime,
        api_status: health.services.analyzeEmail.status,
        api_response_time: health.services.analyzeEmail.responseTime,
        error_message: null,
      });
    } catch (logError) {
      console.error("Failed to log health status:", logError);
    }

    const statusCode =
      health.status === "healthy" ? 200 : health.status === "degraded" ? 503 : 500;

    return new Response(JSON.stringify(health), {
      status: statusCode,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
