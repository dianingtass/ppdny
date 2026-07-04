import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../config/api";
import PendaftarDetailModal from "../../components/ppdb/PendaftarDetailModal";
import PendaftarManualModal from "../../components/ppdb/PendaftarManualModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import { AuthContext } from "../../context/AuthContext";
import {
  Filter, Plus, Eye, UserCheck,
  Edit2, AlertTriangle, CheckCircle, X, Loader2
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import SortDropdown from "../../components/SortDropdown";
import SortableHeader from "../../components/SortableHeader";


const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "Mendaftar", label: "Mendaftar" },
  { value: "Verifikasi", label: "Verifikasi" },
  { value: "Seleksi", label: "Seleksi" },
  { value: "Lulus", label: "Lulus Seleksi" },
  { value: "Diterima", label: "Diterima" },
  { value: "Ditolak", label: "Ditolak" },
  { value: "Mengundurkan_Diri", label: "Mengundurkan Diri" },
];

const STATUS_BADGE = {
  Mendaftar: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  Verifikasi: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  Seleksi: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  Lulus: "bg-green-100 text-green-700 hover:bg-green-200",
  Diterima: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  Ditolak: "bg-red-100 text-red-700 hover:bg-red-200",
  Mengundurkan_Diri: "bg-gray-100 text-gray-500 hover:bg-gray-200",
};

