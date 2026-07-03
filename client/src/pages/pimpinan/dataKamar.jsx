import { useState, useEffect } from "react";
import api from "../../config/api";
import { Users, Loader2, MapPin } from "lucide-react";
import KamarSantriModal from "../../components/KamarSantriModal";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function DataKamarPage() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const filteredData = dataList.filter(item => !selectedGender || item.gender === selectedGender);
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredData);
  const { message, showAlert, clearAlert } = useAlert();

  const [modalListSantri, setModalListSantri] = useState({ isOpen: false, data: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pimpinan/kamar`, { params: { search } });
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

  useEffect(() => {
    jump(1);
  }, [selectedGender]);

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Kamar</h1>
          <p className="text-gray-500 text-sm font-medium">Laporan kamar asrama & kapasitas</p>
        </div>
      </div>

      {/* Search + Filter */}
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
        <div className="p-12 text-center"><Loader2 className="animate-spin text-green-500 mx-auto mb-2" /><p className="text-gray-500 text-sm">Memuat data...</p></div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase">
                    <th className="p-4 w-[30%]">Nama Kamar</th>
                    <th className="p-4 w-[20%]">Terisi / Kapasitas</th>
                    <th className="p-4 w-[15%]">Gender</th>
                    <th className="p-4 w-[25%]">Lokasi</th>
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
                        <button onClick={() => setModalListSantri({ isOpen: true, data: item })} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Lihat Penghuni">
                          <Users size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="p-8 text-center text-gray-500">Data kosong.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
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
                </div>
                <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Users size={14} className="text-gray-400" /> {item._count?.kamar_santri || 0} / {item.kapasitas || 0} Santri</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> <span className="truncate">{item.lokasi || "-"}</span></div>
                </div>
                <div className="grid grid-cols-1 gap-3 mt-1">
                  <button onClick={() => setModalListSantri({ isOpen: true, data: item })} className="py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex justify-center items-center gap-2"><Users size={16} /> Lihat Penghuni</button>
                </div>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data kosong.</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <KamarSantriModal isOpen={modalListSantri.isOpen} onClose={() => setModalListSantri({ ...modalListSantri, isOpen: false })} kamarData={modalListSantri.data} rolePrefix="pimpinan" />
    </div>
  );
}
