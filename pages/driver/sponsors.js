// pages/driver/sponsors.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { setCookie, parseCookies } from "nookies";

export default function DriverSponsors() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function findRawSession() {
    for (let store of [localStorage, sessionStorage]) {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (/session|user/i.test(key)) {
          const raw = store.getItem(key);
          if (raw) return raw;
        }
      }
    }
    return null;
  }

  useEffect(() => {
    let raw = null;
    try {
      raw = findRawSession();
    } catch {
      raw = null;
    }
    if (!raw) {
      router.replace("/login");
      return;
    }

    let sess;
    try {
      sess = JSON.parse(raw);
    } catch {
      router.replace("/login");
      return;
    }

    const userId =
      sess.user_id ||
      sess.id ||
      sess.user?.user_id ||
      sess.user?.id ||
      null;

    if (!userId) {
      router.replace("/login");
      return;
    }

    // Check if the userId cookie is missing, and set it
    const cookies = parseCookies();
    if (!cookies.userId) {
      setCookie(null, "userId", userId.toString(), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    // Now fetch without any query params, using cookies
    fetch(`/api/driver-sponsors`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSponsors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("fetch error", err);
        setError("Could not load your sponsors.");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <p className="p-6 text-center">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">My Approved Sponsors</h1>
      {sponsors.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sponsors.map((s) => (
            <div key={s.sponsor_id} className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p>Email: {s.contact_email}</p>
              <p>Phone: {s.contact_phone}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-600 mb-12">
          You don’t have any approved sponsors yet.
        </p>
      )}
      <div className="text-center">
        <Link
          href="/driver/apply"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply for a New Sponsor
        </Link>
      </div>
    </div>
  );
}

