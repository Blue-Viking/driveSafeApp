// pages/sponsor/edit-driver.js
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function SponsorEditDriver() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [formValues, setFormValues] = useState({ username: "", email: "" })
  const router = useRouter()

  useEffect(() => {
    // pull sponsor_id from session
    let sponsorId = null
    const raw = localStorage.getItem("userSession")
    if (raw) {
      try {
        const sess = JSON.parse(raw)
        sponsorId = sess.sponsor_id
      } catch {}
    }
    if (!sponsorId) return

    // note: we now pass `sponsor_id` to match our API
    fetch(`/api/users?role=driver&sponsor_id=${sponsorId}`)
      .then((res) => res.json())
      .then(setDrivers)
  }, [])

  const handleOpen = (driver) => {
    setSelectedDriver(driver)
    setFormValues({
      username: driver.username,
      email: driver.email,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch(`/api/users/${selectedDriver.user_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formValues.username,
        email: formValues.email,
      }),
    })
    setSelectedDriver(null)
    router.reload()
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl mb-4">Edit Driver</h1>
      <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Edit</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {drivers.map((driver) => (
            <tr
              key={driver.user_id}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-2 px-4">{driver.username}</td>
              <td className="py-2 px-4">{driver.email}</td>
              <td className="py-2 px-4">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleOpen(driver)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDriver && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-4 rounded-md shadow-md"
        >
          <h2 className="text-xl mb-2">
            Update {selectedDriver.username}
          </h2>
          <input
            type="text"
            value={formValues.username}
            onChange={(e) =>
              setFormValues({ ...formValues, username: e.target.value })
            }
            className="mb-2 w-full p-2 border rounded-md"
            placeholder="Username"
          />
          <input
            type="email"
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
            className="mb-2 w-full p-2 border rounded-md"
            placeholder="Email"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  )
}

