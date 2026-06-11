import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const DriverDetails = () => {
  const [driver, setDriver] = useState({});
  const [sponsors, setSponsors] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Fetch driver details
      fetch(`/api/driver-details/${id}`)
        .then((res) => res.json())
        .then((data) => setDriver(data))
        .catch((err) => setError('Error fetching driver data'));

      // Fetch sponsors
      fetch('/api/sponsors')
        .then((res) => res.json())
        .then((data) => setSponsors(data))
        .catch((err) => setError('Error fetching sponsors'));
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedDriver = {
        ...driver,
        sponsor_id: driver.sponsor_id, // ensure sponsor_id is updated in the state
      };

      const res = await fetch(`/api/driver-details/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDriver),
      });

      if (!res.ok) {
        throw new Error('Error saving driver data');
      }

      alert('Changes saved successfully!');
    } catch (err) {
      alert('Error saving changes');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/driver-details/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error deleting driver');
      }

      alert('Driver deleted successfully!');
      router.push('/driver'); // Redirect after deletion
    } catch (err) {
      alert('Error deleting driver');
    }
  };

  const handleBack = () => {
    router.push('/driver'); // Go back to the driver list
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-800 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Driver Details</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={driver.username || ''}
              onChange={(e) => setDriver({ ...driver, username: e.target.value })}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={driver.email || ''}
              onChange={(e) => setDriver({ ...driver, email: e.target.value })}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={driver.password || ''}
              onChange={(e) => setDriver({ ...driver, password: e.target.value })}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm text-black"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sponsor" className="block text-sm font-medium text-gray-700">
              Sponsor
            </label>
            <select
              id="sponsor"
              name="sponsor"
              value={driver.sponsor_id || ''}
              onChange={(e) => setDriver({ ...driver, sponsor_id: e.target.value })}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm text-black"
            >
              <option value="">Select Sponsor</option>
              {sponsors.map((sponsor) => (
                <option key={sponsor.sponsor_id} value={sponsor.sponsor_id}>
                  {sponsor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete User
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverDetails;

