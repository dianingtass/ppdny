import { useState, useEffect } from "react";
import api from "../../config/api";
import { Eye, Loader2, Phone, ExternalLink, Mail } from "lucide-react";
import InputOrtuModal from "../../components/InputOrtuModal";
import ListAnakModal from "../../components/ListAnakModal";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import ProfileAvatar from "../../components/ProfileAvatar";

export default function DataOrangtuaPage() {
  const [ortuList, setOrtuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHubungan, setSelectedHubungan] = useState("");

  const filteredOrtuList = ortuList.filter((item) => {
    if (!selectedHubungan) return true;
    if (selectedHubungan === "Lainnya") return item.hubungan && item.hubungan !== "Ayah" && item.hubungan !== "Ibu";
    return item.hubungan === selectedHubungan;
  });

  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredOrtuList);
  const { message, showAlert, clearAlert } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [listAnakModal, setListAnakModal] = useState({ isOpen: false, data: null });

  const fetchOrtu = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pimpinan/orangtua`, { params: { search } });
      setOrtuList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data orang tua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { fetchOrtu(); jump(1); }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    jump(1);
  }, [selectedHubungan]);

  const handleView = (item) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Wali Santri</h1>
          <p className="text-gray-500 text-sm font-medium">Laporan akun dan relasi keluarga</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari nama atau No HP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="flex-1"
        />
        <FilterDropdown
          activeCount={selectedHubungan ? 1 : 0}
          onReset={() => { setSelectedHubungan(""); jump(1); }}
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Status Wali</label>
            <FilterSelect
              placeholder="Semua Status"
              value={selectedHubungan}
              onChange={(e) => { setSelectedHubungan(e.target.value); jump(1); }}
              options={[
                { value: "Ayah", label: "Ayah" },
                { value: "Ibu", label: "Ibu" },
                { value: "Lainnya", label: "Lainnya" },
              ]}
            />
          </div>
        </FilterDropdown>
      </div>

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="animate-spin text-green-500 mx-auto mb-2" size={32} /></div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 w-[35%]">Nama Wali</th>
                    <th className="p-4 w-[25%]">Kontak</th>
                    <th className="p-4 w-[25%] text-center">Tanggungan</th>
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
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded flex-shrink-0">
                              {item.hubungan || "Wali"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 space-y-1 min-w-0">
                          <div className="flex items-center gap-2 truncate"><Mail size={14} /> {item.email || "-"}</div>
                          <div className="flex items-center gap-2 truncate"><Phone size={14} /> {item.no_hp || "-"}</div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setListAnakModal({ isOpen: true, data: item })} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition">
                          {item.jumlah_anak} Anak <ExternalLink size={14} />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleView(item)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Lihat Profil">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">Data orang tua tidak ditemukan.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-12 h-12 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.nama}</h3>
                      <p className="text-sm text-gray-500 font-medium">Status: {item.hubungan || "Wali"}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Phone size={14} className="text-gray-400" /> <span>{item.no_hp || "-"}</span></div>
                    <div className="flex items-center gap-2"><Mail size={14} className="text-gray-400" /> <span className="truncate">{item.email || "-"}</span></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button onClick={() => setListAnakModal({ isOpen: true, data: item })} className="py-2.5 bg-green-50 text-green-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition">Anak: {item.jumlah_anak}</button>
                    <button onClick={() => handleView(item)} className="py-2.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"><Eye size={14} /> Profil</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data orang tua tidak ditemukan.</div>
            )}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <InputOrtuModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isEditing={false} editData={selectedData} onSubmit={() => {}} saving={false} viewOnly={true} />
      <ListAnakModal isOpen={listAnakModal.isOpen} onClose={() => setListAnakModal({ isOpen: false, data: null })} ortuData={listAnakModal.data} />
    </div>
  );
}
