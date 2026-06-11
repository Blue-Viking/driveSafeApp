// pages/driver/apply.js

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/router';

export default function DriverApply() {
  const [sponsors, setSponsors] = useState([]);
  const [form, setForm]         = useState({ sponsorId: '', name: '' });
  const router                  = useRouter();

  useEffect(() => {
    fetch('/api/sponsors')
      .then((r) => r.json())
      .then(setSponsors)
      .catch(console.error);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const rawSession =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('userSession') || localStorage.getItem('userSession')
        : null;
    if (!rawSession) {
      alert('Please log in first');
      return router.push('/login');
    }

    const { sponsorId, name } = form;
    if (!sponsorId || !name.trim()) {
      alert('Sponsor and name are required');
      return;
    }

    const payload = {
      sponsor_id: parseInt(sponsorId, 10),
      name: name.trim(),
    };

    const res = await fetch('/api/driver-applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-session': rawSession,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      router.push('/driver/apply-success');
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Error submitting application');
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Apply as Driver</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block mb-1">Choose Sponsor</span>
          <select
            required
            value={form.sponsorId}
            onChange={e => setForm({ ...form, sponsorId: e.target.value })}
            className="block w-full mt-1 p-2 border rounded"
          >
            <option value="">-- Select --</option>
            {sponsors.map(s => (
              <option key={s.sponsor_id} value={s.sponsor_id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block mb-1">Full Name</span>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

