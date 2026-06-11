import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaHome, FaHeart, FaShoppingCart,
  FaSignOutAlt, FaCog, FaQuestion
} from 'react-icons/fa';

export default function Redeem() {
  const [showForm, setShowForm] = useState(false);
  const [miles, setMiles] = useState('');
  const [minutes, setMinutes] = useState('');
  const [trips, setTrips] = useState('');
  const [pointsRedeemed, setPointsRedeemed] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [colorTheme, setColorTheme] = useState('blue');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('userSession');
      if (raw) {
        try {
          const sess = JSON.parse(raw);
          if (sess.user_id) setUserId(sess.user_id);
        } catch {}
      }

      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';

      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setColorTheme(savedColorTheme);
    }
  }, []);

  const getButtonColor = () => {
    switch (colorTheme) {
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getHoverColor = () => {
    switch (colorTheme) {
      case 'red': return 'hover:text-red-400';
      case 'orange': return 'hover:text-orange-400';
      case 'purple': return 'hover:text-purple-400';
      case 'green': return 'hover:text-green-400';
      default: return 'hover:text-blue-400';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    router.push('/logout');
  };

  const MILES_MULTIPLIER = 2;
  const MINUTES_MULTIPLIER = 1;
  const TRIPS_MULTIPLIER = 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const mi = parseInt(miles) || 0;
    const mm = parseInt(minutes) || 0;
    const tt = parseInt(trips) || 0;
    const total = mi * MILES_MULTIPLIER + mm * MINUTES_MULTIPLIER + tt * TRIPS_MULTIPLIER;

    try {
      await fetch('/api/points/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          sponsor_user_id: null,
          changeAmount: total,
          reason: `Driving report: ${mi}mi, ${mm}min, ${tt}trips`
        }),
      });
      setPointsRedeemed(total);
      setSubmissionCount(c => c + 1);
      setMiles('');
      setMinutes('');
      setTrips('');
      setShowForm(false);

      router.push('/homepage');
    } catch (err) {
      console.error(err);
      alert('Error submitting driving report');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between fixed top-0 w-full z-50">
        <div className="flex space-x-6">
          <Link href="/homepage" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
            <FaHome size={22} />
          </Link>
          <Link href="/wishlist" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
            <FaHeart size={22} />
          </Link>
          <Link href="/cart" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
            <FaShoppingCart size={22} />
          </Link>
          <Link href="/settings" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
            <FaCog size={22} />
          </Link>
          <Link href="/contact" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
            <FaQuestion size={22} />
          </Link>
        </div>
        <button onClick={handleLogout} className={`text-gray-200 dark:text-white ${getHoverColor()} transition`}>
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      {/* Page Content */}
      <div className="flex flex-col items-center min-h-screen pt-24 px-4">
        <h1 className="text-2xl text-gray-700 dark:text-white mb-6 text-center">
          Submit a Driving Report to Redeem Points
        </h1>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className={`px-6 py-3 ${getButtonColor()} text-white text-lg font-semibold rounded-lg transition`}
          >
            {submissionCount === 0 ? 'New Driving Report' : 'Submit Another Report'}
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mt-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Enter Driving Data
            </h2>

            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Miles:
              <input
                type="number"
                value={miles}
                onChange={e => setMiles(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded mt-1"
                required
              />
            </label>

            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Minutes:
              <input
                type="number"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded mt-1"
                required
              />
            </label>

            <label className="block mb-4 text-gray-700 dark:text-gray-300">
              Trips:
              <input
                type="number"
                value={trips}
                onChange={e => setTrips(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded mt-1"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
            >
              Submit Report
            </button>
          </form>
        )}

        {pointsRedeemed !== null && !showForm && (
          <div className="mt-6 text-center">
            <div className="text-lg font-semibold text-green-700 dark:text-green-400">
              Points Redeemed: {pointsRedeemed}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
