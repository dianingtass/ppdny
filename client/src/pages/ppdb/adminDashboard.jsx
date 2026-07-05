import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../config/api";
import TahunModal from "../../components/ppdb/TahunModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import { AuthContext } from "../../context/AuthContext";
import {
  Users, CheckCircle, XCircle, Clock, Calendar,
  Plus, Edit2, Trash2, Award, AlertTriangle, X
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import SortDropdown from "../../components/SortDropdown";
import SortableHeader from "../../components/SortableHeader";

export default function AdminPpdbDashboard() {
  const { user } = useContext(AuthContext);
  const isPimpinan = user?.role?.toLowerCase() === "pimpinan";

  const [stats, setStats] = useState(null);
  const [tahunList, setTahunList] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, terlama, kuotaDesc, pendaftarDesc
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  const getGelombangStatus = (t) => {
    const now = new Date();
    const buka = new Date(t.tanggal_buka);
    const tutup = new Date(t.tanggal_tutup);
    if (now >= buka && now <= tutup) return "Dibuka";
    if (now > tutup) return "Ditutup";
    return "Belum Buka";
  };

  const handleSortDropdownChange = (val) => {
    setSortBy(val);
    if (val === "terbaru") { setSortKey("id"); setSortDir("desc"); }
    else if (val === "terlama") { setSortKey("id"); setSortDir("asc"); }
    else if (val === "kuotaDesc") { setSortKey("kuota"); setSortDir("desc"); }
    else if (val === "kuotaAsc") { setSortKey("kuota"); setSortDir("asc"); }
    else if (val === "pendaftarDesc") { setSortKey("pendaftar"); setSortDir("desc"); }
    else if (val === "pendaftarAsc") { setSortKey("pendaftar"); setSortDir("asc"); }
  };

  const handleSort = (key) => {
    const dir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    setSortKey(key);
    setSortDir(dir);
    if (key === "id") setSortBy(dir === "desc" ? "terbaru" : "terlama");
    if (key === "kuota") setSortBy(dir === "desc" ? "kuotaDesc" : "kuotaAsc");
    if (key === "pendaftar") setSortBy(dir === "desc" ? "pendaftarDesc" : "pendaftarAsc");
  };

  const sortedTahunList = [...tahunList]
    .filter(item => {
      const matchSearch = 
        (item.nama_gelombang?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.tahun_ajaran?.toLowerCase() || "").includes(search.toLowerCase());
        
      const status = getGelombangStatus(item);
      const matchStatus = statusFilter === "Semua" || status === statusFilter;
      
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortKey === "id") return sortDir === "desc" ? b.id - a.id : a.id - b.id;
      if (sortKey === "nama") return sortDir === "desc" ? (b.nama_gelombang || "").localeCompare(a.nama_gelombang || "") : (a.nama_gelombang || "").localeCompare(b.nama_gelombang || "");
      if (sortKey === "tahun") return sortDir === "desc" ? (b.tahun_ajaran || "").localeCompare(a.tahun_ajaran || "") : (a.tahun_ajaran || "").localeCompare(b.tahun_ajaran || "");
      if (sortKey === "buka") return sortDir === "desc" ? new Date(b.tanggal_buka) - new Date(a.tanggal_buka) : new Date(a.tanggal_buka) - new Date(b.tanggal_buka);
      if (sortKey === "tutup") return sortDir === "desc" ? new Date(b.tanggal_tutup) - new Date(a.tanggal_tutup) : new Date(a.tanggal_tutup) - new Date(b.tanggal_tutup);
      if (sortKey === "kuota") return sortDir === "desc" ? (b.kuota ?? 999999) - (a.kuota ?? 999999) : (a.kuota ?? 999999) - (b.kuota ?? 999999);
      if (sortKey === "pendaftar") return sortDir === "desc" ? (b.total_pendaftar || 0) - (a.total_pendaftar || 0) : (a.total_pendaftar || 0) - (b.total_pendaftar || 0);
      return 0;
    });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedTahunList, 10);

  const { message, showAlert, clearAlert } = useAlert();
  const [modalDelete, setModalDelete] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, tahunRes] = await Promise.all([
        api.get(`/ppdb/admin/dashboard${selectedTahun ? `?id_tahun=${selectedTahun}` : ""}`),
        api.get("/ppdb/admin/tahun"),
      ]);
      setStats(statsRes.data.data);
      setTahunList(tahunRes.data.data);
    } catch (err) {
      showAlert("error", "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, [selectedTahun]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    jump(1);
  }, [search, statusFilter, sortBy]);

  const handleFilterChange = (idTahun) => {
    setSelectedTahun(idTahun);
    jump(1);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/ppdb/admin/tahun/${modalDelete.id}`);
      showAlert("success", "Gelombang PPDB berhasil dihapus");
      setModalDelete({ isOpen: false, id: null });
      fetchData();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Gagal menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = (data) => { setEditData(data); setShowModal(true); };
  const openCreate = () => { setEditData(null); setShowModal(true); };

  const statCards = stats
    ? [
        { label: "Total Pendaftar", value: stats.total_pendaftar, icon: <Users size={20} />, color: "bg-blue-500" },
        { label: "Mendaftar", value: stats.per_status?.Mendaftar || 0, icon: <Clock size={20} />, color: "bg-yellow-500" },
        { label: "Lulus Seleksi", value: stats.per_status?.Lulus || 0, icon: <Award size={20} />, color: "bg-green-500" },
        { label: "Diterima", value: stats.per_status?.Diterima || 0, icon: <CheckCircle size={20} />, color: "bg-emerald-500" },
        { label: "Ditolak", value: stats.per_status?.Ditolak || 0, icon: <XCircle size={20} />, color: "bg-red-500" },
      ]
    : [];

  return (
    <>
      <div className="">
        <AlertToast message={message} onClose={clearAlert} />

        <div className="flex items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard PPDB</h1>
            <p className="text-sm text-gray-500">Penerimaan Peserta Didik Baru</p>
          </div>
          {!isPimpinan && (
            <button
              onClick={openCreate}
              className="flex items-center justify-center bg-green-600 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl hover:bg-green-700 transition font-medium shadow-lg shadow-green-100 shrink-0"
            >
              <Plus size={18} className="sm:mr-1" />
              <span className="hidden sm:inline">Tambah Gelombang</span>
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center w-full mb-6">
          <SearchBar 
            placeholder="Cari gelombang..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            onClear={() => setSearch("")} 
            className="flex-1" 
          />
          <div className="flex gap-2 items-center">
            <div className="block md:hidden">
              <SortDropdown
                value={sortBy}
                onChange={handleSortDropdownChange}
                options={[
                  { value: "terbaru", label: "Terbaru" },
                  { value: "terlama", label: "Terlama" },
                  { value: "kuotaDesc", label: "Kuota Terbanyak" },
                  { value: "kuotaAsc", label: "Kuota Tersedikit" },
                  { value: "pendaftarDesc", label: "Pendaftar Terbanyak" },
                  { value: "pendaftarAsc", label: "Pendaftar Tersedikit" }
                ]}
              />
            </div>
            <FilterDropdown
              activeCount={(statusFilter !== "Semua" ? 1 : 0) + (selectedTahun ? 1 : 0)}
            onReset={() => {
              setStatusFilter("Semua");
              setSelectedTahun(null);
              jump(1);
            }}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status Gelombang</label>
                <FilterSelect
                  placeholder="Semua Status"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value || "Semua"); jump(1); }}
                  options={[
                    { value: "Semua", label: "Semua Status" },
                    { value: "Dibuka", label: "Dibuka" },
                    { value: "Belum Buka", label: "Belum Buka" },
                    { value: "Ditutup", label: "Ditutup" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Gelombang Terpilih (Statistik)</label>
                <FilterSelect
                  placeholder="Semua Gelombang"
                  value={selectedTahun || ""}
                  onChange={(e) => handleFilterChange(e.target.value ? parseInt(e.target.value) : null)}
                  options={tahunList.map(t => ({
                    value: t.id.toString(),
                    label: t.nama_gelombang
                  }))}
                />
              </div>
            </div>
          </FilterDropdown>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-black text-gray-800 leading-none">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="py-4">
          <h2 className="font-bold text-gray-800">Daftar Gelombang PPDB</h2>
        </div>
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100 bg-gray-50/50 uppercase tracking-wider text-[11px] font-bold ">
                  <SortableHeader label="Nama Gelombang" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Tahun Ajaran" sortKey="tahun" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Tanggal Buka" sortKey="buka" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Tanggal Tutup" sortKey="tutup" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Kuota" sortKey="kuota" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Pendaftar" sortKey="pendaftar" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <th className="px-5 py-4">Status</th>
                  {!isPimpinan && <th className="px-5 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.length === 0 ? (
                  <tr><td colSpan={isPimpinan ? 7 : 8} className="text-center py-10 text-gray-400">Belum ada data gelombang.</td></tr>
                ) : (
                  currentData.map((t) => {
                    const now = new Date();
                    const buka = new Date(t.tanggal_buka);
                    const tutup = new Date(t.tanggal_tutup);
                    const isOpen = now >= buka && now <= tutup;
                    const isClosed = now > tutup;
                    return (
                      <tr key={t.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4 font-bold text-gray-800">{t.nama_gelombang}</td>
                        <td className="px-5 py-4 text-gray-600">{t.tahun_ajaran}</td>
                        <td className="px-5 py-4 text-gray-600">{new Date(t.tanggal_buka).toLocaleDateString("id-ID")}</td>
                        <td className="px-5 py-4 text-gray-600">{new Date(t.tanggal_tutup).toLocaleDateString("id-ID")}</td>
                        <td className="px-5 py-4 font-medium text-gray-700">{t.kuota ?? "∞"}</td>
                        <td className="px-5 py-4 font-bold text-green-600">{t.total_pendaftar}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isOpen ? "bg-green-100 text-green-700" :
                            isClosed ? "bg-gray-100 text-gray-500" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {isOpen ? "Dibuka" : isClosed ? "Ditutup" : "Belum Buka"}
                          </span>
                        </td>
                        {!isPimpinan && (
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEdit(t)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"><Edit2 size={16} /></button>
                              <button onClick={() => setModalDelete({isOpen: true, id: t.id})} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="block md:hidden space-y-4">
          {currentData.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl text-gray-500">Belum ada data gelombang.</div>
          ) : (
            currentData.map((t) => {
              const now = new Date();
              const buka = new Date(t.tanggal_buka);
              const tutup = new Date(t.tanggal_tutup);
              const isOpen = now >= buka && now <= tutup;
              const isClosed = now > tutup;
              return (
                <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-base leading-tight truncate">{t.nama_gelombang}</h3>
                      <p className="text-xs text-gray-400 mt-1">Tahun Ajaran: <span className="font-semibold text-gray-600">{t.tahun_ajaran}</span></p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                      isOpen ? "bg-green-100 text-green-700" :
                      isClosed ? "bg-gray-100 text-gray-500" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {isOpen ? "Dibuka" : isClosed ? "Ditutup" : "Belum Buka"}
                    </span>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600">
                    <div>
                      <span className="block text-gray-400 font-medium">Periode Pendaftaran</span>
                      <span className="font-semibold text-gray-700 text-xs">
                        {new Date(t.tanggal_buka).toLocaleDateString("id-ID")} - {new Date(t.tanggal_tutup).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Kuota Pendaftaran</span>
                      <span className="font-semibold text-gray-700">{t.kuota ?? "Tanpa Batas (∞)"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-gray-400 font-medium">Total Pendaftar Aktif</span>
                      <span className="font-bold text-green-600 text-sm mt-0.5 inline-block">{t.total_pendaftar} Pendaftar</span>
                    </div>
                  </div>

                  {!isPimpinan && (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => openEdit(t)}
                        className="py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setModalDelete({isOpen: true, id: t.id})}
                        className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                      >
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
      </div>

      <TahunModal 
        isOpen={showModal} 
        editData={editData} 
        onClose={() => setShowModal(false)} 
        onSuccess={(msg) => { setShowModal(false); showAlert("success", msg || "Data berhasil disimpan"); fetchData(); }} 
      />

      <ConfirmDeleteModal 
        isOpen={modalDelete.isOpen} 
        onClose={() => setModalDelete({ isOpen: false, id: null })} 
        onConfirm={confirmDelete} 
        loading={isDeleting} 
      />
    </>
  );
}