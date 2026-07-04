import { useState, useEffect, useContext } from "react";
import api from "../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Plus, ClipboardList } from "lucide-react";
import CardMateri from "../components/CardMateri";
import AjukanMateriModal from "../components/AjukanMateriModal";
import RiwayatPengajuanModal from "../components/RiwayatPengajuanModal";
import AlertToast from "../components/AlertToast";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import FilterSelect from "../components/FilterSelect";
import FilterDropdown from "../components/FilterDropdown";
import SortDropdown from "../components/SortDropdown";

const LEGACY_RECENT_STORAGE_KEY = "santri_recent_materi";

// Role yang TIDAK boleh melihat tombol ajukan/riwayat
const EXCLUDED_ROLES = ["admin", "timkesehatan", "pimpinan"];

export default function MateriView() {
  const [materi, setMateri]                         = useState([]);
  const [search, setSearch]                         = useState("");
  const [selectedSumber, setSelectedSumber]         = useState("");
  const [sortBy, setSortBy]                         = useState("terbaru"); // "terbaru" | "terlama" | "az" | "za"
  const [loading, setLoading]                       = useState(true);
  const [isAjukanOpen, setIsAjukanOpen]             = useState(false);
  const [isRiwayatOpen, setIsRiwayatOpen]           = useState(false);
  const [alert, setAlert]                           = useState({ show: false, message: "", type: "success" });

  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();
  const role = user?.role?.trim().toLowerCase();

  const isPublicMateriPage = location.pathname.startsWith("/materi");
  const defaultRootFrom = isPublicMateriPage
    ? "/"
    : role === "pimpinan"
      ? "/pimpinan"
      : "/santri";
  const rootFrom     = location.state?.rootFrom || location.state?.from || defaultRootFrom;
  const backPath     = rootFrom;
  const detailBasePath = isPublicMateriPage
    ? "/materi"
    : role === "pimpinan"
      ? "/pimpinan/scabies/materi"
      : "/santri/scabies/viewMateri";

  // Apakah user yang login termasuk role yang dikecualikan?
  const isExcludedRole    = role && EXCLUDED_ROLES.includes(role);
  // Tampilkan tombol ajukan: public user (tidak login) ATAU login tapi bukan excluded role
  const showAjukanButton  = !isExcludedRole;
  // Tampilkan tombol riwayat: hanya user yang login dan bukan excluded role
  const showRiwayatButton = !isPublicMateriPage && user && !isExcludedRole;

  const fetchMateri = async () => {
    try {
      setLoading(true);
      const endpoint = isPublicMateriPage ? "/public/materi" : "/global/viewMateri";
      const res = await api.get(endpoint);
      if (res.data.success) {
        setMateri(res.data.data.list_materi);
      } else {
        console.error(res.data.message);
        setMateri([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem(LEGACY_RECENT_STORAGE_KEY);
    fetchMateri();
  }, [isPublicMateriPage]);

  const showSuccess = (message) => {
    setAlert({ show: true, message, type: "success" });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Pisahkan materi berdasarkan sumber
  const filtered = materi.filter((item) => {
    const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
    const matchSumber = !selectedSumber ||
      (selectedSumber === "pengalaman" ? item.sumber === "pengalaman" : item.sumber !== "pengalaman");
    return matchSearch && matchSumber;
  });
  const materiTeori      = filtered.filter((item) => item.sumber !== "pengalaman");
  const materiPengalaman = filtered.filter((item) => item.sumber === "pengalaman");

  const sortMateriList = (list) => {
    return [...list].sort((a, b) => {
      const dateA = new Date(a.tanggal_dibuat || a.created_at || a.tanggal_pengajuan || 0);
      const dateB = new Date(b.tanggal_dibuat || b.created_at || b.tanggal_pengajuan || 0);
      if (sortBy === "terbaru") return dateB - dateA;
      if (sortBy === "terlama") return dateA - dateB;
      if (sortBy === "az") return (a.judul || "").localeCompare(b.judul || "");
      if (sortBy === "za") return (b.judul || "").localeCompare(a.judul || "");
      return 0;
    });
  };

  const sortedTeori      = sortMateriList(materiTeori);
  const sortedPengalaman = sortMateriList(materiPengalaman);

  const isPimpinan = role === "pimpinan";

  if (isPimpinan) {
    return (
      <div className="space-y-6 relative">
        {/* Alert Toast */}
        {alert.show && (
          <AlertToast
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ show: false, message: "", type: "success" })}
          />
        )}

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Materi Scabies</h1>
            <p className="text-gray-500 text-sm">Jendela Ilmu Pengetahuan Tentang Scabies</p>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex gap-3 items-center w-full">
          <SearchBar
            placeholder="Cari berdasarkan judul materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="flex-1"
          />
          <div className="flex gap-2 items-center">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "terbaru", label: "Terbaru" },
                { value: "terlama", label: "Terlama" },
                { value: "az", label: "A-Z" },
                { value: "za", label: "Z-A" }
              ]}
            />
            <FilterDropdown
              activeCount={selectedSumber ? 1 : 0}
              onReset={() => setSelectedSumber("")}
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Sumber Materi</label>
                <FilterSelect
                  placeholder="Semua Sumber"
                  value={selectedSumber}
                  onChange={(e) => setSelectedSumber(e.target.value)}
                  options={[
                    { value: "teori", label: "Berdasarkan Teori" },
                    { value: "pengalaman", label: "Berdasarkan Pengalaman" },
                  ]}
                />
              </div>
            </FilterDropdown>
          </div>
        </div>

        {/* DAFTAR MATERI */}
        <div className="pb-10">
          {/* MATERI BERDASARKAN TEORI */}
          {sortedTeori.length > 0 && (
            <div className="mb-10">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
                  Materi Berdasarkan Teori
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTeori.map((item) => (
                  <CardMateri
                    key={item.id}
                    materi={item}
                    detailBasePath={detailBasePath}
                    fromPath={location.pathname}
                    rootFrom={rootFrom}
                  />
                ))}
              </div>
            </div>
          )}

          {/* MATERI BERDASARKAN PENGALAMAN */}
          {sortedPengalaman.length > 0 && (
            <div className="mb-10">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full inline-block" />
                  Materi Berdasarkan Pengalaman
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPengalaman.map((item) => (
                  <CardMateri
                    key={item.id}
                    materi={item}
                    detailBasePath={detailBasePath}
                    fromPath={location.pathname}
                    rootFrom={rootFrom}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Kalau semua filter kosong */}
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              Materi tidak ditemukan.
            </p>
          )}
        </div>
      </div>
    );
  }

  // --- DEFAULT VIEW (SANTRI / PUBLIC) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Toast */}
      {alert.show && (
        <AlertToast
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "success" })}
        />
      )}

      {/* HEADER */}
      <div className="bg-[url('/header.png')] bg-cover bg-center text-white p-6 pb-24 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(backPath)}
            className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold truncate">Daftar Materi</h1>
            <p className="text-green-100 text-sm truncate">
              Jendela Ilmu Pengetahuan Tentang Scabies
            </p>
          </div>

          {/* Tombol Ajukan & Riwayat */}
          {showAjukanButton && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {showRiwayatButton && (
                <button
                  onClick={() => setIsRiwayatOpen(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl font-medium text-sm transition backdrop-blur-sm border border-white/30"
                >
                  <ClipboardList size={16} />
                  <span className="hidden sm:inline">Riwayat Pengajuan</span>
                </button>
              )}
              <button
                onClick={() => setIsAjukanOpen(true)}
                className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-3 py-2 rounded-xl font-semibold text-sm transition shadow-md"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Ajukan Materi Pengalaman</span>
                <span className="sm:hidden">Ajukan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-6xl mx-auto -mt-16 mb-8 px-4">
        <div className="flex gap-3 items-center w-full">
          <SearchBar
            placeholder="Cari berdasarkan judul materi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="flex-1"
          />
          <div className="flex gap-2 items-center">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "terbaru", label: "Terbaru" },
                { value: "terlama", label: "Terlama" },
                { value: "az", label: "A-Z" },
                { value: "za", label: "Z-A" }
              ]}
            />
            <FilterDropdown
              activeCount={selectedSumber ? 1 : 0}
              onReset={() => setSelectedSumber("")}
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Sumber Materi</label>
                <FilterSelect
                  placeholder="Semua Sumber"
                  value={selectedSumber}
                  onChange={(e) => setSelectedSumber(e.target.value)}
                  options={[
                    { value: "teori", label: "Berdasarkan Teori" },
                    { value: "pengalaman", label: "Berdasarkan Pengalaman" },
                  ]}
                />
              </div>
            </FilterDropdown>
          </div>
        </div>
      </div>

      {/* DAFTAR MATERI */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        {/* MATERI BERDASARKAN TEORI */}
        {sortedTeori.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full inline-block" />
                Materi Berdasarkan Teori
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-3">
                Materi yang diterbitkan oleh Tim Kesehatan
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sortedTeori.map((item) => (
                <CardMateri
                  key={item.id}
                  materi={item}
                  detailBasePath={detailBasePath}
                  fromPath={location.pathname}
                  rootFrom={rootFrom}
                />
              ))}
            </div>
          </div>
        )}

        {/* MATERI BERDASARKAN PENGALAMAN */}
        {sortedPengalaman.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full inline-block" />
                Materi Berdasarkan Pengalaman
              </h2>
              <p className="text-sm text-gray-500 mt-1 ml-3">
                Pengajuan materi yang telah disetujui oleh Tim Kesehatan
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sortedPengalaman.map((item) => (
                <CardMateri
                  key={item.id}
                  materi={item}
                  detailBasePath={detailBasePath}
                  fromPath={location.pathname}
                  rootFrom={rootFrom}
                />
              ))}
            </div>
          </div>
        )}

        {/* Kalau semua filter kosong */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            Materi tidak ditemukan.
          </p>
        )}
      </div>

      {/* MODAL */}
      <AjukanMateriModal
        isOpen={isAjukanOpen}
        onClose={() => setIsAjukanOpen(false)}
        onSuccess={() =>
          showSuccess("Pengajuan berhasil dikirim! Tim Kesehatan akan meninjau materi Anda.")
        }
        showRiwayatInfo={showRiwayatButton}
      />
      {showRiwayatButton && (
        <RiwayatPengajuanModal
          isOpen={isRiwayatOpen}
          onClose={() => setIsRiwayatOpen(false)}
        />
      )}
    </div>
  );
}
