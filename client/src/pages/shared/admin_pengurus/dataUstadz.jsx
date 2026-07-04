import { useState, useEffect } from "react";
import api from "../../../config/api";
import { Plus, Edit2, Trash2, Loader2, Mail, Phone } from "lucide-react";
import InputUstadzModal from "../../../components/InputUstadzModal";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import AlertToast from "../../../components/AlertToast";
import { useAlert } from "../../../hooks/useAlert";
import usePagination from "../../../components/pagination/usePagination";
import Pagination from "../../../components/pagination/Pagination";
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import ProfileAvatar from "../../../components/ProfileAvatar";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";
import SortDropdown from "../../../components/SortDropdown";

export default function DataUstadzPage({ rolePrefix }) {
  const [ustadzList, setUstadzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const filteredUstadzList = ustadzList.filter(
    (item) => !selectedGender || item.jenis_kelamin === selectedGender
  );

  const { sortedData, sortKey, sortDir, handleSort, setSort } = useSort(filteredUstadzList, "nama");
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(sortedData);
  const { message, showAlert, clearAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUstadz = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${rolePrefix}/ustadz`, { params: { search } });
      setUstadzList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data ustadz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchUstadz(); jump(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { jump(1); }, [selectedGender]);

  const handleAdd = () => { setIsEditing(false); setSelectedData(null); setIsModalOpen(true); };
  const handleEdit = (data) => { setIsEditing(true); setSelectedData(data); setIsModalOpen(true); };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      if (isEditing) {
        await api.put(`/${rolePrefix}/ustadz/${selectedData.id}`, formData);
        showAlert("success", "Data ustadz diperbarui");
      } else {
        await api.post(`/${rolePrefix}/ustadz`, formData);
        showAlert("success", "Ustadz baru ditambahkan");
      }
      setIsModalOpen(false);
      fetchUstadz();
    } catch {
      showAlert("error", "Gagal menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (item) => setDeleteModal({ isOpen: true, id: item.id, name: item.nama });

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/${rolePrefix}/ustadz/${deleteModal.id}`);
      showAlert("success", "Ustadz dinonaktifkan");
      setDeleteModal({ isOpen: false, id: null, name: "" });
      fetchUstadz();
    } catch {
      showAlert("error", "Gagal menonaktifkan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-800">Data Ustadz</h1><p className="text-gray-500 text-sm">Kelola data tenaga pengajar</p></div>
        <button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center shadow-lg hover:shadow-green-500/30 transition">
          <Plus size={20} /><span className="ml-2 hidden md:inline">Tambah Ustadz</span>
        </button>
      </div>

      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari nama atau NIP..."
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
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
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
        <SortDropdown
          className="md:hidden"
          value={`${sortKey}_${sortDir}`}
          onChange={(val) => {
            const parts = val.split("_");
            const dir = parts.pop();
            const key = parts.join("_");
            setSort(key, dir);
          }}
          options={[
            { value: "nama_asc", label: "Nama (A-Z)" },
            { value: "nama_desc", label: "Nama (Z-A)" }
          ]}
        />
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <SortableHeader label="Nama & NIP" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[35%] cursor-pointer" />
                    <SortableHeader label="Email" sortKey="email" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[25%] cursor-pointer" />
                    <SortableHeader label="Jenis Kelamin" sortKey="jenis_kelamin" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[25%] cursor-pointer" />
                    <th className="p-4 text-center w-[15%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-10 h-10 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                            <p className="text-xs text-gray-500 truncate">NIP: {item.nip || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 space-y-1 min-w-0">
                          <div className="flex items-center gap-2 truncate"><Mail size={14} /> {item.email || "-"}</div>
                          <div className="flex items-center gap-2 truncate"><Phone size={14} /> {item.no_hp || "-"}</div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                        {item.jenis_kelamin ? (item.jenis_kelamin === "Laki_laki" ? "Laki-laki" : "Perempuan") : "-"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">Data ustadz tidak ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? currentData.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-12 h-12 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.nama}</h3>
                    <p className="text-sm text-gray-500 font-medium">NIP: {item.nip || "-"}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-md font-medium border border-green-100">
                        {item.jenis_kelamin ? (item.jenis_kelamin === "Laki_laki" ? "Laki-laki" : "Perempuan") : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> <span>{item.no_hp || "-"}</span></div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> <span className="truncate">{item.email || "-"}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => handleEdit(item)} className="py-2.5 bg-green-50 text-green-600 rounded-xl font-semibold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(item)} className="py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-xs flex justify-center items-center gap-1.5 active:scale-95 transition"><Trash2 size={14} /> Hapus</button>
                </div>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data ustadz tidak ditemukan.</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <InputUstadzModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditing={isEditing} editData={selectedData} onSubmit={handleSubmit} saving={isSaving} userRole={rolePrefix} />
      <ConfirmDeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, name: "" })} onConfirm={confirmDelete} loading={isDeleting} itemName={deleteModal.name} />
    </div>
  );
}
