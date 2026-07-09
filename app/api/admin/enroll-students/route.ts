import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerSessionClient } from "@/lib/supabase/server";

// Service-role client: only used for the actual data writes, never for auth checks.
const supabaseAdmin = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role, server-side only, never exposed to client
);

interface StudentRow {
  full_name: string;
  email: string;
  country?: string;
}

interface EnrollRequestBody {
  students: StudentRow[];
  demo_balance: number; // single balance applied to this batch, set by the admin
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    // Verify the caller is a real logged-in user, using their session cookie —
    // never trust a client-supplied admin id.
    const sessionClient = await createServerSessionClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: adminRow } = await sessionClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!adminRow) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const admin_id = user.id;

    const body: EnrollRequestBody = await req.json();
    const { students, demo_balance } = body;

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "No students provided" }, { status: 400 });
    }
    if (!demo_balance || demo_balance <= 0) {
      return NextResponse.json({ error: "demo_balance must be a positive number" }, { status: 400 });
    }

    const results: { email: string; status: "created" | "skipped" | "error"; reason?: string }[] = [];

    for (const student of students) {
      const email = student.email?.trim().toLowerCase();
      const full_name = student.full_name?.trim();
      const country = student.country?.trim() || null;

      if (!email || !isValidEmail(email) || !full_name) {
        results.push({ email: email || "(missing)", status: "error", reason: "Invalid name or email" });
        continue;
      }

      // Skip if this email is already registered (self-registered or previously enrolled)
      const { data: existing, error: lookupErr } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (lookupErr) {
        results.push({ email, status: "error", reason: lookupErr.message });
        continue;
      }
      if (existing) {
        results.push({ email, status: "skipped", reason: "Email already registered" });
        continue;
      }

      // Insert the user, honestly tagged as an academy enrollment done by an admin
      const { data: newUser, error: userErr } = await supabaseAdmin
        .from("users")
        .insert({
          email,
          full_name,
          country,
          email_verified: true, // verified by the admin at enrollment time, not self-verified
          signup_source: "academy_enrollment",
          enrolled_by: admin_id,
        })
        .select("id")
        .single();

      if (userErr || !newUser) {
        results.push({ email, status: "error", reason: userErr?.message || "Insert failed" });
        continue;
      }

      // Create their demo trading account with the balance the admin specified for this batch
      const { error: acctErr } = await supabaseAdmin.from("demo_accounts").insert({
        user_id: newUser.id,
        balance: demo_balance,
        currency: "USD",
        funded_by: "admin_grant",
      });

      if (acctErr) {
        results.push({ email, status: "error", reason: `User created but demo account failed: ${acctErr.message}` });
        continue;
      }

      // Deliberately NOT inserting fabricated demo_trades here.
      // Trade history should only appear once the student actually practices trading.

      results.push({ email, status: "created" });
    }

    const summary = {
      total: students.length,
      created: results.filter((r) => r.status === "created").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
    };

    return NextResponse.json({ summary, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}