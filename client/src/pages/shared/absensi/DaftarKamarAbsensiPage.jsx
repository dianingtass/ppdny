import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText } from "lucide-react";
import Pagination from "../../../components/pagination/Pagination";
import api from "../../../config/api";
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";
import SortDropdown from "../../../components/SortDropdown";

export default function DaftarKamarAbsensiPage({ rolePrefix }) {
  const [kamarList, setKamarList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const limit = 10;

  const fetchKamar = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/${rolePrefix}/absensi/kamar`, {
        params: {
          search: debouncedSearch,
          page,
          limit,
          gender: selectedGender
        }
      });

      setKamarList(res.data.data || []);

      const total = res.data.pagination.total || 0;
      setTotalPages(Math.ceil(total / limit));

    } catch (err) {
      console.error("Fetch kamar error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* debounce search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* fetch data */
  useEffect(() => {
    fetchKamar();
  }, [debouncedSearch, page, selectedGender]);

  /* reset page ketika search atau gender berubah */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedGender]);

  const mappedKamar = kamarList.map(item => ({
    ...item,
    tanggal_terakhir: item.heading_absensi?.[0]?.tanggal || null
  }));

  const { sortedData, sortKey, sortDir, handleSort, setSort } = useSort(mappedKamar, "kamar");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar Kamar
        </h1>
        <p className="text-gray-500 text-sm">
          Pilih kamar untuk melakukan absensi kebersihan
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 items-center w-full">
        <SearchBar
          placeholder="Cari nama kamar..."
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
            { value: "kamar_asc", label: "Nama Kamar (A-Z)" },
            { value: "kamar_desc", label: "Nama Kamar (Z-A)" },
            { value: "tanggal_terakhir_desc", label: "Absensi Terakhir (Terbaru)" },
            { value: "tanggal_terakhir_asc", label: "Absensi Terakhir (Terlama)" },
            { value: "total_absensi_bulan_ini_desc", label: "Bulan Ini (Terbanyak)" },
            { value: "total_absensi_bulan_ini_asc", label: "Bulan Ini (Tersedikit)" }
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
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left table-fixed border-collapse">

                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                        <SortableHeader label="Nama Kamar" sortKey="kamar" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                        <SortableHeader label="Absensi Terakhir" sortKey="tanggal_terakhir" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                        <SortableHeader label="Total Absensi Bulan Ini" sortKey="total_absensi_bulan_ini" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] text-center cursor-pointer" />
                        <th className="p-4 font-semibold text-center w-[15%]">Gender</th>
                        <th className="p-4 font-semibold text-center w-[20%]">Aksi</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                    {sortedData.length > 0 ? (
                        sortedData.map((item) => {

                        const latestAbsensi = item.heading_absensi?.[0];

                        return (
                            <tr key={item.id} className="hover:bg-gray-50 transition">

                            {/* NAMA KAMAR */}
                            <td className="p-4 font-semibold text-gray-800">
                                {item.kamar}
                            </td>

                            {/* RIWAYAT TERAKHIR */}
                            <td className="p-4 text-sm text-gray-600">
                                {latestAbsensi ? (
                                new Date(latestAbsensi.tanggal).toLocaleDateString("id-ID")
                                ) : (
                                "-"
                                )}
                            </td>

                            {/* TOTAL ABSENSI BULAN INI */}
                            <td className="p-4 text-center text-gray-700">
                                {item.total_absensi_bulan_ini || 0}
                            </td>

                            {/* GENDER */}
                            <td className="p-4 text-center text-gray-700">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.gender === 'Laki_laki' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>{item.gender === 'Laki_laki' ? 'Laki-laki' : 'Perempuan'}</span>
                            </td>

                            {/* AKSI */}
                            <td className="flex justify-center items-center p-4">
                                <button
                                onClick={() =>
                                    navigate(`/${rolePrefix}/daftarAbsensiKamar/${item.id}`)
                                }
                                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-green-100 transition"
                                >
                                <FileText size={16} />
                                Portal Absensi
                                </button>
                            </td>

                            </tr>
                        );

                        })
                    ) : (
                        <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                            Data tidak ditemukan
                        </td>
                        </tr>
                    )}

                    </tbody>

              </table>

            </div>

          </div>

          {/* MOBILE CARD */}
          <div className="md:hidden space-y-4">
            {sortedData.length > 0 ? (
              sortedData.map((item) => {
                const latest = item.heading_absensi?.[0];

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-2xl shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.kamar}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.gender === 'Laki_laki' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>{item.gender === 'Laki_laki' ? 'Laki-laki' : 'Perempuan'}</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
                          {item.total_absensi_bulan_ini || 0}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">riwayat bulan ini</p>
                      </div>
                    </div>

                    {latest ? (
                      <p className="text-xs text-gray-500">
                        Absensi terakhir: {new Date(latest.tanggal).toLocaleDateString("id-ID")}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Belum ada absensi
                      </p>
                    )}

                    <button
                      onClick={() =>
                        navigate(`/${rolePrefix}/daftarAbsensiKamar/${item.id}`)
                      }
                      className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition"
                    >
                      Portal Absensi
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                Data tidak ditemukan
              </div>
            )}
          </div>

          {/* PAGINATION */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={() =>
              setPage((prev) => Math.min(prev + 1, totalPages))
            }
            onPrev={() =>
              setPage((prev) => Math.max(prev - 1, 1))
            }
          />

        </>
      )}

    </div>
  );
}
