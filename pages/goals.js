import { useState, useEffect } from "react"; 
import { useRouter } from "next/router";
import Link from "next/link";
import { FaHome, FaHeart, FaShoppingCart, FaSignOutAlt, FaSync, FaCog, FaQuestion } from "react-icons/fa";

export default function DrivingGoals() {
  const router = useRouter();
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "light";
      const savedColor = localStorage.getItem("colorTheme") || "blue";

      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      setColorTheme(savedColor);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    router.push("/logout");
  };

  const goodDrivingRules = [
    { rule: "Follow speed limits", points: "+10" },
    { rule: "Use turn signals", points: "+5" },
    { rule: "Maintain safe following distance", points: "+8" },
    { rule: "Yield to pedestrians", points: "+7" },
    { rule: "Complete full stops at stop signs", points: "+6" }
  ];

  const badDrivingRules = [
    { rule: "Running a red light", points: "-20" },
    { rule: "Not wearing a seatbelt", points: "-10" },
    { rule: "Using phone while driving", points: "-15" },
    { rule: "Tailgating other vehicles", points: "-12" },
    { rule: "Illegal lane changes", points: "-8" }
  ];

  const getLinkColor = () => {
    switch (colorTheme) {
      case 'red': return 'text-red-500 hover:text-red-600';
      case 'orange': return 'text-orange-500 hover:text-orange-600';
      case 'purple': return 'text-purple-500 hover:text-purple-600';
      case 'green': return 'text-green-500 hover:text-green-600';
      default: return 'text-blue-500 hover:text-blue-600';
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8 pt-24 transition">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        <div className="flex space-x-6">
          <Link href="/homepage" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Home">
            <FaHome size={22} />
          </Link>
          <Link href="/wishlist" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Wishlist">
            <FaHeart size={22} />
          </Link>
          <Link href="/cart" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Cart">
            <FaShoppingCart size={22} />
          </Link>
          <Link href="/settings" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Settings">
            <FaCog size={22} />
          </Link>
          <Link href="/contact" className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Contact">
            <FaQuestion size={22} />
          </Link>
        </div>

        <button onClick={handleLogout} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" title="Logout">
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      {/* Page Title */}
      <h1 className="text-3xl text-gray-800 dark:text-white font-bold text-center mb-6">
        Driving Goals
      </h1>
      
      {/* Driving Rules */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-4">Good Driving Practices</h2>
        <ul className="mb-6">
          {goodDrivingRules.map((item, index) => (
            <li key={index} className="flex justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">{item.rule}</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">{item.points}</span>
            </li>
          ))}
        </ul>
      
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-4">Bad Driving Habits</h2>
        <ul>
          {badDrivingRules.map((item, index) => (
            <li key={index} className="flex justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300">{item.rule}</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">{item.points}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center mt-6">
        <Link href="/homepage" className={`${getLinkColor()} text-lg transition`}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
