// components/DriverSidebar.js
import { useEffect, useState } from "react";

export default function DriverSidebar({ open, onClose, sponsorId }) {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // only fetch when sidebar is open *and* we have a real sponsorId
    if (!open || sponsorId == null) return;

    fetch(`/api/users?role=driver&sponsor_id=${sponsorId}`)
      .then((res) => res.json())
      .then(setDrivers)
      .catch(console.error);
  }, [open, sponsorId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 z-20"
      onClick={onClose}
    >
      <div
        className="absolute top-0 left-0 bg-white w-64 h-full shadow-lg p-4 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-gray-600 hover:text-gray-900 mb-4"
          onClick={onClose}
        >
          Close
        </button>
        <h2 className="text-lg font-semibold mb-2">My Drivers</h2>
        <ul className="list-disc list-inside space-y-1">
          {drivers.map((d) => (
            <li key={d.user_id}>{d.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

