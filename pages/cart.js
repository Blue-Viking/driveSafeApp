import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [newPointsBalance, setNewPointsBalance] = useState(0);
  const [flashMessage, setFlashMessage] = useState('');
  const [error, setError] = useState(null);
  const [colorTheme, setColorTheme] = useState('blue');
  const router = useRouter();

  useEffect(() => {
    fetchCart();
    fetchPoints();

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

  async function fetchCart() {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      const res = await fetch(`/api/cart/view?user_id=${sess.user_id}`);
      const data = await res.json();
      setCartItems(data);
      updateNewPoints(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart.');
    }
  }

  async function fetchPoints() {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      const res = await fetch(`/api/get-points?user_id=${sess.user_id}`);
      const data = await res.json();
      setCurrentPoints(data.availablePoints);
      setNewPointsBalance(data.availablePoints);
    } catch (err) {
      console.error('Error fetching points:', err);
    }
  }

  function updateNewPoints(cart) {
    const total = cart.reduce((sum, item) => sum + item.price_in_points * item.quantity, 0);
    setNewPointsBalance(prev => currentPoints - total);
  }

  async function handleQuantityChange(productId, newQuantity) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    if (newQuantity <= 0) {
      await handleRemove(productId);
      return;
    }

    await fetch('/api/cart/updateQuantity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: sess.user_id, product_id: productId, quantity: newQuantity }),
    });

    const updatedCart = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    updateNewPoints(updatedCart);
  }

  async function handleRemove(productId) {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: sess.user_id, product_id: productId }),
    });

    const updatedCart = cartItems.filter(item => item.product_id !== productId);
    setCartItems(updatedCart);
    updateNewPoints(updatedCart);
  }

  async function handleCheckout() {
    const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!sess.user_id) return;

    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: sess.user_id }),
      });

      if (!res.ok) throw new Error('Checkout failed');
      
      const data = await res.json();

      setFlashMessage('Order placed successfully!');
      setCartItems([]);
      setCurrentPoints(data.newBalance);
      setNewPointsBalance(data.newBalance);

      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Checkout failed.');
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
        Your Cart
      </h1>

      {flashMessage && (
        <div className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 p-4 rounded-md mb-8 text-center max-w-xl mx-auto">
          {flashMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-700 dark:text-white">
            Current Points: <span className="font-bold">{currentPoints}</span>
          </p>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="divide-y dark:divide-gray-700">
              {cartItems.map((item) => (
                <div key={item.product_id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="h-16 w-16 object-contain" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.price_in_points} pts each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                      className="border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded w-16 text-center"
                    />
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700 dark:text-white mb-4">
                Points After Order: <span className="font-bold">{newPointsBalance >= 0 ? newPointsBalance : 0}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg transition"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
