import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/api";
import {
  ArrowLeft,
  Loader2,
  Plus,
  History,
  ClipboardList,
  Trash2,
  FileText
} from "lucide-react";
import Pagination from "../../../components/pagination/Pagination";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";
import SortDropdown from "../../../components/SortDropdown";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";

export default function PortalAbsensiPage({ rolePrefix }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [kamar, setKamar] = useState(null);
  const [absensi, setAbsensi] = useState([]);
  const [latest, setLatest] = useState(null);

  const [loading, setLoading] = useState(true);
  const [totalAbsensi, setTotalAbsensi] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPemeriksa, setSelectedPemeriksa] = useState("");

  const limit = 10;

  const pemeriksaList = useMemo(() => {
    const names = new Set();
    absensi.forEach(item => {
      const name = item.users?.nama;
      if (name) names.add(name);
    });
    return Array.from(names);
  }, [absensi]);

  const filteredRiwayat = useMemo(() => {
    let data = absensi.filter(item => item.id_heading !== latest?.id_heading);
    if (selectedPemeriksa) {
      data = data.filter(item => item.users?.nama === selectedPemeriksa);
    }
    return data;
  }, [absensi, latest, selectedPemeriksa]);

  const { sortedData: sortedRiwayat, sortKey, sortDir, handleSort, setSort } = useSort(filteredRiwayat, "tanggal", "desc");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/absensi/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: null });
      fetchDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchDetail = async () => {
    try {

      const [kamarRes, absensiRes, latestRes] = await Promise.all([
        api.get(`/${rolePrefix}/absensi/kamar/${id}/detail`),
        api.get(`/${rolePrefix}/absensi/kamar/${id}/absensi`, {
          params: { page, limit }
        }),
        api.get(`/${rolePrefix}/absensi/kamar/${id}/latest`)
      ]);

      setKamar(kamarRes.data?.data || null);
      setAbsensi(absensiRes.data?.data || []);
      setLatest(latestRes.data?.data || null);

      const total = absensiRes.data?.pagination?.total || 0;

      setTotalAbsensi(total);
      setTotalPages(Math.ceil(total / limit));

    } catch (err) {

      console.error("PortalAbsensi error:", err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDetail();
  }, [page, id]);

  useEffect(() => {
    if (!loading && topRef.current) {
      topRef.current.scrollIntoView({
        block: "start"
      });
    }
  }, [loading, page]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );

  if (!kamar) return null;

  const formatGender = (gender) => {
    if (!gender) return "-";
    if (gender === "Laki_laki") return "Laki-laki";
    if (gender === "Perempuan") return "Perempuan";
    return gender;
  };

  const isTodayAbsensi = latest
    ? new Date(latest.tanggal).toDateString() === new Date().toDateString()
    : false;
  
  const renderAbsensiCards = (items, emptyText) => {
    const displayEmptyText = emptyText === "Belum ada absensi." || emptyText === "Belum ada riwayat absensi." ? "Data tidak ditemukan" : emptyText;
    if (!items.length) {
      return (
        <div className="p-6 text-center text-gray-400 text-sm">
          {displayEmptyText}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 p-3">
        {items.map((item) => (
          <div key={item.id_heading} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-medium text-gray-800 text-right">
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Pemeriksa</span>
                <span className="font-medium text-gray-800 text-right">
                  {item.users?.nama || "-"}
                </span>
              </div>
            </div>

            {rolePrefix !== "pimpinan" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/${rolePrefix}/daftarAbsensiKamar/${id}/edit/${item.id_heading}`)
                  }
                  className="flex-1 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                {rolePrefix === "admin" && (
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: item.id_heading })}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={topRef} className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/${rolePrefix}/daftarAbsensiKamar`)}
          className="flex-shrink-0 hover:bg-white/20 rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 ml-4">
          Portal Absensi
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">

        {/* DATA KAMAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Data Kamar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            <div>
              <label className="block text-sm font-medium text-green-600/80 mb-1">
                Nama Kamar
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {kamar.kamar}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-600/80 mb-1">
                Gender
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {formatGender(kamar.gender)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-600/80 mb-1">
                Lokasi
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                {kamar.lokasi || "-"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-600/80 mb-1">
                Total Absensi
              </label>
              <p className="text-green-600 font-bold text-lg">
                {totalAbsensi}
              </p>
            </div>
          </div>
        </div>

        {/* ABSENSI TERAKHIR */}
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-3 w-full">
            <h2 className="text-xl font-bold text-gray-800 flex items-center min-w-0">
              <ClipboardList className="mr-2 text-green-600 flex-shrink-0" size={24}/>
              <span className="truncate">Absensi Terakhir</span>
            </h2>
 
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  navigate(`/${rolePrefix}/daftarAbsensiKamar/${id}/laporan`)
                }
                className="p-2.5 sm:px-4 sm:py-2.5 border border-green-200 text-green-600 rounded-xl font-medium flex items-center justify-center hover:bg-green-50 transition text-sm sm:text-base shrink-0"
              >
                <FileText size={20} className="sm:mr-2"/>
                <span className="hidden sm:inline">Lihat Laporan</span>
              </button>
 
              {rolePrefix !== "pimpinan" && (
                <button
                  disabled={isTodayAbsensi}
                  onClick={() =>
                    navigate(`/${rolePrefix}/daftarAbsensiKamar/${id}/create`)
                  }
                  className={`p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-medium flex items-center justify-center shadow-lg transition shrink-0 text-sm sm:text-base
                  ${
                    isTodayAbsensi
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <Plus size={20} className="sm:mr-2"/>
                  <span className="hidden sm:inline">Tambah Absensi</span>
                </button>
              )}
            </div>
          </div>

          {isTodayAbsensi && (
            <p className="text-sm text-gray-500">
              Absensi hari ini sudah dilakukan.
            </p>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="hidden lg:block overflow-x-auto"> 
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 pl-6 w-1/3">Tanggal</th>
                    <th className="p-4 w-1/3">Pemeriksa</th>
                    {rolePrefix !== "pimpinan" && <th className="p-4 pr-6 w-1/3 text-center">Aksi</th>}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">

                  {latest ? (
                    <tr className="hover:bg-green-50/50 transition">
                      <td className="p-4 pl-6">
                        {new Date(latest.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">
                        {latest.users?.nama || "-"}
                      </td>
                      {rolePrefix !== "pimpinan" && (
                        <td className="text-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/${rolePrefix}/daftarAbsensiKamar/${id}/edit/${latest.id_heading}`)
                            }
                            className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition inline-block"
                          >
                            Edit
                          </button>
                          {rolePrefix === "admin" && (
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, id: latest.id_heading })}
                              className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition inline-flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Hapus
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden">
              {renderAbsensiCards(latest ? [latest] : [], "Data tidak ditemukan")}
            </div>
          </div>
        </div>

        {/* RIWAYAT ABSENSI */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <History className="mr-2 text-green-600" size={24}/>
            Riwayat Absensi
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <SortableHeader label="Tanggal" sortKey="tanggal" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-1/3 cursor-pointer text-left" />
                    <SortableHeader label="Pemeriksa" sortKey="users.nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-1/3 cursor-pointer text-left" />
                    {rolePrefix !== "pimpinan" && <th className="p-4 pr-6 w-1/3 text-center">Aksi</th>}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">

                  {sortedRiwayat.length > 0 ? (
                    sortedRiwayat.map((item) => (
                      <tr
                        key={item.id_heading}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-4 pl-6">
                          {new Date(item.tanggal).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-4">
                          {item.users?.nama || "-"}
                        </td>
                        {rolePrefix !== "pimpinan" && (
                          <td className="text-center space-x-2">
                            <button
                              onClick={() =>
                                navigate(`/${rolePrefix}/daftarAbsensiKamar/${id}/edit/${item.id_heading}`)
                              }
                              className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition inline-block"
                            >
                              Edit
                            </button>
                            {rolePrefix === "admin" && (
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, id: item.id_heading })}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition inline-flex items-center gap-1"
                              >
                                <Trash2 size={16} />
                                Hapus
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-400">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="lg:hidden">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center gap-3">
                <select
                  value={selectedPemeriksa}
                  onChange={(e) => setSelectedPemeriksa(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 flex-1 max-w-[200px]"
                >
                  <option value="">Semua Pemeriksa</option>
                  {pemeriksaList.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <SortDropdown
                  value={`${sortKey}_${sortDir}`}
                  onChange={(val) => {
                    const parts = val.split("_");
                    const dir = parts.pop();
                    const key = parts.join("_");
                    setSort(key, dir);
                  }}
                  options={[
                    { value: "tanggal_desc", label: "Terbaru" },
                    { value: "tanggal_asc", label: "Terlama" }
                  ]}
                />
              </div>
              {renderAbsensiCards(sortedRiwayat, "Data tidak ditemukan")}
            </div>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={() => setPage(prev => Math.min(prev + 1, totalPages))}
            onPrev={() => setPage(prev => Math.max(prev - 1, 1))}
          />
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </div>
  );
}
