import React, { useState, useEffect } from "react";
import api from "../../config/api";
import {
  Search, Loader2, AlertTriangle, CheckCircle, X, Star, MessageSquare
} from "lucide-react";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import DetailFeedbackModal from "../../components/DetailFeedbackModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SortDropdown from "../../components/SortDropdown";
import SortableHeader from "../../components/SortableHeader";

export default function Feedback() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, showAlert, clearAlert } = useAlert();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, terlama, ratingDesc, ratingAsc
  const [sortKey, setSortKey] = useState("tanggal"); // tanggal, rating
  const [sortDir, setSortDir] = useState("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = (currentUser.role || "pengurus").toLowerCase().replace(/\s/g, '');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${userRole}/feedback`);
      if (res.data.success) {
        setDataList(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat feedback:", err);
      showAlert("error", "Gagal memuat daftar feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSortDropdownChange = (val) => {
    setSortBy(val);
    if (val === "terbaru") { setSortKey("tanggal"); setSortDir("desc"); }
    else if (val === "terlama") { setSortKey("tanggal"); setSortDir("asc"); }
    else if (val === "ratingDesc") { setSortKey("rating"); setSortDir("desc"); }
    else if (val === "ratingAsc") { setSortKey("rating"); setSortDir("asc"); }
  };

  const handleSort = (key) => {
    const dir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    setSortKey(key);
    setSortDir(dir);
    if (key === "tanggal") setSortBy(dir === "desc" ? "terbaru" : "terlama");
    if (key === "rating") setSortBy(dir === "desc" ? "ratingDesc" : "ratingAsc");
  };

  const sortedData = [...dataList]
    .filter(item => {
      const matchSearch = (item.judul?.toLowerCase() || "").includes(search.toLowerCase());
      const matchType = filterType === "Semua" || item.tipe === filterType;
      const itemRating = Math.round(item.avg_rating || 0);
      const matchRating = !selectedRating || itemRating === parseInt(selectedRating);
      return matchSearch && matchType && matchRating;
    })
    .sort((a, b) => {
      if (sortKey === "tanggal") {
        const dateA = new Date(a.created_at || a.tanggal || 0);
        const dateB = new Date(b.created_at || b.tanggal || 0);
        return sortDir === "desc" ? dateB - dateA : dateA - dateB;
      }
      if (sortKey === "rating") {
        const valA = a.avg_rating || 0;
        const valB = b.avg_rating || 0;
        return sortDir === "desc" ? valB - valA : valA - valB;
      }
      return 0;
    });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedData, 10);

  useEffect(() => {
    jump(1);
  }, [filterType, selectedRating, search, sortBy, dataList]);

  const handleOpenDetail = (item) => {
    setSelectedItem({ id: item.id, tipe: item.tipe });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ulasan & Feedback</h1>
          <p className="text-gray-500 text-sm">Pantau tingkat kepuasan layanan dan kegiatan pesantren</p>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-between w-full">
        <SearchBar placeholder="Cari berdasarkan nama kegiatan atau layanan..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="flex-1" />
        
        <div className="flex gap-2 items-center">
          <div className="block md:hidden">
            <SortDropdown
              value={sortBy}
              onChange={handleSortDropdownChange}
              options={[
                { value: "terbaru", label: "Terbaru" },
                { value: "terlama", label: "Terlama" },
                { value: "ratingDesc", label: "Rating Tertinggi" },
                { value: "ratingAsc", label: "Rating Terendah" }
              ]}
            />
          </div>
          <FilterDropdown
            activeCount={(filterType !== "Semua" ? 1 : 0) + (selectedRating ? 1 : 0)}
            onReset={() => { setFilterType("Semua"); setSelectedRating(""); jump(1); }}
          >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Tipe Ulasan</label>
              <FilterSelect
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value || "Semua"); jump(1); }}
                options={[
                  { value: "Semua", label: "Semua Tipe" },
                  { value: "Kegiatan", label: "Kegiatan" },
                  { value: "Layanan", label: "Layanan" }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Rating Bintang</label>
              <FilterSelect
                value={selectedRating}
                onChange={(e) => { setSelectedRating(e.target.value); jump(1); }}
                options={[
                  { value: "", label: "Semua Bintang" },
                  { value: "5", label: "★★★★★ (5)" },
                  { value: "4", label: "★★★★☆ (4)" },
                  { value: "3", label: "★★★☆☆ (3)" },
                  { value: "2", label: "★★☆☆☆ (2)" },
                  { value: "1", label: "★☆☆☆☆ (1)" }
                ]}
              />
            </div>
          </div>
          </FilterDropdown>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
          <p className="text-gray-500">Memuat data ulasan...</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <th className="p-4 w-[35%] pl-6">Judul</th>
                    <th className="p-4 w-[15%]">Tipe</th>
                    <SortableHeader label="Tanggal" sortKey="tanggal" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="p-4 w-[15%] cursor-pointer" />
                    <SortableHeader label="Rating Rata-rata" sortKey="rating" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="p-4 w-[20%] cursor-pointer" />
                    <th className="p-4 text-center w-[15%] pr-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={`${item.tipe}-${item.id}`} className="hover:bg-gray-50 transition">
                        <td className="p-4 pl-6 font-bold text-gray-800">{item.judul}</td>
                        <td className="p-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.tipe === 'Kegiatan' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>{item.tipe}</span></td>
                        <td className="p-4 text-sm text-gray-600">{item.tanggal}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-700">{item.avg_rating}</span>
                            <span className="text-xs text-gray-400">({item.total_ulasan} ulasan)</span>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <button onClick={() => handleOpenDetail(item)} className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg text-sm font-medium transition">
                            <MessageSquare size={16} /> Lihat
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Tidak ada ulasan yang cocok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div key={`${item.tipe}-${item.id}`} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">{item.judul}</h3>
                    <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.tipe === 'Kegiatan' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>{item.tipe}</span>
                  </div>
                  <div className="text-xs text-gray-500">Diselenggarakan: {item.tanggal}</div>
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Star size={18} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-black text-gray-800 text-lg leading-none">{item.avg_rating}</span>
                      <span className="text-xs text-gray-400 ml-1">({item.total_ulasan} ulasan)</span>
                    </div>
                    <button onClick={() => handleOpenDetail(item)} className="p-2 bg-green-50 text-green-600 rounded-lg"><MessageSquare size={18} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-200 text-gray-500">Tidak ada ulasan yang cocok.</div>
            )}
          </div>

          {maxPage > 0 && <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />}
        </>
      )}

      <DetailFeedbackModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetItem={selectedItem}
          role="admin"
          onFeedbackHidden={fetchData}
      />
    </div>
  );
}