// pages/adminDash.js
import { useState } from "react";
import Link from "next/link";
import SponsorDriverList from "../components/SponsorDriverList";
import {
  FaHome,
  FaUserFriends,
  FaChartBar,
  FaSignOutAlt,
  FaUserPlus,
  FaUserTie,
  FaUserEdit,
  FaIdBadge,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handlePeopleClick() {
    setSidebarOpen(true);
  }

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <div className="flex space-x-6 items-center">
          <Link href="/" className="hover:text-gray-400">
            <FaHome className="text-xl" />
          </Link>
          <button onClick={handlePeopleClick} className="hover:text-gray-400">
            <FaUserFriends className="text-xl" />
          </button>
          <Link href="/admin/reports" className="hover:text-gray-400">
            <FaChartBar className="text-xl" />
          </Link>
        </div>
        <Link href="/logout" className="hover:text-gray-400">
          <FaSignOutAlt className="text-xl" />
        </Link>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-gray-700 mb-10 text-center">
          Welcome to the Admin Dashboard!
        </h1>

        {/* Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
          {/* Add Driver */}
          <Link
            href="/addDriver"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaUserPlus className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">Add Driver</h2>
            <p className="text-gray-800 text-sm">
              Create a new driver account and assign to sponsor.
            </p>
          </Link>

          {/* Add Sponsor */}
          <Link
            href="/addSponsor"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaUserTie className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">Add Sponsor</h2>
            <p className="text-gray-800 text-sm">
              Register a new sponsor to the system.
            </p>
          </Link>

          {/* Edit User */}
          <Link
            href="/editUser"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaUserEdit className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">Edit User</h2>
            <p className="text-gray-800 text-sm">
              Search and modify user details or reset roles.
            </p>
          </Link>

          {/* My Profile */}
          <Link
            href="/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaIdBadge className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">My Profile</h2>
            <p className="text-gray-800 text-sm">
              View or update your profile information.
            </p>
          </Link>

          {/* View Driver Applications */}
          <Link
            href="/admin/applications"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaClipboardList className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              View Driver Applications
            </h2>
            <p className="text-gray-800 text-sm">
              Review all pending, accepted, or rejected applications.
            </p>
          </Link>

          {/* Catalog Management */}
          <Link
            href="/admin/catalog"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg text-center"
          >
            <FaBoxOpen className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Catalog Management
            </h2>
            <p className="text-gray-800 text-sm">
              View and edit each sponsor’s catalog of rewards.
            </p>
          </Link>
        </div>
      </div>

      {/* Sidebar for Sponsor/Driver List */}
      <SponsorDriverList open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}

