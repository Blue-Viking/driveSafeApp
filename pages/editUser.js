import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function EditUser() {
  const [users, setUsers] = useState([])
  // change initial value if you like; here we keep 'driver' as before
  const [roleFilter, setRoleFilter] = useState('driver')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    // map the dropdown value to your backend’s role name
    const apiRole = roleFilter === 'sponsor' ? 'sponsor_user' : roleFilter

    fetch(`/api/users?role=${apiRole}`)
      .then((res) => res.json())
      .then(setUsers)
  }, [roleFilter])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await fetch(`/api/users/${selectedUser.user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: selectedUser.username,
        email: selectedUser.email,
        password: newPassword,
        points:
          selectedUser.role === 'driver'
            ? selectedUser.points
            : undefined,
      }),
    })

    setSelectedUser(null)
    setNewPassword('')
    router.reload()
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="mb-4 p-2 border rounded-md bg-white shadow-sm"
      >
        <option value="admin">Admins</option>
        {/* keep the dropdown value 'sponsor' for UX, but map it above */}
        <option value="sponsor">Sponsors</option>
        <option value="driver">Drivers</option>
      </select>

      <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Email</th>
            {roleFilter === 'driver' && (
              <th className="py-2 px-4">Points</th>
            )}
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Edit</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {users.map((user) => (
            <tr
              key={user.user_id}
              className="border-b hover:bg-gray-50"
            >
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.email}</td>
              {roleFilter === 'driver' && (
                <td className="py-2 px-4">{user.points}</td>
              )}
              <td className="py-2 px-4">
                {/* make the display friendlier if you like */}
                {user.role === 'sponsor_user'
                  ? 'Sponsor'
                  : user.role.charAt(0).toUpperCase() +
                    user.role.slice(1)}
              </td>
              <td className="py-2 px-4">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setSelectedUser(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-4 rounded-md shadow-md"
        >
          <input
            type="text"
            value={selectedUser.username}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                username: e.target.value,
              })
            }
            className="mb-2 w-full p-2 border rounded-md"
          />
          <input
            type="email"
            value={selectedUser.email}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                email: e.target.value,
              })
            }
            className="mb-2 w-full p-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-2 w-full p-2 border rounded-md"
          />
          {selectedUser.role === 'driver' && (
            <input
              type="number"
              value={selectedUser.points}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  points: e.target.value,
                })
              }
              className="mb-2 w-full p-2 border rounded-md"
            />
          )}
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

