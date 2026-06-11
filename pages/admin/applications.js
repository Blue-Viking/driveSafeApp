// pages/admin/applications.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminApplications() {
  const router = useRouter();

  // session + auth guard
  const rawSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem("userSession") ||
        localStorage.getItem("userSession")
      : null;
  let session;
  try {
    session = rawSession ? JSON.parse(rawSession) : {};
  } catch {
    session = {};
  }
  useEffect(() => {
    if (!session.user_id || session.role !== "admin") {
      router.replace("/login");
    }
  }, [router, session]);

  // sponsors list
  const [sponsors, setSponsors]           = useState([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);

  useEffect(() => {
    fetch("/api/sponsors", {
      headers: { "x-user-session": rawSession },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setSponsors(data))
      .catch((err) => {
        console.error("Failed to load sponsors:", err);
        setSponsors([]);
      })
      .finally(() => setLoadingSponsors(false));
  }, [rawSession]);

  // currently‐selected sponsor filter
  const [selectedSponsor, setSelectedSponsor] = useState("");

  // applications list + loading/error
  const [apps, setApps]               = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError]             = useState(null);

  // re‐fetch apps whenever selectedSponsor changes
  useEffect(() => {
    const fetchApps = async () => {
      setLoadingApps(true);
      setError(null);

      // build URL with sponsor_id only if one is selected
      const params = new URLSearchParams();
      if (selectedSponsor) {
        params.append("sponsor_id", selectedSponsor);
      }
      const url = `/api/driver-applications${params.toString() ? `?${params}` : ""}`;

      try {
        const res = await fetch(url, {
          headers: { "x-user-session": rawSession },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading applications:", err);
        setError("Could not load applications.");
      } finally {
        setLoadingApps(false);
      }
    };

    fetchApps();
  }, [selectedSponsor, rawSession]);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const updateStatus = async (id, newStatus) => {
    const reason = prompt(`Please enter a reason for "${capitalize(newStatus)}":`);
    if (reason === null) return;

    const res = await fetch(`/api/driver-applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type":   "application/json",
        "x-user-session": rawSession,
      },
      body: JSON.stringify({ status: newStatus, reason }),
    });

    if (res.ok) {
      setApps((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus, reason } : a
        )
      );
    } else {
      console.error("Failed to update:", await res.text());
      alert("Failed to save decision.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Driver Applications</h1>

      <div className="mb-6">
        <label htmlFor="sponsor" className="block text-lg font-medium mb-2">
          Select Sponsor (leave blank for All)
        </label>
        <select
          id="sponsor"
          className="w-72 p-2 border rounded text-gray-900"
          value={selectedSponsor}
          onChange={(e) => setSelectedSponsor(e.target.value)}
        >
          <option value="">— All Sponsors —</option>
          {loadingSponsors ? (
            <option disabled>Loading sponsors…</option>
          ) : (
            sponsors.map((s) => (
              <option key={s.sponsor_id} value={s.sponsor_id}>
                {s.name}
              </option>
            ))
          )}
        </select>
      </div>

      {loadingApps ? (
        <p>Loading applications…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : apps.length === 0 ? (
        <p className="italic text-gray-600">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow overflow-hidden text-left">
            <thead className="bg-gray-200 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-2">Driver</th>
                <th className="px-4 py-2">Sponsor</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {apps.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{a.driver_name}</td>
                  <td className="px-4 py-2">{a.sponsor_name || "—"}</td>
                  {/* use top‐level `name` field returned by the API */}
                  <td className="px-4 py-2">{a.name}</td>
                  <td className="px-4 py-2">{a.reason || "—"}</td>
                  <td className="px-4 py-2">
                    <select
                      className="p-1 border rounded"
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                    >
                      <option value={a.status} disabled>
                        {capitalize(a.status)}
                      </option>
                      {["accepted", "rejected"]
                        .filter((opt) => opt !== a.status)
                        .map((opt) => (
                          <option key={opt} value={opt}>
                            {capitalize(opt)}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

