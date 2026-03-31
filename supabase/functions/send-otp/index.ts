import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SendOTPRequest {
  email: string;
}

interface SendOTPResponse {
  success: boolean;
  message?: string;
  error?: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(
  email: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@phishguard.com",
        to: email,
        subject: "Your PhishGuard Login Code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Sign in to PhishGuard</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">Your one-time password is:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <p style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px; margin: 0;">${otp}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">This code will expire in 10 minutes.</p>
            <p style="color: #9ca3af; font-size: 12px;">If you didn't request this code, you can ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Email service error",
    };
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email }: SendOTPRequest = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Valid email is required",
        } as SendOTPResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { data, error: dbError } = await supabase.from("otp_codes").insert({
      email,
      code: otp,
      expires_at: expiresAt.toISOString(),
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate OTP",
        } as SendOTPResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailResult = await sendEmail(email, otp);

    if (!emailResult.success) {
      await supabase.from("otp_codes").delete().eq("email", email);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResult.error,
        } as SendOTPResponse),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent to your email",
      } as SendOTPResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      } as SendOTPResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
