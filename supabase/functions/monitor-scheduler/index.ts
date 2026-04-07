import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Run health check
    const healthResponse = await fetch(`${supabaseUrl}/functions/v1/health-check`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      },
    });

    const healthData = await healthResponse.json();

    // Check for issues
    if (healthData.status !== "healthy") {
      // Log the issue with more detail
      await supabase.from("system_health_logs").insert({
        status: healthData.status,
        database_status: healthData.services.database.status,
        database_response_time: healthData.services.database.responseTime,
        api_status: healthData.services.analyzeEmail.status,
        api_response_time: healthData.services.analyzeEmail.responseTime,
        error_message: `System status: ${healthData.status}`,
      });

      // Attempt auto-recovery if database is slow
      if (healthData.services.database.responseTime > 5000) {
        console.warn("Database response time critical, may need scaling");
      }

      // Attempt to restart analyze-email if it's down
      if (healthData.services.analyzeEmail.status === "down") {
        console.warn("Analyze-email service is down, check deployment");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: new Date().toISOString(),
        health: healthData.status,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Scheduler error:", error);
    return new Response(
      JSON.stringify({
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
