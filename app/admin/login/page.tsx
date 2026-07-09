import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    missing_fields: "Please enter both email and password.",
    invalid_credentials: "Incorrect email or password.",
    not_authorized: "This account is not authorized for admin access.",
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: "2rem",
        border: "1px solid #333",
        borderRadius: 12,
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Admin Login
      </h1>

      {error && (
        <div style={{ color: "#ff5c5c", marginBottom: 16, fontSize: 14 }}>
          {errorMessages[error] || "Something went wrong. Please try again."}
        </div>
      )}

      <form action={login}>
        <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Email</label>
        <input
          type="email"
          name="email"
          required
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6 }}
        />

        <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Password</label>
        <input
          type="password"
          name="password"
          required
          style={{ width: "100%", padding: 10, marginBottom: 24, borderRadius: 6 }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#111",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Log in
        </button>
      </form>
    </div>
  );
}