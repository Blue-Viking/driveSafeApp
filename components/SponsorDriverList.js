// components/SponsorDriverList.js

import { useState, useEffect } from "react";

export default function SponsorDriverList({ open, onClose }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetch("/api/sponsors-with-drivers")
        .then((res) => res.json())
        .then((data) => {
          setSponsors(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch sponsors", err);
          setLoading(false);
        });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Sponsors & Drivers</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
      </div>

      {loading ? (
        <div className="p-4">Loading...</div>
      ) : (
        <div className="p-4 space-y-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.sponsor_id}>
              <div className="font-semibold text-gray-800">{sponsor.sponsor_name}</div>
              <ul className="ml-4 list-disc text-gray-600">
                {sponsor.drivers.length > 0 ? sponsor.drivers.map((driver) => (
                  <li key={driver.user_id}>{driver.username}</li>
                )) : (
                  <li className="italic text-sm text-gray-400">No drivers</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

