// pages/profile.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FaHome,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaCog,
  FaQuestion,
} from "react-icons/fa";

export default function Profile() {
  const [username, setUsername]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentEmail,    setCurrentEmail]    = useState("");
  const [flashMessage,   setFlashMessage]     = useState("");
  const [errorMessage,   setErrorMessage]     = useState("");
  const [loading,        setLoading]          = useState(true);

  const router = useRouter();

  // read session from storage once
  const rawSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem("userSession") ||
        localStorage.getItem("userSession")
      : null;

  let session, userId, userRole;
  try {
    session   = rawSession && JSON.parse(rawSession);
    userId    = session?.user_id;
    userRole  = session?.role;
  } catch {
    session   = null;
    userId    = null;
    userRole  = null;
  }

  useEffect(() => {
    if (!rawSession || !userId || !userRole) {
      router.replace("/login");
      return;
    }

    // include both id and role in the query so the API won't 400
    const url = `/api/user?id=${userId}&role=${encodeURIComponent(userRole)}`;
    console.log("Fetching profile from:", url);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type":   "application/json",
        "x-user-session": rawSession,
      },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          router.replace("/login");
          return null;
        }
        if (!res.ok) {
          const text = await res.text();
          console.error(`GET ${url} →`, res.status, text);
          throw new Error(`Unexpected status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setCurrentUsername(data.username);
          setCurrentEmail(data.email);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, rawSession, userId, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (errorMessage && !currentUsername) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-600 mb-4">
          Failed to load profile: {errorMessage}
        </p>
        <button
          onClick={() => router.replace("/login")}
          className="px-4 py-2 bg-gray-800 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const updates = {};
    if (username && username !== currentUsername) updates.username = username;
    if (email    && email    !== currentEmail)    updates.email    = email;
    if (password)                             updates.password = password;

    if (Object.keys(updates).length === 0) {
      setFlashMessage("No changes detected.");
      return;
    }
    if (updates.email && !isValidEmail(updates.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type":   "application/json",
          "x-user-session": rawSession,
        },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setFlashMessage("Profile updated successfully!");
        setErrorMessage("");
        if (updates.username) {
          setCurrentUsername(updates.username);
          setUsername("");
        }
        if (updates.email) {
          setCurrentEmail(updates.email);
          setEmail("");
        }
        if (updates.password) {
          setPassword("");
        }
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("userSession");
    }
    router.replace("/login");
  };

  const getButtonColor = () => {
    if (typeof window === "undefined") return "bg-blue-500 hover:bg-blue-600";
    return localStorage.getItem("theme") === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6 pt-24 transition">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        <div className="flex space-x-6">
          <Link href="/homepage" title="Home">
            <FaHome size={22} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" />
          </Link>
          <Link href="/wishlist" title="Wishlist">
            <FaHeart size={22} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" />
          </Link>
          <Link href="/cart" title="Cart">
            <FaShoppingCart size={22} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" />
          </Link>
          <Link href="/settings" title="Settings">
            <FaCog size={22} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" />
          </Link>
          <Link href="/contact" title="Contact">
            <FaQuestion size={22} className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition" />
          </Link>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-gray-200 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 transition"
        >
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center mt-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Account Information
          </h2>

          {flashMessage && (
            <p className="mb-4 text-green-600 dark:text-green-400">{flashMessage}</p>
          )}
          {errorMessage && (
            <p className="mb-4 text-red-600 dark:text-red-400">{errorMessage}</p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block mb-4 text-gray-700 dark:text-gray-300">
              Reset username:
              <input
                type="text"
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={currentUsername || "Loading..."}
              />
            </label>

            <label className="block mb-4 text-gray-700 dark:text-gray-300">
              Reset email:
              <input
                type="email"
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentEmail || "Loading..."}
              />
            </label>

            <label className="block mb-4 text-gray-700 dark:text-gray-300">
              Reset password:
              <input
                type="password"
                className="w-full p-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </label>

            <button
              type="submit"
              className={`w-full ${getButtonColor()} text-white py-2 rounded-lg mb-2 transition`}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
            >
              Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

