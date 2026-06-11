// pages/addDriver.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AddDriver() {
  const [sponsors, setSponsors] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    sponsorId: "",
  });
  const router = useRouter();

  // load sponsor list
  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then(setSponsors)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
        sponsorId: parseInt(form.sponsorId, 10),
      }),
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
      <h1 className="text-2xl font-bold mb-6">Add Driver</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <label className="block">
          Username
          <input
            required
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Password
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Assign to Sponsor
          <select
            required
            value={form.sponsorId}
            onChange={(e) =>
              setForm({ ...form, sponsorId: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Sponsor --</option>
            {sponsors.map((s) => (
              <option key={s.sponsor_id} value={s.sponsor_id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Driver
        </button>
      </form>
    </div>
);
}

