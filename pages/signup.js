import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // To navigate back

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "driver", // Default role
  });

  const [message, setMessage] = useState(null);
  const [colorTheme, setColorTheme] = useState("blue"); // Default to blue theme

  // Handle changes to form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: formData.role, // Store selected role in DB
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage({ type: "success", text: "Sign-up successful! Redirecting..." });

      setTimeout(() => {
        if (formData.role === "admin") {
          router.push("/adminDash");
        } else if (formData.role === "driver") {
          router.push("/homepage");
        } else if (formData.role === "sponsor") {
          router.push("/dashboard/sponsor");
        } else {
          router.push("/homepage"); // Default redirection
        }
      }, 2000);
    } else {
      setMessage({ type: "error", text: data.error || "Sign-up failed" });
    }
  };

  useEffect(() => {
    // Load saved theme from localStorage
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

  // Helper function to return button color based on the selected theme
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">Sign Up</h1>

        {/* Flash Message */}
        {message && (
          <div
            className={`mb-4 p-3 text-center rounded-lg ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Email */}
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-3">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Password */}
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-3">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Confirm Password */}
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-3">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />

          {/* Role Selection */}
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-3">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="driver">Driver</option>
            <option value="sponsor">Sponsor</option>
            <option value="admin">Admin</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            {/* Back Button */}
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              onClick={() => router.back()} // Go to the previous page
            >
              Back
            </button>

            {/* Login Button (Small, Right-Aligned) */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>

          {/* Large Sign Up Button (Centered at the Bottom) */}
          <button
            type="submit"
            className={`${getButtonColor()} w-full mt-4 px-6 py-3 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition`}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
