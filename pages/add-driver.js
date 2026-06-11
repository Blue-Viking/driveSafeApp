// pages/add-driver.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AddDriver() {
  const router = useRouter();
  const [form, setForm]         = useState({ username: "", email: "", password: "" });
  const [sponsorId, setSponsorId] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    // Grab our stored session object
    const raw = sessionStorage.getItem("userSession") ||
                localStorage.getItem("userSession");
    if (!raw) {
      setError("Not logged in.");
      setLoading(false);
      return;
    }

    let session;
    try {
      session = JSON.parse(raw);
    } catch {
      setError("Invalid session data.");
      setLoading(false);
      return;
    }

    // Must be sponsor_user with a sponsor_id
    if (session.role !== "sponsor_user" || !session.sponsor_id) {
      setError("You are not authorized to add drivers.");
      setLoading(false);
      return;
    }

    // Save their sponsor_id into state
    setSponsorId(session.sponsor_id);
    setLoading(false);
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, password } = form;
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!sponsorId) {
      setError("Sponsor ID missing. Cannot submit.");
      return;
    }

    // Re‐grab the session string for our API header
    const raw = sessionStorage.getItem("userSession") ||
                localStorage.getItem("userSession");

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-session": raw,
        },
        body: JSON.stringify({
          username,
          email,
          password,
          sponsor_id: sponsorId,   // <-- send this exact field name
        }),
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Failed to add driver.");
      }

      setSuccess("Driver created successfully!");
      setForm({ username: "", email: "", password: "" });

      setTimeout(() => router.push("/sponsor-dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // If they’re not authorized, show login prompt
  if (error && !sponsorId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Driver
        </h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Create Driver
          </button>
        </form>
      </div>
    </div>
  );
}

