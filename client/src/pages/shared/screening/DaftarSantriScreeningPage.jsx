import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText, Calendar } from "lucide-react";
import Pagination from "../../../components/pagination/Pagination";
import api from "../../../config/api";
import ProfileAvatar from '../../../components/ProfileAvatar';
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";
import SortDropdown from "../../../components/SortDropdown";


export default function DaftarSantriScreeningPage({ rolePrefix }) {
  const [santriList, setSantriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRisiko, setSelectedRisiko] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const mappedSantri = santriList.map(item => ({
    ...item,
    tanggal_terakhir: item.screening_screening_id_santriTousers?.[0]?.tanggal || null,
    total_screening: item._count?.screening_screening_id_santriTousers || 0
  }));

  const { sortedData, sortKey, sortDir, handleSort, setSort } = useSort(mappedSantri, "nama");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const navigate = useNavigate();
  const limit = 10;

  const fetchSantri = async (pageToFetch = page) => {
    setLoading(true);
    try {
      const res = await api.get(`/${rolePrefix}/screening/santri`, {
        params: {
          search: debouncedSearch,
          diagnosa: selectedRisiko,
          startDate,
          endDate,
          page: pageToFetch,
          limit,
          sortBy: sortKey,
          sortDir: sortDir
        }
      });

      setSantriList(res.data.data);

      const total = res.data.pagination.total;
      setTotalPages(Math.ceil(total / limit));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ref untuk melacak nilai filter sebelumnya
  const prevFiltersRef = useRef(null);

  useEffect(() => {
    const currentFilters = { debouncedSearch, selectedRisiko, startDate, endDate, sortKey, sortDir };
    const prev = prevFiltersRef.current;

    // Jika filter atau sort berubah (bukan navigasi page), paksa fetch dari page 1
    const filterChanged = prev && (
      prev.debouncedSearch !== debouncedSearch ||
      prev.selectedRisiko !== selectedRisiko ||
      prev.startDate !== startDate ||
      prev.endDate !== endDate ||
      prev.sortKey !== sortKey ||
      prev.sortDir !== sortDir
    );

    const pageToFetch = filterChanged ? 1 : page;
    if (filterChanged) setPage(1);
    prevFiltersRef.current = currentFilters;

    fetchSantri(pageToFetch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, selectedRisiko, startDate, endDate, sortKey, sortDir]);



  const getDiagnosaStyle = (diagnosa) => {
    if (!diagnosa) return "text-gray-500";

    if (diagnosa === "Scabies")
      return "text-red-600 font-semibold";

    if (diagnosa === "Bukan_Scabies")
      return "text-green-600 font-semibold";

    if (
      diagnosa === "Kemungkinan_Scabies" ||
      diagnosa === "Perlu_Evaluasi_Lebih_Lanjut"
    )
      return "text-yellow-600 font-semibold";

    return "text-gray-600";
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar Santri
        </h1>
        <p className="text-gray-500 text-sm">
          Pilih santri untuk melihat riwayat screening
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3 items-center justify-between w-full">
        <SearchBar placeholder="Cari nama atau NIS..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <FilterDropdown
          activeCount={(selectedRisiko ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0)}
          onReset={() => {
            setSelectedRisiko("");
            setStartDate("");
            setEndDate("");
            setPage(1);
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Hasil Diagnosa Terakhir</label>
              <FilterSelect
                placeholder="Semua Hasil"
                value={selectedRisiko}
                onChange={(e) => { setSelectedRisiko(e.target.value); setPage(1); }}
                options={[
                  { value: "Belum_Pernah_Screening", label: "Belum Pernah Screening" },
                  { value: "Bukan_Scabies", label: "Bukan Scabies" },
                  { value: "Kemungkinan_Scabies", label: "Kemungkinan Scabies" },
                  { value: "Scabies", label: "Scabies" },
                  { value: "Perlu_Evaluasi_Lebih_Lanjut", label: "Perlu Evaluasi" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500">Rentang Tanggal</label>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Dari Tanggal</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white focus:ring-1 focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white focus:ring-1 focus:ring-green-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
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
            { value: "nama_desc", label: "Nama (Z-A)" },
            { value: "tanggal_terakhir_desc", label: "Screening Terakhir (Terbaru)" },
            { value: "tanggal_terakhir_asc", label: "Screening Terakhir (Terlama)" },
            { value: "total_screening_desc", label: "Total Screening (Terbanyak)" },
            { value: "total_screening_asc", label: "Total Screening (Tersedikit)" }
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
                    <SortableHeader label="Nama & NIS" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                    <SortableHeader label="Screening Terakhir" sortKey="tanggal_terakhir" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[15%] cursor-pointer" />
                    <SortableHeader label="Total Screening" sortKey="total_screening" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[15%] text-center cursor-pointer" />
                    <th className="p-4 font-semibold text-center w-[15%]">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {mappedSantri.length > 0 ? (
                    mappedSantri.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        
                        {/* NAMA */}
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-10 h-10 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {item.nama}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                NIS: {item.nip}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* RIWAYAT TERAKHIR */}
                        <td className="p-4 align-top text-sm text-gray-600">
                          {item.screening_screening_id_santriTousers?.length > 0 ? (
                            <>
                              <p className="truncate">
                                {new Date(
                                  item.screening_screening_id_santriTousers[0].tanggal
                                ).toLocaleDateString("id-ID")}
                              </p>
                              <p className={getDiagnosaStyle(
                                item.screening_screening_id_santriTousers[0].diagnosa, "truncate"
                              )}>
                                {item.screening_screening_id_santriTousers[0].diagnosa.replaceAll("_", " ")}
                              </p>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* TOTAL SCREENING */}
                        <td className="p-4 text-center text-gray-700">
                          {item._count?.screening_screening_id_santriTousers || 0}
                        </td>

                        {/* AKSI */}
                        <td className="flex justify-center items-center p-4 align-top">
                          <button
                            onClick={() =>
                              navigate(`/${rolePrefix}/daftarSantriScreening/${item.id}`)
                            }
                            className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition truncate"
                          >
                            <FileText size={16} />
                            Riwayat Screening
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        Data santri tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* MOBILE CARD */}
          <div className="md:hidden space-y-4">
            {mappedSantri.map((item) => {
              const total = item._count?.screening_screening_id_santriTousers || 0;
              const hasScreening = item.screening_screening_id_santriTousers?.[0];
 
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">
                        {item.nama}
                        </p>
                      <p className="text-xs text-gray-500 truncate">
                        NIS: {item.nip}
                      </p>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm font-semibold flex-shrink-0">
                      {total}
                    </span>
                  </div>
 
                  {hasScreening ? (
                    <div>
                      <p className="text-xs text-gray-500">
                        {new Date(hasScreening.tanggal).toLocaleDateString("id-ID")}
                      </p>
                      <span className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
                          hasScreening?.diagnosa === "Scabies"
                            ? "bg-red-100 text-red-700"
                            : hasScreening?.diagnosa === "Bukan_Scabies"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {hasScreening.diagnosa.replaceAll("_", " ")}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Belum ada screening
                    </p>
                  )}

                  <button
                    onClick={() =>
                      navigate(`/${rolePrefix}/daftarSantriScreening/${item.id}`)
                    }
                    className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition"
                  >
                    Riwayat Screening
                  </button>
                </div>
              );
            })}
          </div>

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
