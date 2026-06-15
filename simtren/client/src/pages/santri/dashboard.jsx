import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { User, FileText, CreditCard, Calendar, AlertCircle, History, Clock, Bell, ChevronRight, CheckCircle, XCircle, AlertTriangle, Home, Settings, LogOut, Loader2, ChevronDown, Cross } from "lucide-react";
import NotificationDropdown from "../../components/NotificationDropdown";
import ProfileAvatar from '../../components/ProfileAvatar';

export default function SantriDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [activeMenu, setActiveMenu] = useState("home");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await api.get("/santri");
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || "Gagal mengambil data dashboard");
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      if (err.response) {
        setError(err.response.data?.message || `Error ${err.response.status}`);
      } else if (err.request) {
        setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        setError("Terjadi kesalahan: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu.nama);
    if (menu.isExternal) {
      const token = localStorage.getItem("token");
      const url = token ? `${menu.endpoint}login?sso_token=${token}` : menu.endpoint;
      window.open(url, "_blank");
    } else if (menu.endpoint) {
      navigate(menu.endpoint);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes("aktif") || statusLower.includes("lunas") || 
        statusLower.includes("selesai") || statusLower.includes("hadir")) {
      return "bg-green-100 text-green-800";
    } else if (statusLower.includes("belum") || statusLower.includes("diproses")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower.includes("tidak") || statusLower.includes("batal")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    if (!status) return <Clock size={16} />;
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes("aktif") || statusLower.includes("lunas") || 
        statusLower.includes("selesai") || statusLower.includes("hadir")) {
      return <CheckCircle size={16} />;
    } else if (statusLower.includes("belum") || statusLower.includes("diproses")) {
      return <AlertTriangle size={16} />;
    }
    return <Clock size={16} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // Format waktu dari "HH:MM:SS" ke "HH.MM"
    return timeString.substring(0, 5).replace(":", ".");
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={fetchDashboardData} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
              Coba Lagi
            </button>
            <button onClick={handleLogout} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition">
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Jika tidak ada data
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">Tidak ada data yang ditemukan</p>
        </div>
      </div>
    );
  }

  // Destructure data dari backend
  const { 
    santri, 
    keuangan, 
    kegiatan_hari_ini = [], 
    aktivitas_terakhir = {},
    statistik = {},
    menu_cepat = []
  } = dashboardData;

  // Format aktivitas terakhir menjadi array
  // 1. Ambil list pengaduan (Pastikan array)
  const pengaduanList = Array.isArray(aktivitas_terakhir.pengaduan) 
    ? aktivitas_terakhir.pengaduan 
    : [];
  // Default menu jika tidak ada dari backend
  const defaultMenu = [
    { id: 1, nama: "Pendataan Diri", ikon: User, warna: "bg-blue-500" },
    { id: 2, nama: "Tagihan & Keuangan", ikon: CreditCard, warna: "bg-green-500" },
    { id: 3, nama: "Kegiatan", ikon: Calendar, warna: "bg-purple-500" },
    { id: 4, nama: "Pengaduan", ikon: AlertCircle, warna: "bg-orange-500" },
    { id: 5, nama: "Riwayat Layanan", ikon: History, warna: "bg-indigo-500" }
  ];

  const iconMap = {
    "user": User,
    "credit-card": CreditCard,
    "calendar": Calendar,
    "alert-circle": AlertCircle,
    "history": History
  };

  const colorMap = {
    "user": "bg-blue-500",
    "credit-card": "bg-green-500",
    "calendar": "bg-purple-500",
    "alert-circle": "bg-orange-500",
    "history": "bg-indigo-500"
  };

  const menuToDisplayRaw = menu_cepat.length > 0 ? menu_cepat.map((menu) => ({
    ...menu,
    ikon: iconMap[menu.icon] || User,
    warna: colorMap[menu.icon] || "bg-gray-500"
  })) : defaultMenu;

  const menuToDisplay = [
    ...menuToDisplayRaw,
    {
      id: 99,
      nama: "Layanan Scabies",
      ikon: Cross,
      warna: "bg-teal-600",
      isExternal: true,
      endpoint: "https://scabismart-ppdny.vercel.app/"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-[url('/header.png')] bg-cover bg-center text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">SIM-Tren</h1>
              <p className="text-green-100">Sistem Informasi Manajemen Pesantren</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative hidden md:block">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 text-left p-2 rounded-xl hover:bg-white/10 transition focus:outline-none"
                  >
                    <ProfileAvatar fotoProfil={santri.foto_profil} nama={santri.nama} className="w-10 h-10 bg-white/20 hover:bg-white/30 border border-transparent transition" />
                    <div>
                      <p className="font-medium leading-tight">{santri.nama}</p>
                      <p className="text-sm text-white/75">NIS: {santri.nip}</p>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-green-200 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Dropdown Menu Absolute */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-md py-2 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-200 origin-top-right">

                      {/* Item 1: Edit Profil */}
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/santri/profil");
                        }}
                        className="w-full text-left px-4 py-2.5 text-md text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center transition"
                      >
                        <Settings size={16} className="mr-3" />
                        Edit Profil
                      </button>

                      {/* Item 2: Keluar */}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-md text-red-600 hover:bg-red-50 flex items-center transition"
                      >
                        <LogOut size={16} className="mr-3" />
                        Keluar
                      </button>

                    </div>
                  )}

                  {/* Backdrop transparan untuk menutup dropdown saat klik di luar */}
                  {isProfileOpen && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl">
            <div className="flex items-center mb-4">
              <div>
                <p className="text-green-100 mb-1">Selamat datang kembali</p>
                <h2 className="text-2xl font-bold">{santri.nama}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-green-100 mb-1">Kelas</p>
                <p className="text-xl font-semibold">{santri.kelas}</p>
                {santri.wali_kelas && (
                  <p className="text-xs text-green-200 mt-1">Wali: {santri.wali_kelas}</p>
                )}
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-green-100 mb-1">Kamar</p>
                <p className="text-xl font-semibold">{santri.kamar}</p>
                {santri.wali_kamar && (
                  <p className="text-xs text-green-200 mt-1">Wali: {santri.wali_kamar}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quick Access & Today Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Access Menu */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Menu Cepat</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuToDisplay.map((menu) => {
                  const Icon = menu.ikon;
                  return (
                    <button key={menu.id} onClick={() => handleMenuClick(menu)} className={`flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition ${activeMenu === menu.nama ? 'ring-2 ring-green-500' : ''}`}>
                      <div className={`${menu.warna} w-14 h-14 rounded-full flex items-center justify-center mb-3`}>
                        <Icon size={28} className="text-white" />
                      </div>
                      <span className="font-medium text-gray-800 text-center">{menu.nama}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Today's Information */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Clock className="mr-2" size={24} />
                    Kegiatan Hari Ini
                  </h3>
                  <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
                </div>
                
                {kegiatan_hari_ini.length > 0 ? (
                  <div className="space-y-4">
                    {kegiatan_hari_ini.map((kegiatan, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                        <div className="w-20 text-green-700 font-medium">
                          {formatTime(kegiatan.waktu_mulai)} - {formatTime(kegiatan.waktu_selesai)}
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="font-medium">{kegiatan.nama}</p>
                          {kegiatan.penanggung_jawab && (
                            <p className="text-sm text-gray-600">{kegiatan.penanggung_jawab}</p>
                          )}
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada kegiatan hari ini</p>
                  </div>
                )}
                
                <button onClick={() => navigate("/santri/kegiatan")} className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition flex items-center justify-center">
                  Lihat Jadwal Lengkap <ChevronRight size={20} className="ml-2" />
                </button>
              </div>

              {/* Riwayat Pengaduan */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <AlertCircle className="mr-2" size={24} />
                    Riwayat Pengaduan
                  </h3>
                  {pengaduanList.length > 0 && (
                    <span className="text-sm text-green-600 font-medium">{pengaduanList.length} total</span>
                  )}
                </div>
                
                {/* LOGIC BARU: Cek panjang array pengaduanList */}
                {pengaduanList.length > 0 ? (
                  <div className="space-y-4">
                    {pengaduanList.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.deskripsi}</h4>
                           <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                              {item.status}
                           </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-xs text-gray-500">{formatDate(item.waktu)}</span>
                           <button 
                              onClick={() => navigate("/santri/pengaduan")} 
                              className="text-xs font-semibold text-green-600 hover:underline"
                           >
                              Lihat Detail
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada pengaduan</p>
                  </div>
                )}
                
                {/* Tombol Lihat Semua hanya muncul jika ada data */}
                {pengaduanList.length > 0 && (
                    <button onClick={() => navigate("/santri/pengaduan")} className="w-full mt-4 py-2 text-green-600 text-sm font-medium hover:bg-green-50 rounded-lg transition">
                      Lihat Semua Pengaduan
                    </button>
                )}
              </div>

              
            </div>
          </div>

          {/* Right Column: Financial Status & Recent Activity */}
          <div className="space-y-6">
            {/* Financial Status */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CreditCard className="mr-2" size={24} />
                Status Tagihan
              </h3>
              
              <div className="space-y-4">                
                <div className={`p-4 rounded-xl ${keuangan.tagihan_terakhir.status === 'Lunas' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Status</p>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(keuangan.tagihan_terakhir.status)} flex items-center`}>
                          <span className="mr-2">{getStatusIcon(keuangan.tagihan_terakhir.status)}</span>
                          {keuangan.tagihan_terakhir.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(keuangan.tagihan_terakhir.jumlah)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {keuangan.tagihan_terakhir.jatuh_tempo && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-gray-600 mb-1">Jatuh Tempo</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatDate(keuangan.tagihan_terakhir.jatuh_tempo)}
                    </p>
                  </div>
                )}
              </div>
              
              <button onClick={() => navigate("/santri/keuangan")} className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition">
                Lihat Detail Keuangan
              </button>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Statistik</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Jumlah Pengaduan</p>
                      <p className="text-3xl font-bold text-blue-700">
                        {statistik.jumlah_pengaduan || 0}
                      </p>
                    </div>
                    <AlertCircle className="text-blue-600" size={32} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-gray-100 md:hidden">
              <div className="flex justify-around">
                <button onClick={() => setActiveMenu('home')} className={`flex flex-col items-center p-2 ${activeMenu === 'home' ? 'text-green-600' : 'text-gray-600'}`}>
                  <Home size={24} />
                  <span className="text-xs mt-1">Beranda</span>
                </button>
                <button onClick={() => navigate("/santri/profil")} className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600">
                  <User size={24} />
                  <span className="text-xs mt-1">Profil</span>
                </button>
                <button onClick={handleLogout} className="flex flex-col items-center p-2 text-gray-600 hover:text-red-600">
                  <LogOut size={24} />
                  <span className="text-xs mt-1">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}