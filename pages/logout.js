import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay before redirecting
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img src="/images/loadingBar.gif" alt="Loading..." className="w-40 mb-4" />
      <h1 className="text-xl text-gray-700">Logging out...</h1>
    </div>
  );
}

