import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaHome, FaHeart, FaShoppingCart, FaSignOutAlt, FaSync, FaCog, FaQuestion } from "react-icons/fa";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    sessionStorage.removeItem("userSession");
    router.push("/logout");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const sess = JSON.parse(localStorage.getItem('userSession') || '{}');
      if (!sess.user_id) return;

      try {
        const res = await fetch(`/api/orders/view?user_id=${sess.user_id}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full shadow-lg z-50">
        <div className="flex space-x-6">
          <Link href="/homepage" className="hover:text-gray-300" title="Home"><FaHome size={22} /></Link>
          <Link href="/wishlist" className="hover:text-gray-300" title="Wishlist"><FaHeart size={22} /></Link>
          <Link href="/cart" className="hover:text-gray-300" title="Cart"><FaShoppingCart size={22} /></Link>
          <Link href="/settings" className="hover:text-gray-300" title="Settings"><FaCog size={22} /></Link>
          <Link href="/contact" className="hover:text-gray-300" title="Contact"><FaQuestion size={22} /></Link>
        </div>

        <button onClick={handleLogout} className="hover:text-gray-300" title="Logout">
          <FaSignOutAlt size={22} />
        </button>
      </nav>

      <div className="mt-24 bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Past Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-500">You have no past orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date Placed</th>
                  <th className="px-6 py-3">Time Placed</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Points Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id} className="bg-white border-b">
                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.order_id}</th>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">{order.time}</td>
                    <td className="px-6 py-4">{order.items.join(", ")}</td>
                    <td className="px-6 py-4">{order.total_points} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/homepage" passHref>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

