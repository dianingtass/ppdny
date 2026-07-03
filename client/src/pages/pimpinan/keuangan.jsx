import React, { useState, useEffect } from "react";
import api from "../../config/api";
import {
  Search,
  CreditCard,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import DaftarPembayaranModal from "../../components/DaftarPembayaranModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";


export default function Keuangan() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [selectedJenis, setSelectedJenis] = useState("");

  const jenisOptions = Array.from(
    new Set(dataList.map((item) => item.jenis_tagihan?.jenis_tagihan).filter(Boolean))
  ).map((j) => ({ value: j, label: j }));

  // Modals
  const [isListBayarOpen, setIsListBayarOpen] = useState(false);
  const [selectedTagihanId, setSelectedTagihanId] = useState(null);

  const { message, showAlert, clearAlert } = useAlert();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`pimpinan/keuangan/tagihan?search=${search}`);
      setDataList(res.data.data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat data keuangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // --- SEARCH DAN FILTER ---
  const filteredData = dataList.filter(item => {
    const matchSearch = 
      (item.nama_tagihan?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (item.users?.nama?.toLowerCase() || "").includes(search.toLowerCase());
    const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
    const matchJenis = !selectedJenis || item.jenis_tagihan?.jenis_tagihan === selectedJenis;
    return matchSearch && matchStatus && matchJenis;
  });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredData, 10); // Asumsi 10 item per halaman

  useEffect(() => {
      jump(1);
  }, [filterStatus, selectedJenis, search, dataList]);

  const handleOpenListBayar = (id) => {
    setSelectedTagihanId(id);
    setIsListBayarOpen(true);
  };

  // Helper Formatter
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
    
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Keuangan</h1>
          <p className="text-gray-500 text-sm">
            Pantau tagihan pembayaran santri
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-center w-full">
        <SearchBar placeholder="Cari nama santri atau tagihan..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="flex-1" />
        <FilterDropdown
          activeCount={(filterStatus !== "Semua" ? 1 : 0) + (selectedJenis ? 1 : 0)}
          onReset={() => {
            setFilterStatus("Semua");
            setSelectedJenis("");
            jump(1);
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status Pembayaran</label>
              <FilterSelect
                placeholder="Semua Status"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value || "Semua"); jump(1); }}
                options={[
                  { value: "Lunas", label: "Lunas" },
                  { value: "Perlu_Konfirmasi", label: "Perlu Konfirmasi" },
                  { value: "Aktif", label: "Belum Lunas (Aktif)" },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Jenis Tagihan</label>
              <FilterSelect
                placeholder="Semua Jenis"
                value={selectedJenis}
                onChange={(e) => { setSelectedJenis(e.target.value); jump(1); }}
                options={jenisOptions}
              />
            </div>
          </div>
        </FilterDropdown>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* VIEW 1: TABEL (Desktop Only) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <th className="p-4 w-[30%]">Santri</th>
                    <th className="p-4 w-[20%]">Tagihan</th>
                    <th className="p-4 w-[15%]">Nominal</th>
                    <th className="p-4 w-[15%]">Jatuh Tempo</th>
                    <th className="p-4 w-[10%]">Status</th>
                    <th className="p-4 text-center w-[10%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <p className="font-semibold text-gray-800">{item.users?.nama || "Unknown"}</p>
                          <p className="text-xs text-gray-400">NIS: {item.users?.nip || "-"}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-800 font-semibold">{item.nama_tagihan}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.jenis_tagihan?.jenis_tagihan || "-"}</p>
                        </td>
                        <td className="p-4 font-semibold text-gray-700">{formatRupiah(item.nominal)}</td>
                        <td className="p-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400"/>{formatDate(item.batas_pembayaran)}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Lunas' ? 'bg-green-100 text-green-700' : 
                            item.status === 'Perlu_Konfirmasi' || item.status === 'Perlu Konfirmasi' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.status === 'Perlu_Konfirmasi' ? 'Perlu Konfirmasi' : (item.status || "Aktif")}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleOpenListBayar(item.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Riwayat Pembayaran"><CreditCard size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        Tidak ada tagihan yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIEW 2: CARD (Mobile Only) */}
          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{item.nama_tagihan}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{item.jenis_tagihan?.jenis_tagihan || "-"}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Lunas' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Perlu_Konfirmasi' || item.status === 'Perlu Konfirmasi' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'Perlu_Konfirmasi' ? 'Perlu Konfirmasi' : (item.status || "Aktif")}
                    </span>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                    <div><span className="text-xs text-gray-400 block">Santri</span><span className="font-medium text-gray-800">{item.users?.nama || "Unknown"}</span></div>
                    <div><span className="text-xs text-gray-400 block">Nominal</span><span className="font-semibold text-gray-800">{formatRupiah(item.nominal)}</span></div>
                    <div className="col-span-2"><span className="text-xs text-gray-400 block">Jatuh Tempo</span><span className="flex items-center gap-1.5 mt-0.5"><Calendar size={14} className="text-gray-400"/>{formatDate(item.batas_pembayaran)}</span></div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-1 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenListBayar(item.id)}
                      className="py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"
                    >
                      <CreditCard size={14} /> Riwayat Pembayaran
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl text-gray-500">Tidak ada tagihan yang cocok dengan filter.</div>
            )}
          </div>

          {/* Pagination Controls */}
          {maxPage > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={maxPage}
                onNext={next}
                onPrev={prev}
            />
          )}
        </>
      )}

      {/* Modals */}
      {selectedTagihanId && (
          <DaftarPembayaranModal
            isOpen={isListBayarOpen}
            onClose={() => setIsListBayarOpen(false)}
            idTagihan={selectedTagihanId}
            userRole="pimpinan" 
          />
      )}
    </div>
  );
}