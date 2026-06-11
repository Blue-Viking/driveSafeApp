import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaHome, FaHeart, FaShoppingCart, FaSignOutAlt, FaSync, FaCog, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';

export default function DriverDashboard() {
  const [pointsData, setPointsData] = useState([
    { label: 'Available Points', value: 0 },
    { label: 'Points Earned This Month', value: 0 },
    { label: 'Points Deducted', value: 0 },
    { label: 'Points Spent', value: 0 },
    { label: 'Total Points All Time', value: 0 },
  ]);
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [displayName, setDisplayName] = useState("");  // Keep this as it was originally
  const [colorTheme, setColorTheme] = useState("blue");
  const [compactMode, setCompactMode] = useState(false); // Compact Mode state
  const [fontSize, setFontSize] = useState("medium"); // Font size state
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load theme from localStorage and apply it
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark'); // Ensure dark mode is applied
    } else {
      document.documentElement.classList.remove('dark');
    }

    const raw = localStorage.getItem('userSession');
    if (raw) {
      try {
        const sess = JSON.parse(raw);
        if (sess.user_id) setUserId(sess.user_id);
      } catch {}
    }

    const pic = localStorage.getItem('profilePicture');
    if (pic) {
      setProfilePicture(pic);
    }

    const name = localStorage.getItem('displayName');
    if (name) {
      setDisplayName(name);  // Fetch display name from localStorage
    }

    const savedColorTheme = localStorage.getItem("colorTheme") || "blue";
    setColorTheme(savedColorTheme);
    const savedCompactMode = localStorage.getItem("compactMode") === "true";
    setCompactMode(savedCompactMode);
    const savedFontSize = localStorage.getItem("fontSize") || "medium"; // Load font size
    setFontSize(savedFontSize);

    // Apply settings (theme, compact layout, and font size)
    applyCompactLayout(savedCompactMode);
    applyFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const res = await fetch(`/api/get-points?user_id=${userId}`);
      const data = await res.json();
      setPointsData([
        { label: 'Available Points', value: data.availablePoints },
        { label: 'Points Earned This Month', value: data.earnedThisMonth },
        { label: 'Points Deducted', value: data.pointsDeducted },
        { label: 'Points Spent', value: data.pointsSpent },
        { label: 'Total Points All Time', value: data.totalPoints },
      ]);
    })();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    router.push('/logout');
  };

  const applyCompactLayout = (isCompact) => {
    if (isCompact) {
      document.documentElement.classList.add("compact-layout");
    } else {
      document.documentElement.classList.remove("compact-layout");
    }
  };

  const applyFontSize = (size) => {
    document.documentElement.style.setProperty('--font-size', size);  // Set the font size globally
  };

  const getButtonColor = () => {
    switch (colorTheme) {
      case 'red': return 'bg-red-600 hover:bg-red-700';
      case 'orange': return 'bg-orange-500 hover:bg-orange-600';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getTextColor = () => {
    switch (colorTheme) {
      case 'red': return 'text-red-500 hover:text-red-600';
      case 'orange': return 'text-orange-500 hover:text-orange-600';
      case 'purple': return 'text-purple-500 hover:text-purple-600';
      case 'green': return 'text-green-500 hover:text-green-600';
      default: return 'text-blue-500 hover:text-blue-600';
    }
  };

  const navigationItems = [
    { name: 'Redeem Points', link: '/redeem', image: '/images/redeemPoints.png' },
    { name: 'Browse Catalog', link: '/catalog', image: '/images/browseCatalog.png' },
    { name: 'Driving Goals', link: '/goals', image: '/images/myGoals.png' },
    { name: 'My Orders', link: '/orders', image: '/images/myOrders.png' },
    { name: 'My Sponsors', link: '/driver/sponsors', image: '/images/mySponsors.png' },
    { name: 'My Account', link: '/profile', image: '/images/myProfile.png' },
    { name: 'Submit Feedback', link: '/feedback', image: '/images/feedback.png' },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between fixed top-0 w-full z-50 items-center">
        <div className="flex space-x-6">
          <Link href="/homepage" className="hover:text-gray-300">
            <FaHome size={22} />
          </Link>
          <Link href="/wishlist" className="hover:text-gray-300">
            <FaHeart size={22} />
          </Link>
          <Link href="/cart" className="hover:text-gray-300">
            <FaShoppingCart size={22} />
          </Link>
          <Link href="/settings" className="hover:text-gray-300">
            <FaCog size={22} />
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            <FaQuestionCircle size={22} />
          </Link>
          <Link href="/about" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="About">
            <FaInfoCircle size={22} />
          </Link>
        </div>

        {/* Right side: profile picture + display name + logout */}
        <div className="flex items-center space-x-4">
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          )}
         {displayName && (
            <span className="text-white font-medium">{displayName}</span> 
          )}
          <button onClick={handleLogout} className="hover:text-gray-300" title="Logout">
            <FaSignOutAlt size={22} />
          </button>
        </div>
      </nav>

      <div className="pt-24 px-8 max-w-[1440px] mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-12">
          Welcome to the Driver Dashboard!
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">Your Points</h2>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => userId && router.replace(router.asPath)}
                className={`${getTextColor()} flex items-center`}
              >
                <FaSync className="mr-2" /> Refresh
              </button>
              <Link href="/pointsHistory" className={`${getTextColor()} hover:underline`}>
                See More
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {pointsData.map((item, idx) => (
              <div
                key={idx}
                className={`${getButtonColor()} text-white p-6 rounded-lg text-center shadow-md hover:shadow-xl transition-all`}
              >
                <p className="text-4xl font-extrabold">{item.value}</p>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full overflow-x-auto mb-20">
          <div className="flex space-x-6 min-w-[850px] px-2">
            {navigationItems.map((item, idx) => {
              const href =
                item.link === '/catalog' && userId
                  ? { pathname: '/catalog', query: { userId } }
                  : item.link;

              return (
                <Link
                  key={idx}
                  href={href}
                  className="min-w-[160px] bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-6 rounded-xl border shadow-md flex flex-col items-center transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="mb-3"
                  />
                  <p className="text-md font-medium text-gray-700 dark:text-gray-300">{item.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
