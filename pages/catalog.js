import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';

export default function CatalogPage() {
  const [sponsorId, setSponsorId] = useState(null);
  const [catalogItems, setCatalogItems] = useState([]);
  const [inWishlist, setInWishlist] = useState(new Set());
  const [inCart, setInCart] = useState(new Set());
  const [error, setError] = useState(null);
  const [cartPreviewVisible, setCartPreviewVisible] = useState(false);
  const [colorTheme, setColorTheme] = useState('blue');
  const router = useRouter();

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

    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (sess.sponsor_id) setSponsorId(sess.sponsor_id);
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

  useEffect(() => {
    if (!sponsorId) return;
    fetch(`/api/sponsors/catalog?sponsorId=${sponsorId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCatalogItems(data);
      })
      .catch((err) => {
        console.error('Could not load catalog:', err);
        setError('Could not load catalog.');
      });
  }, [sponsorId]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (!sess.user_id) return;

      try {
        const res = await fetch(`/api/wishlist/view?user_id=${sess.user_id}`);
        const data = await res.json();
        const wishlistIds = new Set(data.map(item => item.product_id));
        setInWishlist(wishlistIds);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
    };

    fetchWishlist();
  }, []);

  async function toggleWishlist(itemId) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    const isInWishlist = inWishlist.has(itemId);
    const url = isInWishlist ? '/api/wishlist/remove' : '/api/wishlist/add';

    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: sess.user_id, product_id: itemId }),
      });

      setInWishlist((prev) => {
        const next = new Set(prev);
        if (isInWishlist) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    }
  }

  async function addToCart(itemId) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: sess.user_id, product_id: itemId }),
      });

      setInCart((s) => {
        const next = new Set(s);
        next.add(itemId);
        return next;
      });

      if (inWishlist.has(itemId)) {
        await fetch('/api/wishlist/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: sess.user_id, product_id: itemId }),
        });

        setInWishlist((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
      }

      setCartPreviewVisible(true);
    } catch (err) {
      console.error('Could not add to cart:', err);
    }
  }

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!sponsorId) return <p className="p-6 text-center text-gray-600 dark:text-gray-400">Loading…</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-8 transition relative">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Available Rewards
      </h1>

      {catalogItems.length === 0 ? (
        <p className="italic text-gray-600 dark:text-gray-400 text-center">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {catalogItems.map((item) => (
            <div key={item.product_id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden flex flex-col p-6 hover:shadow-lg transition">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-48 w-full object-contain mb-4"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-700 dark:text-white">{item.name}</h2>
              <p className="mt-2 text-green-600 font-bold">{item.price_in_points} pts</p>
              <div className="mt-4 flex justify-center gap-6">
                <button
                  onClick={() => toggleWishlist(item.product_id)}
                  className={`text-2xl ${
                    inWishlist.has(item.product_id)
                      ? 'text-red-500'
                      : 'text-gray-400 dark:text-gray-500'
                  } hover:text-red-600 transition`}
                >
                  <FaHeart />
                </button>
                <button
                  onClick={() => addToCart(item.product_id)}
                  className={`text-2xl ${
                    inCart.has(item.product_id)
                      ? 'text-green-600'
                      : 'text-gray-400 dark:text-gray-500'
                  } hover:text-green-700 transition`}
                >
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cart Preview */}
      {cartPreviewVisible && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 w-64 flex flex-col items-center transition">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Cart Updated!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{inCart.size} items in cart</p>
          <button
            onClick={() => router.push('/cart')}
            className={`${getButtonColor()} text-white px-4 py-2 rounded-lg text-sm font-medium transition`}
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
