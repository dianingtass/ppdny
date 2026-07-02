import React, { useState, useEffect } from "react";
import api from "../../config/api";
import {
  Eye,
  Loader2,
  Star
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import DetailFeedbackModal from "../../components/DetailFeedbackModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function FeedbackView() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, showAlert, clearAlert } = useAlert();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const [selectedRating, setSelectedRating] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pimpinan/feedback");
      if (res.data.success) {
          setDataList(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat daftar feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // LOGIKA FILTER GABUNGAN (SEARCH + TYPE + RATING)
  const filteredData = dataList.filter(item => {
    const matchSearch = (item.judul?.toLowerCase() || "").includes(search.toLowerCase());
    const matchType = filterType === "Semua" || item.tipe === filterType;
    const itemRating = Math.round(item.rating_rata_rata || 0);
    const matchRating = !selectedRating || itemRating === parseInt(selectedRating);
    return matchSearch && matchType && matchRating;
  });

  // Custom Hook Pagination 
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredData, 10);

  // Reset pagination ke halaman 1 setiap kali filter atau search berubah
  useEffect(() => {
      jump(1);
  }, [filterType, selectedRating, search, dataList]);

  const handleOpenDetail = (item) => {
      setSelectedItem({ id: item.id, tipe: item.tipe });
      setIsModalOpen(true);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterType !== "Semua") count++;
    if (selectedRating) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterType("Semua");
    setSelectedRating("");
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ulasan & Feedback</h1>
          <p className="text-gray-500 text-sm">
            Pantau tingkat kepuasan layanan dan kegiatan pesantren
          </p>
        </div>
      </div>

      {/* Kontainer Search & Filter Dropdown */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <SearchBar
          placeholder="Cari berdasarkan nama kegiatan atau layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="flex-1"
        />
        <FilterDropdown
          activeCount={getActiveFilterCount()}
          onReset={resetFilters}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tipe Feedback</label>
              <FilterSelect
                placeholder="Semua Tipe"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: "Semua", label: "Semua Tipe" },
                  { value: "Kegiatan", label: "Kegiatan" },
                  { value: "Layanan", label: "Layanan" },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Rating Minimum</label>
              <FilterSelect
                placeholder="Semua Rating"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                options={[
                  { value: "", label: "Semua Bintang" },
                  { value: "5", label: "★★★★★ (5)" },
                  { value: "4", label: "★★★★☆ (4)" },
                  { value: "3", label: "★★★☆☆ (3)" },
                  { value: "2", label: "★★☆☆☆ (2)" },
                  { value: "1", label: "★☆☆☆☆ (1)" },
                ]}
              />
            </div>
          </div>
        </FilterDropdown>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
          <p className="text-gray-500">Memuat data ulasan...</p>
        </div>
      ) : (
        <>
          {/* VIEW 1: TABEL (Desktop Only) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <th className="p-4 w-[35%] pl-6">Judul</th>
                    <th className="p-4 w-[15%]">Tipe</th>
                    <th className="p-4 w-[15%]">Tanggal</th>
                    <th className="p-4 w-[20%]">Rating Rata-rata</th>
                    <th className="p-4 text-center w-[15%] pr-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={`${item.tipe}-${item.id}`} className="hover:bg-gray-50 transition">
                        <td className="p-4 pl-6 font-bold text-gray-800">
                           {item.judul}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.tipe === 'Kegiatan' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                            {item.tipe}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(item.tanggal_terakhir || item.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-xl border border-yellow-100 w-fit">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-black text-yellow-700">{(item.rating_rata_rata || 0).toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center pr-6">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition border border-green-100 hover:border-green-300"
                            title="Detail Ulasan"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        Tidak ada ulasan feedback ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIEW 2: CARDS (Mobile Only) */}
          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div
                  key={`${item.tipe}-${item.id}`}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {item.judul}
                      </h3>
                      <span className={`inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.tipe === 'Kegiatan' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                        {item.tipe}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-100">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700">
                        {(item.rating_rata_rata || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Terakhir update: {new Date(item.tanggal_terakhir || item.created_at).toLocaleDateString("id-ID")}</span>
                  </div>

                  <button
                    onClick={() => handleOpenDetail(item)}
                    className="w-full py-2.5 bg-green-50 text-green-600 rounded-xl font-bold text-sm flex justify-center items-center gap-2 active:scale-95 transition"
                  >
                    <Eye size={16} /> Lihat Detail Ulasan
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl text-gray-500">
                Ulasan kosong.
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={maxPage}
            onNext={next}
            onPrev={prev}
          />
        </>
      )}

      {/* DETAIL MODAL */}
      <DetailFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemData={selectedItem}
      />
    </div>
  );
}