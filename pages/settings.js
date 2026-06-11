import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [colorTheme, setColorTheme] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [compactMode, setCompactMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "light");
    setColorTheme(localStorage.getItem("colorTheme") || "blue");
    setFontSize(localStorage.getItem("fontSize") || "medium");
    setFontFamily(localStorage.getItem("fontFamily") || "Arial");
    setCompactMode(localStorage.getItem("compactMode") === "true");
    setDisplayName(localStorage.getItem("displayName") || "");
    setProfilePicture(localStorage.getItem("profilePicture") || null);

    applyTheme(localStorage.getItem("theme") || "light");
    applyFontSize(localStorage.getItem("fontSize") || "medium");
    applyFontFamily(localStorage.getItem("fontFamily") || "Arial");
    applyCompactLayout(localStorage.getItem("compactMode") === "true");
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const applyFontSize = (size) => {
    document.documentElement.style.setProperty('--font-size', size);
  };

  const applyFontFamily = (family) => {
    document.documentElement.style.setProperty('--font-family', family);
  };

  const applyCompactLayout = (isCompact) => {
    if (isCompact) {
      document.documentElement.classList.add("compact-mode");
    } else {
      document.documentElement.classList.remove("compact-mode");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);  // Store the base64 image URL
      };
      reader.readAsDataURL(file);  // Convert the image to base64
    }
  };

  const handleSave = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorTheme", colorTheme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("compactMode", compactMode);
    localStorage.setItem("displayName", displayName);
    if (profilePicture) {
      localStorage.setItem("profilePicture", profilePicture);
    }

    applyTheme(theme);
    applyFontSize(fontSize);
    applyFontFamily(fontFamily);
    applyCompactLayout(compactMode);
    alert("Settings saved!");
  };

  const handleReset = () => {
    localStorage.clear();
    setTheme("light");
    setColorTheme("blue");
    setFontSize("medium");
    setFontFamily("Arial");
    setCompactMode(false);
    setDisplayName("");
    setProfilePicture(null);
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("compact-mode");
  };

  const getButtonColor = () => {
    switch (colorTheme) {
      case "red": return "bg-red-600 hover:bg-red-700";
      case "orange": return "bg-orange-500 hover:bg-orange-600";
      case "purple": return "bg-purple-600 hover:bg-purple-700";
      case "green": return "bg-green-600 hover:bg-green-700";
      default: return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <div className="pt-24 px-8 min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <h1 className="text-3xl font-bold text-black dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-xl p-6 max-w-3xl mb-12">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">User Preferences</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Accent Color</label>
          <select
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          >
            <option value="blue">Blue (Default)</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
          </select>
        </div>

        {/* Font Size Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Font Size</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Font Family Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Font Style</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full border dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Courier New">Courier New</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>

        <label className="flex items-center space-x-3">
          <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
          <span>Enable Compact Layout</span>
        </label>
      </div>

      <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-xl p-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Account Settings</h2>

        <div className="mb-6 flex flex-col items-center">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
          ) : (
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="text-sm text-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-black dark:text-white mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border dark:border-gray-700 rounded-lg px-4 py-2 text-black bg-white dark:bg-gray-700 dark:text-white"
            placeholder="John Doe"
          />
        </div>

        <div className="flex space-x-4 mt-6">
          <button onClick={handleSave} className={`${getButtonColor()} text-white px-6 py-2 rounded-lg transition`}>Save Settings</button>
          <button onClick={handleReset} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">Reset All</button>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/homepage"
          className={`w-64 px-6 py-3 ${getButtonColor()} text-white text-lg font-semibold rounded-lg transition text-center`}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
