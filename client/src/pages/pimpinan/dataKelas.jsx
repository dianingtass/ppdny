import { useState, useEffect } from "react";
import api from "../../config/api";
import { Users, Loader2 } from "lucide-react";
import KelasSantriModal from "../../components/KelasSantriModal";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function DataKelasPage() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("");

  const tahunOptions = Array.from(
    new Set(dataList.map((item) => item.tahun_ajaran).filter(Boolean))
  ).map((yr) => ({ value: yr, label: yr }));

  const filteredData = dataList.filter((item) => !selectedTahun || item.tahun_ajaran === selectedTahun);
  const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(filteredData);
  const { message, showAlert, clearAlert } = useAlert();

  const [modalListSantri, setKelasSantriModal] = useState({ isOpen: false, data: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pimpinan/kelas`, { params: { search } });
      setDataList(res.data.data);
    } catch {
      showAlert("error", "Gagal memuat data kelas");
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
  }, [selectedTahun]);

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Kelas</h1>
          <p className="text-gray-500 text-sm font-medium">Laporan data kelas & tahun ajaran</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari Kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          className="flex-1"
        />
        <FilterDropdown
          activeCount={selectedTahun ? 1 : 0}
          onReset={() => setSelectedTahun("")}
        >
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Tahun Ajaran</label>
            <FilterSelect
              placeholder="Semua Tahun"
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              options={tahunOptions}
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
                    <th className="p-4 w-[30%]">Nama Kelas</th>
                    <th className="p-4 w-[25%]">Tahun Ajaran</th>
                    <th className="p-4 w-[35%]">Wali Kelas</th>
                    <th className="p-4 text-center w-[10%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-semibold text-gray-800">{item.kelas}</td>
                      <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{item.tahun_ajaran}</span></td>
                      <td className="p-4 text-gray-600">
                        {item.users ? (
                          <div className="flex flex-col"><span className="font-medium text-gray-800">{item.users.nama}</span>{item.users.nip && <span className="text-xs text-gray-400">{item.users.nip}</span>}</div>
                        ) : <span className="text-gray-400 italic text-sm">Belum ditentukan</span>}
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setKelasSantriModal({ isOpen: true, data: item })} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Lihat Santri">
                          <Users size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="p-8 text-center text-gray-500">Data kosong.</td></tr>}
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
                    <h3 className="font-bold text-gray-800 text-lg">{item.kelas}</h3>
                    <span className="inline-block mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{item.tahun_ajaran}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Wali Kelas</p>
                  {item.users ? (<div><p className="text-sm font-semibold text-gray-800">{item.users.nama}</p><p className="text-xs text-gray-400">{item.users.nip}</p></div>) : <p className="text-sm text-gray-400 italic">Belum ditentukan</p>}
                </div>
                <div className="grid grid-cols-1 gap-3 mt-1">
                  <button onClick={() => setKelasSantriModal({ isOpen: true, data: item })} className="py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs flex justify-center items-center gap-2"><Users size={16} /> Lihat Santri</button>
                </div>
              </div>
            )) : <div className="text-center p-8 bg-white rounded-xl text-gray-500">Data kosong.</div>}
          </div>

          <Pagination currentPage={currentPage} totalPages={maxPage} onNext={next} onPrev={prev} />
        </>
      )}

      <KelasSantriModal isOpen={modalListSantri.isOpen} onClose={() => setKelasSantriModal({ ...modalListSantri, isOpen: false })} kelasData={modalListSantri.data} rolePrefix="pimpinan" />
    </div>
  );
}
