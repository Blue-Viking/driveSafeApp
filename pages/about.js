import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const About = () => {
  const router = useRouter();
  const [colorTheme, setColorTheme] = useState("blue");  // Default color is blue

  useEffect(() => {
    // Load color theme from localStorage
    const savedColorTheme = localStorage.getItem("colorTheme") || "blue";
    setColorTheme(savedColorTheme);

    // Apply dark mode
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Function to handle going back to the previous page
  const handleBackClick = () => {
    router.back();  // Go back to the previous page in history
  };

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
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white">
          About TruckBucks
        </h1>

        <div className="text-lg text-gray-700 space-y-2 mb-8">
          <p><strong>Team#:</strong> 12</p>
          <p><strong>Version:</strong> 12</p>
          <p><strong>Released:</strong> February 26, 2025</p>
          <p><strong>Product:</strong> TruckBucks</p>
          <p><strong>Program:</strong> Good Driver Incentive Program</p>
        </div>

        <div className="prose prose-sm text-gray-600 text-center mb-10">
          <p>TruckBucks rewards safe and reliable truck drivers through a simple points system. Drivers earn points for good behavior, safe driving, and meeting company goals.</p>
          <p>Points can be redeemed for bonuses, gift cards, and recognition. Sponsors can track driver performance, manage rewards, and engage with drivers easily through the platform.</p>
          <p>TruckBucks is secure, easy to use, and designed to support the trucking community.</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBackClick}
            className={`${getButtonColor()} px-6 py-3 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
