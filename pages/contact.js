import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaHeart, FaShoppingCart, FaSignOutAlt, FaCog, FaQuestion } from "react-icons/fa";

export default function Contact() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setColorTheme(savedColorTheme);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    router.push("/logout");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "mkomisa@g.clemson.edu",
          subject: "CONCERN",
          text: `From: ${email}\n\n${message}`,
          html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Message sent! 🎉");
        setEmail("");
        setMessage("");
      } else {
        console.error("Send error:", result);
        alert(`Failed to send message: ${result.message}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

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

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        {/* Left Side Icons */}
        <div className="flex space-x-6">
          <Link href="/homepage" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Home">
            <FaHome size={22} />
          </Link>
          <Link href="/wishlist" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Wishlist">
            <FaHeart size={22} />
          </Link>
          <Link href="/cart" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Cart">
            <FaShoppingCart size={22} />
          </Link>
          <Link href="/settings" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Settings">
            <FaCog size={22} />
          </Link>
          <Link href="/contact" className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Contact">
            <FaQuestion size={22} />
          </Link>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Logout">
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      {/* Page Content */}
      <div className="flex flex-col items-center justify-center pt-24 px-4">
        <h1 className="text-2xl text-gray-700 dark:text-white mb-6">Contact Us</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="shadow appearance-none border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded w-full py-2 px-3 text-gray-700 leading-tight resize-none focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className={`${getButtonColor()} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
