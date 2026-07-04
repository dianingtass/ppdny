import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getStoredAuthUser } from "../utils/authStorage";
import { TriangleAlert } from "lucide-react";

const ROLE_DASHBOARD = {
  santri:       "/santri",
  orangtua:     "/orangtua",
  wali:         "/orangtua",
  pengurus:     "/pengurus",
  pimpinan:     "/pimpinan",
  ustadz:       "/ustadz",
  admin:        "/admin",
  timkesehatan: "/timkesehatan",
};

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
          const token = getAuthToken();
          const user = getStoredAuthUser();
          
          if (!token || !user) {
            navigate("/login", { replace: true });
            return 0;
          }

          let userRole = "";
          if (typeof user.role === "string") {
            userRole = user.role.toLowerCase();
          } else if (Array.isArray(user.user_role) && user.user_role.length > 0) {
            userRole = user.user_role[0]?.role?.role?.toLowerCase() || "";
          }

          const redirectTo = ROLE_DASHBOARD[userRole] ?? "/login";
          navigate(redirectTo, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100">
        <h1 className="text-9xl font-extrabold text-yellow-500 flex justify-center"><TriangleAlert className="w-32 h-32"/></h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6 text-sm">Halaman yang Anda cari tidak ada.</p>
        
        <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mb-6">
          Silakan kembali ke halaman sebelumnya atau Anda akan diarahkan ke Dashboard dalam <span className="font-semibold text-green-600 text-lg">{countdown}</span> detik.
        </p>

        <button
          onClick={handleBack}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition duration-150 shadow-md hover:shadow-lg cursor-pointer"
        >
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    </div>
  );
}
