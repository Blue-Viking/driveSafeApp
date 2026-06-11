// pages/addSponsor.js

import { useState } from "react";
import { useRouter } from "next/router";

export default function AddSponsor() {
  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/sponsors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/adminDash");
    } else {
      const err = await res.json();
      alert("Error: " + (err.error || res.statusText));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Add Sponsor</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <label className="block">
          Organization Name
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Contact Email
          <input
            required
            type="email"
            value={form.contact_email}
            onChange={(e) =>
              setForm({ ...form, contact_email: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Contact Phone
          <input
            required
            type="text"
            value={form.contact_phone}
            onChange={(e) =>
              setForm({ ...form, contact_phone: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create Sponsor
        </button>
      </form>
    </div>
  );
}

