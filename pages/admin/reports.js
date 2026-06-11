import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ReportsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("all");
  const [mostActiveUser, setMostActiveUser] = useState(null);
  const [topActiveUsers, setTopActiveUsers] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/reports/audit-logs");
        const result = await res.json();
        if (result.success) {
          setLogs(result.data);
          setFilteredLogs(result.data);
        } else {
          console.error("Failed to load audit logs:", result.message);
        }
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  useEffect(() => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (reportType === "last24h") {
      setFilteredLogs(logs.filter((log) => new Date(log.created_at) > cutoff));
      setMostActiveUser(null);
      setTopActiveUsers([]);
    } else if (reportType === "mostActive") {
      const userCounts = {};
      logs.forEach((log) => {
        const uid = log.user_id ?? "Anonymous";
        userCounts[uid] = (userCounts[uid] || 0) + 1;
      });
      const topUser = Object.entries(userCounts)
        .map(([uid, count]) => ({ uid, count }))
        .sort((a, b) => b.count - a.count)[0];
      setMostActiveUser(topUser);
      setFilteredLogs([]);
      setTopActiveUsers([]);
    } else if (reportType === "topActive") {
      const recentLogs = logs.filter((log) => new Date(log.created_at) > cutoff);
      const userCounts = {};
      recentLogs.forEach((log) => {
        const uid = log.user_id ?? "Anonymous";
        userCounts[uid] = (userCounts[uid] || 0) + 1;
      });
      const sorted = Object.entries(userCounts)
        .map(([uid, count]) => ({ uid, count }))
        .sort((a, b) => b.count - a.count);
      setTopActiveUsers(sorted);
      setFilteredLogs([]);
      setMostActiveUser(null);
    } else if (reportType === "successful") {
      setFilteredLogs(logs.filter((log) => log.action_status?.toLowerCase() === "success"));
      setMostActiveUser(null);
      setTopActiveUsers([]);
    } else if (reportType === "loginAttempts") {
      setFilteredLogs(logs.filter((log) =>
        log.action_type?.toLowerCase().includes("login")
      ));
      setMostActiveUser(null);
      setTopActiveUsers([]);
    } else {
      setFilteredLogs(logs);
      setMostActiveUser(null);
      setTopActiveUsers([]);
    }
  }, [reportType, logs]);

  function triggerCSVDownload(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  }

  function downloadCSV() {
    let csvContent = "";

    if (reportType === "mostActive" && mostActiveUser) {
      csvContent = `User ID,Total Actions\n${mostActiveUser.uid},${mostActiveUser.count}`;
      triggerCSVDownload(csvContent, "most_active_user.csv");
      return;
    }

    if (reportType === "topActive" && topActiveUsers.length > 0) {
      csvContent =
        "User ID,Total Actions\n" +
        topActiveUsers.map((u) => `${u.uid},${u.count}`).join("\n");
      triggerCSVDownload(csvContent, "top_active_users.csv");
      return;
    }

    if (filteredLogs.length === 0) return;

    const headers = [
      "ID",
      "User ID",
      "Action",
      "Status",
      "Description",
      "IP Address",
      "Timestamp",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.user_id ?? "Anonymous",
      log.action_type,
      log.action_status,
      `"${log.action_description}"`,
      log.ip_address,
      new Date(log.created_at).toLocaleString(),
    ]);

    csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    triggerCSVDownload(csvContent, `audit_report_${reportType}.csv`);
  }

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen">
      <button
        onClick={() => router.push("/adminDash")}
        className="mb-6 inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        ← Back to Admin Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Audit Logs Report</h1>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded text-sm"
          >
            <option value="all">All Logs</option>
            <option value="last24h">Recent Activity (Last 24h)</option>
            <option value="mostActive">Most Active User</option>
            <option value="topActive">Top Active Users (Last 24h)</option>
            <option value="successful">Successful Actions Only</option>
            <option value="loginAttempts">Login Attempts Only</option>
          </select>

          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : reportType === "mostActive" && mostActiveUser ? (
        <div className="bg-gray-50 border p-4 rounded shadow w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-2">Most Active User</h2>
          <p className="text-sm">User ID: <strong>{mostActiveUser.uid}</strong></p>
          <p className="text-sm">Total Actions: <strong>{mostActiveUser.count}</strong></p>
        </div>
      ) : reportType === "topActive" && topActiveUsers.length > 0 ? (
        <div className="overflow-x-auto bg-white border p-4 rounded shadow w-full md:w-2/3">
          <h2 className="text-lg font-semibold mb-4">Top Active Users (Last 24h)</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">User ID</th>
                <th className="border px-4 py-2 text-left">Total Actions</th>
              </tr>
            </thead>
            <tbody>
              {topActiveUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{user.uid}</td>
                  <td className="border px-4 py-2">{user.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Action</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">IP Address</th>
                <th className="px-4 py-2 border">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{log.id}</td>
                  <td className="px-4 py-2 border">{log.user_id ?? "Anonymous"}</td>
                  <td className="px-4 py-2 border">{log.action_type}</td>
                  <td className="px-4 py-2 border">{log.action_status}</td>
                  <td className="px-4 py-2 border">{log.action_description}</td>
                  <td className="px-4 py-2 border">{log.ip_address}</td>
                  <td className="px-4 py-2 border">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
