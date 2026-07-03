import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../../config/api";
import SeleksiModal from "../../components/ppdb/SeleksiModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import { AuthContext } from "../../context/AuthContext";
import { Eye, Edit2, Award, AlertTriangle, CheckCircle, Loader2, Users, Clock, ClipboardCheck } from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import SortDropdown from "../../components/SortDropdown";
import SortableHeader from "../../components/SortableHeader";

const STATUS_SELEKSI_BADGE = {
  Belum_Diseleksi: "bg-gray-100 text-gray-600",
  Sedang_Diseleksi: "bg-yellow-100 text-yellow-700",
  Selesai: "bg-green-100 text-green-700",
};

const REKOMENDASI_BADGE = {
  Diterima: "bg-emerald-100 text-emerald-700",
  Ditolak: "bg-red-100 text-red-700",
  Pertimbangan: "bg-orange-100 text-orange-700",
};

export default function PanitiaSeleksi() {
  const { user } = useContext(AuthContext);
  const isPimpinan = user?.role?.toLowerCase() === "pimpinan";

  const [pendaftar, setPendaftar] = useState([]);
  const [tahunList, setTahunList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterSeleksi, setFilterSeleksi] = useState("");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, terlama, az, za
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedPendaftar, setSelectedPendaftar] = useState(null);

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
    if (sortKey === "sekolah") return sortDir === "desc" ? (b.asal_sekolah || "").localeCompare(a.asal_sekolah || "") : (a.asal_sekolah || "").localeCompare(b.asal_sekolah || "");
    if (sortKey === "status") return sortDir === "desc" ? (b.ppdb_seleksi?.status_seleksi || "").localeCompare(a.ppdb_seleksi?.status_seleksi || "") : (a.ppdb_seleksi?.status_seleksi || "").localeCompare(b.ppdb_seleksi?.status_seleksi || "");
    if (sortKey === "rekomendasi") return sortDir === "desc" ? (b.ppdb_seleksi?.rekomendasi || "").localeCompare(a.ppdb_seleksi?.rekomendasi || "") : (a.ppdb_seleksi?.rekomendasi || "").localeCompare(b.ppdb_seleksi?.rekomendasi || "");
    return 0;
  });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedPendaftar, 15);

  const { message, showAlert, clearAlert } = useAlert();
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterTahun) params.append("id_tahun", filterTahun);
      if (filterSeleksi) params.append("status_seleksi", filterSeleksi);
      if (search) params.append("search", search);
      const res = await api.get(`/ppdb/panitia/seleksi?${params}`);
      setPendaftar(res.data.data);
      jump(1);
    } catch (err) {
      showAlert("error", "Gagal memuat data seleksi");
    } finally {
      setLoading(false);
    }
  }, [filterTahun, filterSeleksi, search, jump]);

  useEffect(() => {
    fetchData();
  }, [filterTahun, filterSeleksi]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    const fetchTahun = async () => {
      try {
        const res = await api.get("/ppdb/public/gelombang");
        if (res.data.success) {
          setTahunList(res.data.data);
          const active = res.data.data.find((t) => t.is_active);
          if (active) setFilterTahun(active.id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTahun();
  }, []);

  const openSeleksi = (item) => setSelectedPendaftar(item);

  const executePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await api.post(`/ppdb/panitia/pengumuman/${filterTahun}`);
      if (res.data.success) {
        showAlert("success", res.data.message || "Pengumuman berhasil dipublish!");
        setConfirmPublish(false);
        fetchData();
      }
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Gagal mempublish pengumuman");
    } finally {
      setIsPublishing(false);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterTahun) count++;
    if (filterSeleksi) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterTahun("");
    setFilterSeleksi("");
  };

  return (
    <>
      <div className="">
        <AlertToast message={message} onClose={clearAlert} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
                {isPimpinan ? "Laporan Hasil Seleksi" : "Penilaian Seleksi"}
            </h1>
            <p className="text-sm text-gray-500">
                {isPimpinan ? "Rekapitulasi nilai dan hasil tes pendaftar" : "Input hasil tes dan seleksi calon santri"}
            </p>
          </div>
          {!isPimpinan && (
            <button
                onClick={() => {
                    if (!filterTahun) return showAlert("error", "Silakan filter gelombang PPDB terlebih dahulu");
                    setConfirmPublish(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition font-medium shadow-lg shadow-green-100"
            >
                <Award size={18} /> Publish Pengumuman
            </button>
          )}
        </div>

        {/* Search + Filter Dropdown */}
        <div className="flex gap-3 items-center w-full mb-5">
          <SearchBar
            placeholder="Cari nama / no. pendaftaran..."
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
                  { value: "az", label: "A-Z" },
                  { value: "za", label: "Z-A" }
                ]}
              />
            </div>
            <FilterDropdown
              activeCount={getActiveFilterCount()}
              onReset={resetFilters}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Gelombang PPDB</label>
                  <FilterSelect
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(e.target.value)}
                    placeholder="Semua Gelombang"
                    options={tahunList.map((t) => ({ value: t.id, label: t.nama_gelombang }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status Seleksi</label>
                  <FilterSelect
                    value={filterSeleksi}
                    onChange={(e) => setFilterSeleksi(e.target.value)}
                    placeholder="Semua Status"
                    options={[
                      { value: "Belum_Diseleksi", label: "Belum Diseleksi" },
                      { value: "Sedang_Diseleksi", label: "Sedang Diseleksi" },
                      { value: "Selesai", label: "Selesai" },
                    ]}
                  />
                </div>
              </div>
            </FilterDropdown>
          </div>
        </div>

        {pendaftar.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              {label: "Total Peserta", value: pendaftar.length, bgColor: "bg-blue-500", icon: <Users size={20} />},
              {label: "Belum Diseleksi", value: pendaftar.filter((p) => !p.ppdb_seleksi || p.ppdb_seleksi.status_seleksi === "Belum_Diseleksi").length, bgColor: "bg-yellow-500", icon: <Clock size={20} />},
              {label: "Penilaian Selesai", value: pendaftar.filter((p) => p.ppdb_seleksi?.status_seleksi === "Selesai").length, bgColor: "bg-green-500", icon: <ClipboardCheck size={20} />},
              {label: "Rekomendasi Terima", value: pendaftar.filter((p) => p.ppdb_seleksi?.rekomendasi === "Diterima").length, bgColor: "bg-emerald-500", icon: <Award size={20} />},
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                <div className={`w-11 h-11 ${c.bgColor} rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}>
                   {c.icon}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">{c.label}</p>
                  <p className={`text-2xl font-black text-gray-800 leading-none`}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100 bg-gray-50 uppercase tracking-wider text-[11px] font-bold">
                  <SortableHeader label="No. Pendaftaran" sortKey="no" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Nama Lengkap" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Asal Sekolah" sortKey="sekolah" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <th className="px-5 py-4">Baca Quran</th>
                  <th className="px-5 py-4 text-center">Nilai Total</th>
                  <SortableHeader label="Status Seleksi" sortKey="status" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  <SortableHeader label="Rekomendasi" sortKey="rekomendasi" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="px-5 py-4 cursor-pointer" />
                  {!isPimpinan && <th className="px-5 py-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentData.length === 0 ? (
                  <tr><td colSpan={isPimpinan ? 7 : 8} className="text-center py-10 text-gray-400">Tidak ada data peserta seleksi</td></tr>
                ) : (
                  currentData.map((p) => {
                    const seleksi = p.ppdb_seleksi;
                    const statusSeleksi = seleksi?.status_seleksi || "Belum_Diseleksi";
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-5 py-4 font-mono text-xs text-gray-500 font-bold">{p.no_pendaftaran}</td>
                        <td className="px-5 py-4 font-bold text-gray-800">{p.nama_lengkap}</td>
                        <td className="px-5 py-4 text-gray-600">{p.asal_sekolah || "-"}</td>
                        <td className="px-5 py-4 text-gray-600 text-xs font-medium">{p.kemampuan_quran?.replace(/_/g, " ") || "-"}</td>
                        <td className="px-5 py-4 text-center">
                          {seleksi?.nilai_total != null ? (
                            <span className={`font-black text-lg ${seleksi.nilai_total >= 70 ? "text-green-600" : seleksi.nilai_total >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                              {seleksi.nilai_total}
                            </span>
                          ) : <span className="text-gray-300 font-bold">-</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold ${STATUS_SELEKSI_BADGE[statusSeleksi]}`}>
                            {statusSeleksi.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {seleksi?.rekomendasi ? (
                            <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold ${REKOMENDASI_BADGE[seleksi.rekomendasi]}`}>
                              {seleksi.rekomendasi}
                            </span>
                          ) : <span className="text-gray-400 text-xs font-bold">-</span>}
                        </td>
                        {!isPimpinan && (
                          <td className="px-5 py-4">
                            <button
                              onClick={() => openSeleksi(p)}
                              className="flex items-center justify-center w-full gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition"
                            >
                              <Edit2 size={14} />
                              {seleksi?.status_seleksi === "Selesai" ? "Edit" : "Nilai"}
                            </button>
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
            <div className="text-center p-8 bg-white rounded-xl text-gray-500">Tidak ada data peserta seleksi</div>
          ) : (
            currentData.map((p) => {
              const seleksi = p.ppdb_seleksi;
              const statusSeleksi = seleksi?.status_seleksi || "Belum_Diseleksi";
              return (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-base leading-tight truncate">{p.nama_lengkap}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        No: <span className="font-mono font-semibold text-gray-500">{p.no_pendaftaran}</span>
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[9px] uppercase font-bold shrink-0 ${STATUS_SELEKSI_BADGE[statusSeleksi]}`}>
                      {statusSeleksi.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600">
                    <div>
                      <span className="block text-gray-400 font-medium">Asal Sekolah</span>
                      <span className="font-semibold text-gray-700 truncate block">{p.asal_sekolah || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Nilai Total</span>
                      {seleksi?.nilai_total != null ? (
                        <span className={`font-black text-sm ${seleksi.nilai_total >= 70 ? "text-green-600" : seleksi.nilai_total >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                          {seleksi.nilai_total}
                        </span>
                      ) : <span className="text-gray-300 font-bold">-</span>}
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Baca Quran</span>
                      <span className="font-semibold text-gray-700 block text-xs">{p.kemampuan_quran?.replace(/_/g, " ") || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Rekomendasi</span>
                      {seleksi?.rekomendasi ? (
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-[9px] uppercase font-bold ${REKOMENDASI_BADGE[seleksi.rekomendasi]}`}>
                          {seleksi.rekomendasi}
                        </span>
                      ) : <span className="text-gray-400 font-bold text-xs">-</span>}
                    </div>
                  </div>

                  {!isPimpinan && (
                    <div className="grid grid-cols-1 mt-1">
                      <button
                        onClick={() => openSeleksi(p)}
                        className="py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                      >
                        <Edit2 size={14} />
                        {seleksi?.status_seleksi === "Selesai" ? "Edit Penilaian" : "Beri Nilai"}
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

      <SeleksiModal
        isOpen={!!selectedPendaftar}
        data={selectedPendaftar}
        onClose={() => setSelectedPendaftar(null)}
        onSuccess={() => { setSelectedPendaftar(null); showAlert("success", "Penilaian disimpan"); fetchData(); }}
      />

      {confirmPublish && (
          <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><Award size={32} /></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Publish Pengumuman?</h2>
            <p className="text-gray-500 mb-6 text-sm">Semua peserta pada gelombang ini akan dapat melihat hasil seleksi dan status kelulusan mereka di portal publik.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmPublish(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm transition hover:bg-gray-200">Batal</button>
              <button onClick={executePublish} disabled={isPublishing} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition">
                {isPublishing ? <Loader2 size={16} className="animate-spin" /> : 'Ya, Publish Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}