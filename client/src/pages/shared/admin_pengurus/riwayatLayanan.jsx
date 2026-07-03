import { useState, useEffect } from "react";
import api from "../../../config/api";
import { Eye, Loader2, Calendar, Star, Plus } from "lucide-react";
import DetailRiwayatModal from "../../../components/DetailRiwayatLayananPengurusModal";
import ProsesLayananModal from "../../../components/ProsesLayananModal";
import InputRiwayatLayananModal from "../../../components/InputRiwayatLayananModal";
import AlertToast from "../../../components/AlertToast";
import { useAlert } from "../../../hooks/useAlert";
import usePagination from "../../../components/pagination/usePagination";
import Pagination from "../../../components/pagination/Pagination";
import ProfileAvatar from '../../../components/ProfileAvatar';
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const STATUS_STYLES = {
  Menunggu:  "bg-yellow-100 text-yellow-700",
  Proses:    "bg-blue-100 text-blue-700",
  Selesai:   "bg-green-100 text-green-700",
  Batal:     "bg-red-100 text-red-700",
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export default function RiwayatLayananPage({ rolePrefix }) {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLayanan, setSelectedLayanan] = useState("");

  const layananOptions = Array.from(
    new Set(dataList.map((item) => item.jenis_layanan?.nama_layanan).filter(Boolean))
  ).map((lay) => ({ value: lay, label: lay }));

  const filteredData = dataList.filter((item) => {
    const matchStatus = !selectedStatus || item.status_sesudah === selectedStatus;
    const matchLayanan = !selectedLayanan || item.jenis_layanan?.nama_layanan === selectedLayanan;
    return matchStatus && matchLayanan;
  });

  const { sortedData, sortKey, sortDir, handleSort } = useSort(filteredData, "waktu");
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedData);
  const { message, showAlert, clearAlert } = useAlert();

  const [detailData, setDetailData] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [processData, setProcessData] = useState(null);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${rolePrefix}/riwayat-layanan`, { params: { search } });
      setDataList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data riwayat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchData(); jump(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { jump(1); }, [selectedStatus, selectedLayanan]);

  const handleOpenDetail = (item) => { setDetailData(item); setIsDetailOpen(true); };
  const handleOpenProcess = (item) => { setProcessData(item); setIsProcessOpen(true); };

  const handleSubmitProcess = async (id, formData) => {
    setIsSaving(true);
    try {
      await api.put(`/${rolePrefix}/riwayat-layanan/${id}/status`, formData);
      showAlert("success", "Status layanan berhasil diperbarui");
      setIsProcessOpen(false);
      fetchData();
    } catch {
      showAlert("error", "Gagal memperbarui status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRiwayat = async (formData) => {
    setIsSaving(true);
    try {
      const res = await api.post(`/${rolePrefix}/riwayat-layanan`, formData);
      if (res.data.success) {
        showAlert("success", "Pengajuan layanan manual berhasil disimpan");
        setIsInputOpen(false);
        fetchData();
      }
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Gagal membuat pengajuan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Layanan</h1>
          <p className="text-gray-500 text-sm">Monitoring pengajuan layanan santri</p>
        </div>
        <button
          onClick={() => setIsInputOpen(true)}
          className="flex bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium items-center shadow-lg transition-all"
        >
          <Plus size={20} className="mr-2" /> Tambah Riwayat Layanan
        </button>
      </div>

      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari riwayat layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="flex-1"
        />
        <FilterDropdown
          activeCount={(selectedStatus ? 1 : 0) + (selectedLayanan ? 1 : 0)}
          onReset={() => { setSelectedStatus(""); setSelectedLayanan(""); }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status Layanan</label>
              <FilterSelect
                placeholder="Semua Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: "Menunggu", label: "Menunggu" },
                  { value: "Proses", label: "Proses" },
                  { value: "Selesai", label: "Selesai" },
                  { value: "Batal", label: "Batal" },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Jenis Layanan</label>
              <FilterSelect
                placeholder="Semua Layanan"
                value={selectedLayanan}
                onChange={(e) => setSelectedLayanan(e.target.value)}
                options={layananOptions}
              />
            </div>
          </div>
        </FilterDropdown>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="animate-spin text-green-500 mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <SortableHeader label="Waktu & Layanan" sortKey="waktu" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                    <SortableHeader label="Santri" sortKey="users.nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[40%] cursor-pointer" />
                    <SortableHeader label="Status" sortKey="status_sesudah" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[10%] cursor-pointer" />
                    <th className="p-4 text-center w-[20%]">Rating</th>
                    <th className="p-4 text-center w-[10%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-4 pl-4">
                        <p className="font-bold text-gray-800">{item.jenis_layanan?.nama_layanan}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar size={12} className="mr-1" /> {formatDate(item.waktu)}
                        </div>
                      </td>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-2">
                          <ProfileAvatar fotoProfil={item.users?.foto_profil} nama={item.users?.nama} className="w-10 h-10 border border-gray-100 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">{item.users?.nama}</p>
                            <p className="text-xs text-gray-500">{item.users?.nip}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><StatusBadge status={item.status_sesudah} /></td>
                      <td className="p-4 text-center">
                        {item.feedback && item.feedback.length > 0 ? (
                          <div className="flex items-center justify-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 w-fit mx-auto">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-yellow-700">{item.feedback[0].rating}</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">-</span>}
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleOpenDetail(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition border border-green-100 hover:border-green-300">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="p-8 text-center text-gray-500">Data tidak ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? currentData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar fotoProfil={item.users?.foto_profil} nama={item.users?.nama} className="w-10 h-10 border border-gray-100 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.jenis_layanan?.nama_layanan}</h3>
                      <p className="text-xs text-gray-500">{item.users?.nama}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status_sesudah} />
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-600 gap-1"><Calendar size={14} /> {formatDate(item.waktu)}</div>
                  {item.feedback && item.feedback.length > 0 && (
                    <div className="flex items-center gap-1 text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-full">
                      <Star size={12} fill="currentColor" /> {item.feedback[0].rating}
                    </div>
                  )}
                </div>
                <button onClick={() => handleOpenDetail(item)} className="w-full py-2.5 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition">
                  <Eye size={16} /> Lihat Detail
                </button>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data tidak ditemukan</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <DetailRiwayatModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} data={detailData} onProcess={handleOpenProcess} />
      <ProsesLayananModal isOpen={isProcessOpen} onClose={() => setIsProcessOpen(false)} data={processData} onSubmit={handleSubmitProcess} saving={isSaving} />
      <InputRiwayatLayananModal isOpen={isInputOpen} onClose={() => setIsInputOpen(false)} onSubmit={handleCreateRiwayat} isSaving={isSaving} rolePrefix={rolePrefix} />
    </div>
  );
}