export default function AdminPendaftar() {
  const { user } = useContext(AuthContext);
  const isPimpinan = user?.role?.toLowerCase() === "pimpinan";

  const [pendaftar, setPendaftar] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, terlama, az, za
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [detailData, setDetailData] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [statusModal, setStatusModal] = useState({ isOpen: false, id: null, currentStatus: "", nama: "" });

  const handleSortDropdownChange = (val) => {
    setSortBy(val);
    if (val === "terbaru") { setSortKey("id"); setSortDir("desc"); }
    else if (val === "terlama") { setSortKey("id"); setSortDir("asc"); }
    else if (val === "az") { setSortKey("nama"); setSortDir("asc"); }
    else if (val === "za") { setSortKey("nama"); setSortDir("desc"); }
  };

  const handleSort = (key) => {
    const dir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    setSortKey(key);
    setSortDir(dir);
    if (key === "id") setSortBy(dir === "desc" ? "terbaru" : "terlama");
    if (key === "nama") setSortBy(dir === "desc" ? "za" : "az");
  };

  const sortedPendaftar = [...pendaftar].sort((a, b) => {
    if (sortKey === "id") {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    }
    if (sortKey === "no") return sortDir === "desc" ? (b.no_pendaftaran || "").localeCompare(a.no_pendaftaran || "") : (a.no_pendaftaran || "").localeCompare(b.no_pendaftaran || "");
    if (sortKey === "nama") return sortDir === "desc" ? (b.nama_lengkap || "").localeCompare(a.nama_lengkap || "") : (a.nama_lengkap || "").localeCompare(b.nama_lengkap || "");
    if (sortKey === "gender") return sortDir === "desc" ? (b.jenis_kelamin || "").localeCompare(a.jenis_kelamin || "") : (a.jenis_kelamin || "").localeCompare(b.jenis_kelamin || "");
    if (sortKey === "sekolah") return sortDir === "desc" ? (b.asal_sekolah || "").localeCompare(a.asal_sekolah || "") : (a.asal_sekolah || "").localeCompare(b.asal_sekolah || "");
    if (sortKey === "gelombang") return sortDir === "desc" ? (b.ppdb_tahun?.nama_gelombang || "").localeCompare(a.ppdb_tahun?.nama_gelombang || "") : (a.ppdb_tahun?.nama_gelombang || "").localeCompare(b.ppdb_tahun?.nama_gelombang || "");
    if (sortKey === "status") return sortDir === "desc" ? (b.status || "").localeCompare(a.status || "") : (a.status || "").localeCompare(b.status || "");
    return 0;
  });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedPendaftar, 15);
  const { message, showAlert, clearAlert } = useAlert();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null, nama: "", type: "" }); 
  const [catatan, setCatatan] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPendaftar = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterTahun) params.append("id_tahun", filterTahun);
      if (filterStatus) params.append("status", filterStatus);
      if (search) params.append("search", search);

      const res = await api.get(`/ppdb/admin/pendaftar?${params}`);
      setPendaftar(res.data.data);
    } catch (err) {
      showAlert("error", "Gagal memuat data pendaftar");
    } finally {
      setLoading(false);
    }
  }, [filterTahun, filterStatus, search]);

  useEffect(() => {
    api.get("/ppdb/admin/tahun").then((r) => setTahunList(r.data.data));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchPendaftar();
    }, 500);
    return () => clearTimeout(delay);
  }, [fetchPendaftar]);

  useEffect(() => {
    jump(1);
  }, [search, filterStatus, filterTahun, sortBy]);

  const handleUpdateStatus = async (id, status) => {
    if (status === "Ditolak") {
        setConfirmModal({ isOpen: true, id, type: "tolak", nama: "" });
        setCatatan("");
        return;
    }
    try {
      await api.patch(`/ppdb/admin/pendaftar/${id}/status`, { status });
      showAlert("success", "Status diperbarui");
      fetchPendaftar();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Gagal update status");
    }
  };

  const executeAction = async () => {
      setIsProcessing(true);
      try {
          if (confirmModal.type === 'tolak') {
             await api.patch(`/ppdb/admin/pendaftar/${confirmModal.id}/status`, { status: "Ditolak", catatan_panitia: catatan });
             showAlert("success", "Pendaftar ditolak");
          } else if (confirmModal.type === 'aktivasi') {
             const res = await api.post(`/ppdb/admin/pendaftar/${confirmModal.id}/aktivasi`);
             showAlert("success", res.data.message);
          }
          setConfirmModal({ isOpen: false, id: null, nama: "", type: "" });
          fetchPendaftar();
      } catch (err) {
          showAlert("error", err.response?.data?.message || "Aksi gagal");
      } finally {
          setIsProcessing(false);
      }
  }

  return (
    <>
      <div className="">
        <AlertToast message={message} onClose={clearAlert} />

        <div className="flex items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Pendaftar</h1>
            <p className="text-sm text-gray-500">Kelola semua calon santri yang mendaftar</p>
          </div>
          {!isPimpinan && (
            <button
              onClick={() => setShowManual(true)}
              className="flex items-center bg-green-600 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl hover:bg-green-700 transition font-medium shadow-lg shadow-green-100 shrink-0"
            >
              <Plus size={18} className="sm:mr-1" />
              <span className="hidden sm:inline">Input Manual</span>
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center w-full mb-6">
          <SearchBar placeholder="Cari nama / no. pendaftaran..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
          <div className="flex gap-2 items-center">
            <div className="block md:hidden">
              <SortDropdown
                value={sortBy}
                onChange={handleSortDropdownChange}
                options={[
                  { value: "terbaru", label: "Terbaru" },
                  { value: "terlama", label: "Terlama" },
                  { value: "az", label: "A-Z" },
                  { value: "za", label: "Z-A" }
                ]}
              />
            </div>
            <FilterDropdown
              activeCount={(filterStatus && filterStatus !== "Semua" ? 1 : 0) + (filterTahun ? 1 : 0)}
              onReset={() => {
                setFilterStatus("Semua");
                setFilterTahun("");
              }}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status Pendaftaran</label>
                  <FilterSelect
                    placeholder="Semua Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value || "Semua")}
                    options={[
                      { value: "Mendaftar", label: "Mendaftar" },
                      { value: "Verifikasi", label: "Verifikasi" },
                      { value: "Seleksi", label: "Seleksi" },
                      { value: "Lulus", label: "Lulus" },
                      { value: "Diterima", label: "Diterima" },
                      { value: "Ditolak", label: "Ditolak" },
                      { value: "Mengundurkan Diri", label: "Mengundurkan Diri" },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Gelombang PPDB</label>
                  <FilterSelect
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(e.target.value)}
                    placeholder="Semua Gelombang"
                    options={tahunList.map((t) => ({ value: t.id, label: t.nama_gelombang }))}
                  />
                </div>
              </div>
            </FilterDropdown>
          </div>
        </div>

        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto [scrollbar-width:none]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100 bg-gray-50 uppercase tracking-wider text-[11px] font-bold">
                  <SortableHeader label="No. Pendaftaran" sortKey="no" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Nama Lengkap" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="L/P" sortKey="gender" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Asal Sekolah" sortKey="sekolah" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Gelombang" sortKey="gelombang" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <th className="px-5 py-4">Dokumen</th>
                  <SortableHeader label="Status" sortKey="status" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-400">Tidak ada data pendaftar</td></tr>
                ) : (
                  currentData.map((p) => {
                    const docsOk = p.ppdb_dokumen?.filter((d) => d.status_verif === "Terverifikasi").length || 0;
                    const docsTotal = p.ppdb_dokumen?.length || 0;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4 font-mono text-xs text-gray-500 font-bold">{p.no_pendaftaran}</td>
                        <td className="px-5 py-4 font-bold text-gray-800">{p.nama_lengkap}</td>
                        <td className="px-5 py-4 text-gray-600 font-medium">{p.jenis_kelamin.charAt(0)}</td>
                        <td className="px-5 py-4 text-gray-600">{p.asal_sekolah || "-"}</td>
                        <td className="px-5 py-4 text-gray-600 text-xs font-medium">{p.ppdb_tahun?.nama_gelombang}</td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-md ${docsOk === docsTotal && docsTotal > 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {docsOk}/{docsTotal} valid
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {isPimpinan ? (
                             <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider ${STATUS_BADGE[p.status]?.replace('hover:bg-blue-200', '')?.replace('hover:bg-yellow-200', '')?.replace('hover:bg-purple-200', '')?.replace('hover:bg-green-200', '')?.replace('hover:bg-emerald-200', '')?.replace('hover:bg-red-200', '')?.replace('hover:bg-gray-200', '') || "bg-gray-100 text-gray-600"}`}>
                                {p.status?.replace(/_/g, " ")}
                             </span>
                          ) : (
                            <button 
                              onClick={() => setStatusModal({ isOpen: true, id: p.id, currentStatus: p.status, nama: p.nama_lengkap })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider transition w-fit ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-600"}`}
                              title="Klik untuk ubah status"
                            >
                              {p.status?.replace(/_/g, " ")}
                              <Edit2 size={12} className="opacity-70" />
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setDetailData(p)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            {!isPimpinan && p.status === "Diterima" && !p.id_user_aktif && (
                              <button
                                onClick={() => setConfirmModal({isOpen: true, id: p.id, nama: p.nama_lengkap, type: "aktivasi"})}
                                className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                                title="Aktivasi sebagai Santri"
                              >
                                <UserCheck size={16} />
                              </button>
                            )}
                          </div>
                        </td>
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
            <div className="text-center p-8 bg-white rounded-xl text-gray-500">Tidak ada data pendaftar</div>
          ) : (
            currentData.map((p) => {
              const docsOk = p.ppdb_dokumen?.filter((d) => d.status_verif === "Terverifikasi").length || 0;
              const docsTotal = p.ppdb_dokumen?.length || 0;
              return (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-base leading-tight truncate">{p.nama_lengkap}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        No: <span className="font-mono font-semibold text-gray-500">{p.no_pendaftaran}</span> | {p.jenis_kelamin === "Laki_laki" ? "L" : "P"}
                      </p>
                    </div>
                    {isPimpinan ? (
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider ${STATUS_BADGE[p.status]?.replace('hover:bg-blue-200', '')?.replace('hover:bg-yellow-200', '')?.replace('hover:bg-purple-200', '')?.replace('hover:bg-green-200', '')?.replace('hover:bg-emerald-200', '')?.replace('hover:bg-red-200', '')?.replace('hover:bg-gray-200', '') || "bg-gray-100 text-gray-600"}`}>
                        {p.status?.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <button 
                        onClick={() => setStatusModal({ isOpen: true, id: p.id, currentStatus: p.status, nama: p.nama_lengkap })}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] uppercase font-bold tracking-wider transition shrink-0 ${STATUS_BADGE[p.status] || "bg-gray-100 text-gray-600"}`}
                        title="Klik untuk ubah status"
                      >
                        {p.status?.replace(/_/g, " ")}
                        <Edit2 size={10} />
                      </button>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-100"></div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600">
                    <div>
                      <span className="block text-gray-400 font-medium">Asal Sekolah</span>
                      <span className="font-semibold text-gray-700 truncate block">{p.asal_sekolah || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Gelombang</span>
                      <span className="font-semibold text-gray-700 block">{p.ppdb_tahun?.nama_gelombang || "-"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-gray-400 font-medium mb-0.5">Verifikasi Dokumen</span>
                      <span className={`inline-block text-[9px] uppercase font-bold px-2 py-0.5 rounded ${docsOk === docsTotal && docsTotal > 0 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {docsOk}/{docsTotal} valid
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button 
                      onClick={() => setDetailData(p)}
                      className="py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                    >
                      <Eye size={14} /> Detail
                    </button>
                    {!isPimpinan && p.status === "Diterima" && !p.id_user_aktif ? (
                      <button
                        onClick={() => setConfirmModal({isOpen: true, id: p.id, nama: p.nama_lengkap, type: "aktivasi"})}
                        className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                      >
                        <UserCheck size={14} /> Aktivasi
                      </button>
                    ) : (
                      <div className="py-2.5 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 cursor-default">
                        Selesai
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
      </div>

      <PendaftarDetailModal
        isOpen={!!detailData}
        data={detailData}
        onClose={() => setDetailData(null)}
        onRefresh={fetchPendaftar}
      />
      <PendaftarManualModal
        isOpen={showManual}
        tahunList={tahunList}
        onClose={() => setShowManual(false)}
        onSuccess={(msg) => { setShowManual(false); showAlert("success", msg); fetchPendaftar(); }}
      />

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                  {confirmModal.type === 'aktivasi' ? 'Aktivasi Santri' : 'Tolak Pendaftar'}
              </h2>
              <button onClick={() => setConfirmModal({isOpen: false})} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            {confirmModal.type === 'aktivasi' ? (
                <p className="text-gray-600 mb-6 text-sm">Aktivasi <span className="font-bold text-gray-800">{confirmModal.nama}</span> sebagai santri aktif? Aksi ini akan membuatkan akun sistem otomatis.</p>
            ) : (
                <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">Masukkan alasan penolakan (opsional):</p>
                    <textarea 
                        value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmModal({isOpen: false})} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm transition hover:bg-gray-200">Batal</button>
              <button 
                onClick={executeAction} disabled={isProcessing} 
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition text-white ${confirmModal.type === 'aktivasi' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : confirmModal.type === 'aktivasi' ? 'Aktivasi' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModal.isOpen && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Ubah Status</h2>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{statusModal.nama}</p>
              </div>
              <button onClick={() => setStatusModal({isOpen: false})} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={18} /></button>
            </div>
            
            <div className="space-y-2 mb-6">
              {STATUS_OPTIONS.filter(s => s.value).map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    handleUpdateStatus(statusModal.id, s.value);
                    setStatusModal({ isOpen: false });
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold border-2 transition ${
                    statusModal.currentStatus === s.value 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : "border-gray-100 bg-white text-gray-600 hover:border-green-200 hover:bg-gray-50"
                  }`}
                >
                  {s.label}
                  {statusModal.currentStatus === s.value && <span className="float-right"><CheckCircle size={16}/></span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}