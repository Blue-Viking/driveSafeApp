import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaShoppingCart, FaTrash, FaArrowLeft } from 'react-icons/fa';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const [colorTheme, setColorTheme] = useState('blue');
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';
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

  async function fetchWishlist() {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      const res = await fetch(`/api/wishlist/view?user_id=${sess.user_id}`);
      const data = await res.json();
      setWishlistItems(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      setError('Failed to load wishlist.');
    }
  }

  async function addToCart(productId) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: sess.user_id, product_id: productId }),
      });

      await removeFromWishlist(productId, false);
      router.push('/cart');
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  }

  async function removeFromWishlist(productId, refresh = true) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: sess.user_id, product_id: productId }),
      });

      if (refresh) {
        setWishlistItems((prev) => prev.filter(item => item.product_id !== productId));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  }

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-8 transition">
      
      {/* Back to Home button */}
      <div className="mb-6">
        <Link
          href="/homepage"
          className={`inline-flex items-center px-4 py-2 ${getButtonColor()} text-white rounded-lg transition`}
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {wishlistItems.map((item) => (
            <div key={item.product_id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col p-6 hover:shadow-lg transition">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-48 w-full object-contain mb-4"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                {item.name}
              </h2>
              <p className="mt-2 text-green-600 font-bold">
                {item.price_in_points} pts
              </p>
              <div className="mt-4 flex flex-col gap-3 items-center">
                <button
                  onClick={() => addToCart(item.product_id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-full justify-center transition"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 w-full justify-center transition"
                >
                  <FaTrash />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
