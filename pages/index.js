import { useEffect, useState } from 'react';
import '../src/app/globals.css'; // Adjust based on your structure
import Link from 'next/link';

export default function Home() {
  const [colorTheme, setColorTheme] = useState("blue");  // Default to blue

  useEffect(() => {
    // Load the color theme from localStorage
    const savedColorTheme = localStorage.getItem("colorTheme") || "blue";
    setColorTheme(savedColorTheme);

    // Apply dark mode if it's saved in localStorage
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Helper function to get button color based on selected theme
  const getButtonColor = () => {
    switch (colorTheme) {
      case "red":
        return "bg-red-600 hover:bg-red-700";
      case "orange":
        return "bg-orange-500 hover:bg-orange-600";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700";
      case "green":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";  // Default is blue
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition">
      <h1 className="text-5xl font-bold text-blue-600 dark:text-white mb-6">TruckBucks</h1>
      <h2 className="text-2xl font-semibold mt-8 text-gray-800 dark:text-gray-200">Get Started:</h2>

      {/* Login Button */}
      <Link
        href="/login"
        className={`${getButtonColor()} w-64 px-6 py-3 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition mb-4 flex items-center justify-center text-center`}
      >
        Login
      </Link>

      {/* Sign Up Button */}
      <Link
        href="/signup"
        className={`${getButtonColor()} w-64 px-6 py-3 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition mb-4 flex items-center justify-center text-center`}
      >
        Sign Up
      </Link>

      {/* About Page Button */}
      <Link
        href="/about"
        className="w-64 px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition mb-4 flex items-center justify-center text-center"
      >
        Learn More
      </Link>

      <p className="flex items-end justify-center h-screen pb-2 text-gray-700 dark:text-gray-300">
        This is the home page for Team 12s Senior Design Project.
      </p>
    </div>
  );
}
