import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { setCookie, destroyCookie } from "nookies";

export default function Login() {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [colorTheme, setColorTheme] = useState("blue");  // Default to blue
  const router = useRouter();

  useEffect(() => {
    // Load the color theme from localStorage and apply dark mode if necessary
    const savedColorTheme = localStorage.getItem("colorTheme") || "blue";
    setColorTheme(savedColorTheme);
    
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        destroyCookie(null, "userId");
        destroyCookie(null, "session");
        destroyCookie(null, "user");

        localStorage.setItem(
          "userSession",
          JSON.stringify({
            user_id: data.user.user_id,
            role: data.user.role,
            sponsor_id: data.user.sponsor_id,
          })
        );

        setCookie(null, "userId", data.user.user_id, {
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        setMessage("Login successful! Redirecting…");
        setMessageType("success");

        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/adminDash");
          } else if (data.user.role === "driver") {
            router.push("/homepage");
          } else if (data.user.role === "sponsor_user") {
            router.push("/sponsor-dashboard");
          } else {
            router.push("/homepage");
          }
        }, 1000);
      } else {
        setMessage(data.error || "Invalid credentials.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    }

    setTimeout(() => setMessage(null), 3000);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-white mb-6">Login</h1>
        {message && (
          <div
            className={`mb-4 p-3 text-center rounded-lg ${
              messageType === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
            Username:
          </label>
          <input
            name="username"
            type="text"
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg"
          />
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mt-3">
            Password:
          </label>
          <input
            name="password"
            type="password"
            required
            className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg"
          />
          <button
            type="submit"
            className={`${getButtonColor()} w-full mt-4 px-6 py-3 text-white text-lg font-semibold rounded-lg hover:bg-blue-700`}
          >
            Login
          </button>
        </form>
        <button
          onClick={() => router.push("/signup")}
          className={`${getButtonColor()} w-full mt-4 px-6 py-3 text-white text-lg font-semibold rounded-lg hover:bg-blue-700`}
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full mt-4 px-6 py-3 bg-gray-500 text-white text-lg font-semibold rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
}
