// pages/driver/apply-success.js

import Link from 'next/link';

export default function ApplySuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Application Submitted</h1>
        <p className="mb-6">
          Thank you! Your driver application is now pending review by your sponsor.
        </p>
        <Link
          href="/driver/sponsors"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View My Sponsors
        </Link>
      </div>
    </div>
  );
}

