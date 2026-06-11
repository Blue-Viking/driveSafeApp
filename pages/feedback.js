import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaHeart, FaShoppingCart, FaSignOutAlt, FaStar, FaCog, FaQuestion } from "react-icons/fa";

export default function Feedback() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [colorTheme, setColorTheme] = useState('blue');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';

      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setColorTheme(savedColorTheme);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    router.push("/logout");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedback = { rating, question1, question2, email, comment };

    try {
      const res = await fetch('/api/save-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        alert("Thank you for your feedback!");
        setRating(0);
        setHover(0);
        setEmail("");
        setComment("");
        setQuestion1("");
        setQuestion2("");
      } else {
        const error = await res.json();
        alert(`Failed to submit feedback: ${error.message}`);
      }
    } catch (err) {
      console.error("Feedback error:", err);
      alert("There was an error sending your feedback. Try again later.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
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
        <button onClick={handleLogout} className={`text-gray-200 dark:text-white ${getHoverColor()} transition`} title="Logout">
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pt-24 px-4">
        <h1 className="text-2xl text-gray-700 dark:text-white mb-6">We’d love your feedback!</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full max-w-2xl">
          {/* Star Rating */}
          <div className="mb-6 text-center">
            <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">How would you rate your experience?</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer ${
                    (hover || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>

          {/* Survey Question 1 */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              How easy was it to redeem points?
            </label>
            <div className="flex space-x-6">
              {["Poor", "OK", "Great"].map((option) => (
                <label key={option} className="text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    value={option}
                    checked={question1 === option}
                    onChange={() => setQuestion1(option)}
                    className="mr-1"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Survey Question 2 */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              How satisfied are you with the available rewards?
            </label>
            <div className="flex space-x-6">
              {["Poor", "OK", "Great"].map((option) => (
                <label key={option} className="text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    value={option}
                    checked={question2 === option}
                    onChange={() => setQuestion2(option)}
                    className="mr-1"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Your Email (optional)
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded py-2 px-3 shadow-sm focus:outline-none focus:ring"
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Additional Comments (optional)
            </label>
            <textarea
              id="comment"
              rows="4"
              placeholder="Let us know how we can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded py-2 px-3 shadow-sm focus:outline-none focus:ring resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`${getButtonColor()} text-white font-semibold py-2 px-4 rounded transition`}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
