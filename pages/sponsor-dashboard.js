// pages/sponsor-dashboard.js
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  FaHome,
  FaSignOutAlt,
  FaUsers,
  FaUserEdit,
  FaFileAlt,
  FaClipboardList,
  FaArchive,
  FaIdBadge,
} from "react-icons/fa"
import DriverSidebar from "../components/DriverSidebar"

export default function SponsorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sponsorId, setSponsorId] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem("userSession")
    if (raw) {
      try {
        const sess = JSON.parse(raw)
        setSponsorId(sess.sponsor_id ?? null)
      } catch {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    window.location.href = "/logout"
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-gray-900 text-white p-4 flex justify-between fixed top-0 w-full z-10">
        <div className="flex space-x-6 items-center">
          <Link href="/sponsor-dashboard" className="hover:text-gray-400">
            <FaHome size={24} />
          </Link>
          <Link href="/reports" className="hover:text-gray-400">
            <FaFileAlt size={24} />
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="hover:text-gray-400"
            title="My Drivers"
          >
            <FaUsers size={24} />
          </button>
        </div>
        <button onClick={handleLogout} className="hover:text-gray-400">
          <FaSignOutAlt size={24} />
        </button>
      </nav>

      <div className="pt-20 px-4 flex flex-col items-center">
        <h1 className="text-2xl text-gray-700 mb-12">
          Welcome to the Sponsor Dashboard!
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 w-full max-w-6xl">
          <Link
            href="/add-driver"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaUsers className="mx-auto mb-2 text-gray-700" size={32} />
            <p className="font-semibold text-gray-700">Add New Driver</p>
          </Link>

          {/* New tile for editing driver details */}
          <Link
            href="/sponsor/edit-driver"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaUserEdit className="mx-auto mb-2 text-gray-700" size={32} />
            <p className="font-semibold text-gray-700">Edit Driver</p>
          </Link>

          <Link
            href="/sponsor/edit-driver-points"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaFileAlt className="mx-auto mb-2 text-gray-700" size={32} />
            <p className="font-semibold text-gray-700">
              Edit Driver Points
            </p>
          </Link>

          <Link
            href="/sponsor/applications"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaClipboardList
              className="mx-auto mb-2 text-gray-700"
              size={32}
            />
            <p className="font-semibold text-gray-700">View Applications</p>
          </Link>

          <Link
            href="/sponsor/catalog"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaArchive className="mx-auto mb-2 text-gray-700" size={32} />
            <p className="font-semibold text-gray-700">
              Catalog Management
            </p>
          </Link>

          <Link
            href="/profile"
            className="p-6 bg-gray-200 border rounded shadow hover:bg-gray-300 text-center"
          >
            <FaIdBadge className="mx-auto mb-2 text-gray-700" size={32} />
            <p className="font-semibold text-gray-700">My Profile</p>
          </Link>
        </div>
      </div>

      <DriverSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sponsorId={sponsorId}
      />
    </div>
  )
}

