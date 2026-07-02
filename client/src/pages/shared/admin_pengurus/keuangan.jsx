import { useState, useEffect } from "react";
import api from "../../../config/api";
import { Plus, Edit2, Trash2, CreditCard, Loader2, Calendar } from "lucide-react";
import InputTagihanModal from "../../../components/InputTagihanModal";
import DaftarPembayaranModal from "../../../components/DaftarPembayaranModal";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AlertToast from "../../../components/AlertToast";
import { useAlert } from "../../../hooks/useAlert";
import usePagination from "../../../components/pagination/usePagination";
import Pagination from "../../../components/pagination/Pagination";
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

export default function KeuanganPage({ rolePrefix }) {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");

  const jenisOptions = Array.from(
    new Set(dataList.map((item) => item.jenis_tagihan?.jenis_tagihan).filter(Boolean))
  ).map((j) => ({ value: j, label: j }));

  const filteredData = dataList.filter((item) => {
    const matchStatus = !selectedStatus || item.status === selectedStatus;
    const matchJenis = !selectedJenis || item.jenis_tagihan?.jenis_tagihan === selectedJenis;
    return matchStatus && matchJenis;
  });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredData);
  const { message, showAlert, clearAlert } = useAlert();

  const [isTagihanOpen, setIsTagihanOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState(null);
  const [isListBayarOpen, setIsListBayarOpen] = useState(false);
  const [selectedTagihanId, setSelectedTagihanId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${rolePrefix}/keuangan/tagihan`, { params: { search } });
      setDataList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data keuangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchData(); jump(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const handleCreate = () => { setIsEditing(false); setSelectedTagihan(null); setIsTagihanOpen(true); };
  const handleEdit = (item) => { setIsEditing(true); setSelectedTagihan(item); setIsTagihanOpen(true); };
  const handleDelete = (item) => setDeleteModal({ isOpen: true, id: item.id, name: `Tagihan "${item.nama_tagihan}"` });

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/${rolePrefix}/keuangan/${deleteModal.id}`);
      showAlert("success", "Tagihan dihapus");
      setDeleteModal({ isOpen: false, id: null, name: "" });
      fetchData();
    } catch {
      showAlert("error", "Gagal menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitTagihan = async (formData) => {
    try {
      if (isEditing) {
        await api.put(`/${rolePrefix}/keuangan/${selectedTagihan.id}`, formData);
        showAlert("success", "Tagihan diperbarui");
      } else {
        await api.post(`/${rolePrefix}/keuangan`, formData);
        showAlert("success", "Tagihan berhasil dibuat");
      }
      setIsTagihanOpen(false);
      fetchData();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Keuangan</h1><p className="text-gray-500 text-sm">Kelola tagihan santri dan monitoring pembayaran</p></div>
        <button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center shadow-lg transition">
          <Plus size={20} /><span className="ml-2 hidden md:inline">Buat Tagihan</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
        <SearchBar placeholder="Cari tagihan..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <FilterDropdown
          activeCount={(selectedStatus ? 1 : 0) + (selectedJenis ? 1 : 0)}
          onReset={() => {
            setSelectedStatus("");
            setSelectedJenis("");
            jump(1);
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status Pembayaran</label>
              <FilterSelect
                placeholder="Semua Status"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); jump(1); }}
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
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} /><p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <th className="p-4 w-[25%] font-semibold">Nama & Jenis Tagihan</th>
                    <th className="p-4 w-[25%] font-semibold">Santri</th>
                    <th className="p-4 w-[20%] font-semibold">Nominal</th>
                    <th className="p-4 w-[20%] font-semibold">Jatuh Tempo</th>
                    <th className="p-4 w-[15%] font-semibold text-center">Status</th>
                    <th className="p-4 w-[15%] font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{item.nama_tagihan}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.jenis_tagihan?.jenis_tagihan || "-"}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{item.users?.nama}</p>
                        <p className="text-xs text-gray-400">NIS: {item.users?.nip || "-"}</p>
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
                          {item.status === 'Perlu_Konfirmasi' ? 'Perlu Konfirmasi' : item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setSelectedTagihanId(item.id); setIsListBayarOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Riwayat Pembayaran"><CreditCard size={18} /></button>
                          <button onClick={() => handleEdit(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Edit Tagihan"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus Tagihan"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6" className="p-8 text-center text-gray-500">Data keuangan tidak ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? currentData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{item.nama_tagihan}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{item.jenis_tagihan?.jenis_tagihan || "-"}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Lunas' ? 'bg-green-100 text-green-700' : 
                    item.status === 'Perlu_Konfirmasi' || item.status === 'Perlu Konfirmasi' ? 'bg-amber-100 text-amber-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'Perlu_Konfirmasi' ? 'Perlu Konfirmasi' : item.status}
                  </span>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                  <div><span className="text-xs text-gray-400 block">Santri</span><span className="font-medium text-gray-850">{item.users?.nama}</span></div>
                  <div><span className="text-xs text-gray-400 block">Nominal</span><span className="font-semibold text-gray-800">{formatRupiah(item.nominal)}</span></div>
                  <div className="col-span-2"><span className="text-xs text-gray-400 block">Jatuh Tempo</span><span className="flex items-center gap-1.5 mt-0.5"><Calendar size={14} className="text-gray-400"/>{formatDate(item.batas_pembayaran)}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-gray-100">
                  <button onClick={() => { setSelectedTagihanId(item.id); setIsListBayarOpen(true); }} className="py-2 bg-blue-50 text-blue-600 rounded-lg flex justify-center items-center"><CreditCard size={16} /></button>
                  <button onClick={() => handleEdit(item)} className="py-2 bg-green-50 text-green-600 rounded-lg flex justify-center items-center"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item)} className="py-2 bg-red-50 text-red-600 rounded-lg flex justify-center items-center"><Trash2 size={16} /></button>
                </div>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data tidak ditemukan</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <InputTagihanModal isOpen={isTagihanOpen} onClose={() => setIsTagihanOpen(false)} isEditing={isEditing} editData={selectedTagihan} onSubmit={handleSubmitTagihan} rolePrefix={rolePrefix} />
      <DaftarPembayaranModal isOpen={isListBayarOpen} onClose={() => setIsListBayarOpen(false)} idTagihan={selectedTagihanId} userRole={rolePrefix} />
      <ConfirmDeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })} onConfirm={confirmDelete} loading={isDeleting} itemName={deleteModal.name} />
    </div>
  );
}
