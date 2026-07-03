import { useState, useEffect } from "react";
import api from "../../../config/api";
import { Plus, Edit2, Trash2, Users, Loader2, MapPin } from "lucide-react";
import KamarModal from "../../../components/KamarModal";
import KamarSantriModal from "../../../components/KamarSantriModal";
import AssignKamarModal from "../../../components/AssignKamarModal";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AlertToast from "../../../components/AlertToast";
import { useAlert } from "../../../hooks/useAlert";
import usePagination from "../../../components/pagination/usePagination";
import Pagination from "../../../components/pagination/Pagination";
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";

export default function DataKamarPage({ rolePrefix }) {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshListKey, setRefreshListKey] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");

  const filteredData = dataList.filter(item => !selectedGender || item.gender === selectedGender);
  const { sortedData, sortKey, sortDir, handleSort } = useSort(filteredData, "kamar");
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedData);
  const { message, showAlert, clearAlert } = useAlert();

  const [modalKamar, setModalKamar] = useState({ isOpen: false, isEditing: false, data: null });
  const [modalListSantri, setModalListSantri] = useState({ isOpen: false, data: null });
  const [modalAssign, setModalAssign] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${rolePrefix}/kamar`, { params: { search } });
      setDataList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data kamar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchData(); jump(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { fetchData(); }, [refreshListKey]);
  useEffect(() => { jump(1); }, [selectedGender]);

  const handleSubmitKamar = async (formData) => {
    setIsSaving(true);
    try {
      if (modalKamar.isEditing) {
        await api.put(`/${rolePrefix}/kamar/${modalKamar.data.id}`, formData);
        showAlert("success", "Data kamar diperbarui");
      } else {
        await api.post(`/${rolePrefix}/kamar`, formData);
        showAlert("success", "Kamar ditambahkan");
      }
      setModalKamar({ ...modalKamar, isOpen: false });
      fetchData();
    } catch {
      showAlert("error", "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item) => setDeleteModal({ isOpen: true, id: item.id, name: `Kamar ${item.kamar}` });

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/${rolePrefix}/kamar/${deleteModal.id}`);
      showAlert("success", "Kamar dihapus");
      setDeleteModal({ isOpen: false, id: null, name: "" });
      fetchData();
    } catch {
      showAlert("error", "Gagal menghapus");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignSubmit = async (formData) => {
    setIsSaving(true);
    try {
      await api.post(`/${rolePrefix}/penempatan-kamar`, formData);
      showAlert("success", "Santri berhasil dimasukkan ke kamar");
      setModalAssign({ ...modalAssign, isOpen: false });
      setRefreshListKey((prev) => prev + 1);
    } catch {
      showAlert("error", "Gagal assign santri");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Data Kamar</h1><p className="text-gray-500 text-sm">Kelola data asrama & kapasitas</p></div>
        <button onClick={() => setModalKamar({ isOpen: true, isEditing: false, data: null })} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center shadow-lg transition">
          <Plus size={20} /><span className="ml-2 hidden md:inline">Tambah Kamar</span>
        </button>
      </div>

      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari Kamar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="flex-1"
        />
        <FilterDropdown
          activeCount={selectedGender ? 1 : 0}
          onReset={() => setSelectedGender("")}
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gender Kamar</label>
            <FilterSelect
              placeholder="Semua Gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              options={[
                { value: "Laki_laki", label: "Laki-laki" },
                { value: "Perempuan", label: "Perempuan" },
              ]}
            />
          </div>
        </FilterDropdown>
      </div>

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="animate-spin text-green-500 mx-auto mb-2" /><p>Loading...</p></div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <SortableHeader label="Nama Kamar" sortKey="kamar" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[30%] cursor-pointer" />
                    <SortableHeader label="Terisi / Kapasitas" sortKey="kapasitas" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                    <SortableHeader label="Gender" sortKey="gender" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[15%] cursor-pointer" />
                    <SortableHeader label="Lokasi" sortKey="lokasi" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[25%] cursor-pointer" />
                    <th className="p-4 text-center w-[10%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-semibold text-gray-800">{item.kamar}</td>
                      <td className="p-4">{item._count?.kamar_santri || 0} / {item.kapasitas || 0} Santri</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.gender === "Laki_laki" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"}`}>
                          {item.gender === "Laki_laki" ? "Laki-laki" : "Perempuan"}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{item.lokasi || "-"}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setModalKamar({ isOpen: true, isEditing: true, data: item })} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Edit2 size={18} /></button>
                          <button onClick={() => setModalListSantri({ isOpen: true, data: item })} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Users size={18} /></button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="p-8 text-center text-gray-500">Data kosong.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? currentData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.kamar}</h3>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-[10px] font-bold uppercase rounded-md tracking-wider border ${item.gender === 'Laki_laki' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                      {item.gender === 'Laki_laki' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(item)} className="text-red-500 bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                </div>
                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /> {item._count?.kamar_santri || 0} / {item.kapasitas || 0} Santri</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> <span className="truncate">{item.lokasi || "-"}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button onClick={() => setModalKamar({ isOpen: true, isEditing: true, data: item })} className="py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex justify-center items-center gap-2"><Edit2 size={16} /> Edit</button>
                  <button onClick={() => setModalListSantri({ isOpen: true, data: item })} className="py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex justify-center items-center gap-2"><Users size={16} /> Penghuni</button>
                </div>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data kosong.</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <KamarModal isOpen={modalKamar.isOpen} onClose={() => setModalKamar({ ...modalKamar, isOpen: false })} isEditing={modalKamar.isEditing} editData={modalKamar.data} onSubmit={handleSubmitKamar} saving={isSaving} rolePrefix={rolePrefix} />
      <KamarSantriModal isOpen={modalListSantri.isOpen} onClose={() => setModalListSantri({ ...modalListSantri, isOpen: false })} kamarData={modalListSantri.data} onAssignClick={(kamarData) => setModalAssign({ isOpen: true, data: { kamar: kamarData } })} refreshTrigger={refreshListKey} rolePrefix={rolePrefix} />
      <AssignKamarModal isOpen={modalAssign.isOpen} onClose={() => setModalAssign({ ...modalAssign, isOpen: false })} isEditing={false} preSelectedKamar={modalAssign.data?.kamar} onSubmit={handleAssignSubmit} saving={isSaving} rolePrefix={rolePrefix} refreshTrigger={refreshListKey} />
      <ConfirmDeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })} onConfirm={confirmDelete} loading={isDeleting} itemName={deleteModal.name} />
    </div>
  );
}
