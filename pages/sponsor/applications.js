// pages/sponsor/applications.js
import { useState, useEffect } from "react";
import { useRouter }            from "next/router";

export default function SponsorApplications() {
  const router = useRouter();
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const capitalize = (s) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => {
    const rawSession = localStorage.getItem("userSession") || "{}";
    const sess = JSON.parse(rawSession);
    if (sess.role !== "sponsor_user" || !sess.sponsor_id) {
      return router.replace("/login");
    }

    fetch(`/api/driver-applications?sponsor_id=${sess.sponsor_id}`, {
      headers: { "x-user-session": rawSession },
    })
      .then((r) => r.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error loading sponsor apps:", e);
        setError("Failed to load applications.");
        setLoading(false);
      });
  }, [router]);

  const handleChange = async (id, newStatus) => {
    const rawSession = localStorage.getItem("userSession") || "{}";
    const sess = JSON.parse(rawSession);
    if (sess.role !== "sponsor_user") return;

    let reason = "";
    reason = prompt(`Enter reason for ${capitalize(newStatus)}:`);
    if (reason == null) return;

    const res = await fetch(`/api/driver-applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
      console.error("Failed to update status:", await res.text());
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Driver Applications</h1>
      <table className="w-full bg-white rounded shadow overflow-hidden text-left">
        <thead className="bg-gray-200 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-2">Driver</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Reason</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => {
            const stat = a.status.toLowerCase();
            const isPending  = stat === 'pending' || stat === 'open';
            const isAccepted = stat === 'accepted';
            const isRejected = stat === 'rejected';
            return (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{a.driver_name}</td>
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2 capitalize">{a.status}</td>
                <td className="px-4 py-2">{a.reason || '—'}</td>
                <td className="px-4 py-2 space-x-2">
                  {isPending && (
                    <>
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleChange(a.id, 'accepted')}
                      >Accept</button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleChange(a.id, 'rejected')}
                      >Reject</button>
                    </>
                  )}
                  {isAccepted && (
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleChange(a.id, 'rejected')}
                    >Reject</button>
                  )}
                  {isRejected && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => handleChange(a.id, 'accepted')}
                    >Accept</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

