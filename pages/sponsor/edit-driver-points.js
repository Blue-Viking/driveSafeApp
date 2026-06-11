// pages/sponsor/edit-driver-points.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditDriverPoints() {
  const router = useRouter();
  const [sponsors, setSponsors]     = useState([]);
  const [formStates, setFormStates] = useState({});
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    // load session and guard
    const raw = sessionStorage.getItem("userSession") ||
                localStorage.getItem("userSession");
    if (!raw) return router.replace("/login");

    let sess;
    try {
      sess = JSON.parse(raw);
    } catch {
      return router.replace("/login");
    }
    if (sess.role !== "sponsor_user" || !sess.sponsor_id) {
      return router.replace("/login");
    }

    // fetch drivers for this sponsor only
    fetch(`/api/sponsors-with-drivers?sponsor_id=${sess.sponsor_id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // filter out any other sponsors, just in case API returned more
        const own = Array.isArray(data)
          ? data.filter((s) => s.sponsor_id === sess.sponsor_id)
          : [];
        setSponsors(own);
        setLoading(false);
      })
      .catch((err) => {
        console.error("fetch error", err);
        setError("Could not load drivers.");
        setLoading(false);
      });
  }, [router]);

  function handleInputChange(driverId, field, value) {
    setFormStates((prev) => ({
      ...prev,
      [driverId]: {
        ...prev[driverId],
        [field]: value,
      },
    }));
  }

  function handleSubmit(driverId) {
    const formData = formStates[driverId] || {};
    if (!formData.amount || !formData.reason) {
      alert("Please fill in points and reason.");
      return;
    }
    const delta =
      formData.direction === "-"
        ? -Math.abs(formData.amount)
        : Math.abs(formData.amount);

    fetch("/api/points-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        driver_id: driverId,
        delta,
        reason: formData.reason,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        alert("Points updated successfully.");
        setFormStates((prev) => ({
          ...prev,
          [driverId]: { direction: "+", amount: "", reason: "" },
        }));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update points.");
      });
  }

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Driver Points
      </h1>

      {sponsors.length > 0 ? (
        sponsors.map((sponsor) => (
          <div key={sponsor.sponsor_id} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {sponsor.sponsor_name}
            </h2>

            {sponsor.drivers.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left text-gray-700">
                      Driver
                    </th>
                    <th className="py-2 px-4 text-left text-gray-700">+/-</th>
                    <th className="py-2 px-4 text-left text-gray-700">
                      Points
                    </th>
                    <th className="py-2 px-4 text-left text-gray-700">
                      Reason
                    </th>
                    <th className="py-2 px-4 text-left text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sponsor.drivers.map((driver) => (
                    <tr key={driver.user_id} className="border-t">
                      <td className="p-4 text-gray-800">{driver.username}</td>
                      <td className="p-4">
                        <select
                          className="border rounded px-2 py-1"
                          value={
                            formStates[driver.user_id]?.direction || "+"
                          }
                          onChange={(e) =>
                            handleInputChange(
                              driver.user_id,
                              "direction",
                              e.target.value
                            )
                          }
                        >
                          <option value="+">+</option>
                          <option value="-">-</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-20"
                          value={formStates[driver.user_id]?.amount || ""}
                          onChange={(e) =>
                            handleInputChange(
                              driver.user_id,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="0"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-40"
                          value={formStates[driver.user_id]?.reason || ""}
                          onChange={(e) =>
                            handleInputChange(
                              driver.user_id,
                              "reason",
                              e.target.value
                            )
                          }
                          placeholder="Why?"
                        />
                      </td>
                      <td className="p-4">
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          onClick={() => handleSubmit(driver.user_id)}
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="italic text-gray-600">
                No drivers yet for this sponsor.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="italic text-gray-600">
          No drivers available for your sponsor.
        </p>
      )}

      <div className="text-center mt-8">
        <Link
          href="/sponsor-dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

