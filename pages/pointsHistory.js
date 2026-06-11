import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PointsHistory() {
  const [pointsChanges, setPointsChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedColor = localStorage.getItem('colorTheme') || 'blue';

      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setColorTheme(savedColor);
    }

    const session = JSON.parse(localStorage.getItem('userSession') || 'null');
    if (!session?.user_id) {
      setLoading(false);
      return;
    }
    setUserId(session.user_id);

    fetch(`/api/points-change?userId=${session.user_id}`)
      .then((res) => res.json())
      .then((data) => setPointsChanges(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getLinkColor = () => {
    switch (colorTheme) {
      case 'red': return 'text-red-500 hover:text-red-600';
      case 'orange': return 'text-orange-500 hover:text-orange-600';
      case 'purple': return 'text-purple-500 hover:text-purple-600';
      case 'green': return 'text-green-500 hover:text-green-600';
      default: return 'text-blue-500 hover:text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
        <p className="text-gray-500 dark:text-gray-300">Loading your points history…</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8 transition">
      <h1 className="text-3xl text-gray-800 dark:text-white font-bold text-center mb-6">
        Points History{userId && ` for Driver #${userId}`}
      </h1>

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-700">
              <th className="p-3 text-left text-gray-700 dark:text-gray-300">Date</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-300">Time</th>
              <th className="p-3 text-left text-gray-700 dark:text-gray-300">Reason</th>
              <th className="p-3 text-center text-gray-700 dark:text-gray-300">Change</th>
              <th className="p-3 text-right text-gray-700 dark:text-gray-300">After</th>
            </tr>
          </thead>
          <tbody>
            {pointsChanges.length > 0 ? (
              pointsChanges.map((e) => (
                <tr key={e.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 text-gray-600 dark:text-gray-400">{e.date}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{e.time}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{e.reason}</td>
                  <td
                    className={`p-3 text-center font-bold ${
                      e.change.startsWith('+')
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {e.change}
                  </td>
                  <td className="p-3 text-right text-gray-600 dark:text-gray-400">{e.after}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  {userId
                    ? 'No point‐change records found for you.'
                    : 'You’re not logged in yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Back Button */}
      <div className="text-center mt-6">
        <Link href="/homepage" className={`${getLinkColor()} text-lg transition`}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
