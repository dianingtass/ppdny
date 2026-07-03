import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, FileText } from "lucide-react";
import Pagination from "../../../components/pagination/Pagination";
import api from "../../../config/api";
import { formatObservasiWaktu, getObservasiBadgeClass } from "../../../components/UtilsObservasi";
import ProfileAvatar from '../../../components/ProfileAvatar';
import SearchBar from "../../../components/SearchBar";
import FilterSelect from "../../../components/FilterSelect";
import FilterDropdown from "../../../components/FilterDropdown";
import useSort from "../../../hooks/useSort";
import SortableHeader from "../../../components/SortableHeader";
import SortDropdown from "../../../components/SortDropdown";


const WAKTU_OPTIONS = [
  { value: "Pagi", label: "Pagi" },
  { value: "Siang", label: "Siang" },
  { value: "Sore", label: "Sore" },
  { value: "Malam", label: "Malam" },
];

export default function DaftarSantriObservasiPage({ rolePrefix }) {
  const [santriList, setSantriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategoriSkor, setKategoriSkor] = useState("");
  const [waktu, setWaktu] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  const formatLatestObservasiDateTime = (latestObservasi) => {
    if (!latestObservasi?.tanggal) return "-";
    const tanggal = new Date(latestObservasi.tanggal).toLocaleDateString("id-ID");
    return `${tanggal} - ${formatObservasiWaktu(latestObservasi.waktu)}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Ref untuk melacak nilai filter sebelumnya
  const prevFiltersRef = useRef(null);

  useEffect(() => {
    const currentFilters = { debouncedSearch, kategoriSkor, waktu, startDate, endDate };
    const prev = prevFiltersRef.current;

    // Jika filter berubah (bukan navigasi page), reset page ke 1
    const filterChanged = prev && (
      prev.debouncedSearch !== debouncedSearch ||
      prev.kategoriSkor !== kategoriSkor ||
      prev.waktu !== waktu ||
      prev.startDate !== startDate ||
      prev.endDate !== endDate
    );

    const pageToFetch = filterChanged ? 1 : page;
    if (filterChanged) setPage(1);
    prevFiltersRef.current = currentFilters;

    const fetchSantri = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/${rolePrefix}/observasi/santri`, {
          params: { search: debouncedSearch, page: pageToFetch, limit, kategoriSkor, waktu, startDate, endDate }
        });
        setSantriList(res.data.data || []);
        setTotalPages(Math.max(1, Math.ceil((res.data.pagination?.total || 0) / limit)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSantri();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, rolePrefix, kategoriSkor, waktu, startDate, endDate]);

  const activeFilterCount = [kategoriSkor, waktu, startDate, endDate].filter(Boolean).length;

  const mappedSantri = santriList.map(item => ({
    ...item,
    tanggal_terakhir: item.latest_observasi?.tanggal || null,
    total_observasi: item._count?.observasi_observasi_id_santriTousers || 0
  }));

  const { sortedData, sortKey, sortDir, handleSort, setSort } = useSort(mappedSantri, "nama");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daftar Santri</h1>
        <p className="text-gray-500 text-sm">Pilih santri untuk melihat riwayat observasi cuci tangan</p>
      </div>

      <div className="flex gap-3 items-center justify-between w-full">
        <SearchBar placeholder="Cari nama atau NIS..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <FilterDropdown
          activeCount={activeFilterCount}
          onReset={() => {
            setKategoriSkor("");
            setWaktu("");
            setStartDate("");
            setEndDate("");
            setPage(1);
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Hasil Observasi Terakhir</label>
              <FilterSelect
                placeholder="Semua Hasil"
                value={kategoriSkor}
                onChange={(e) => setKategoriSkor(e.target.value)}
                options={[
                  { value: "Belum_Pernah_Observasi", label: "Belum Pernah Observasi" },
                  { value: "Baik", label: "Baik (Skor ≥ 6)" },
                  { value: "Cukup", label: "Cukup (Skor 4–5)" },
                  { value: "Kurang", label: "Kurang (Skor < 4)" },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Waktu Observasi</label>
              <FilterSelect
                placeholder="Semua Waktu"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                options={WAKTU_OPTIONS}
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
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none bg-white focus:ring-1 focus:ring-green-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
            { value: "tanggal_terakhir_desc", label: "Observasi Terakhir (Terbaru)" },
            { value: "tanggal_terakhir_asc", label: "Observasi Terakhir (Terlama)" },
            { value: "total_observasi_desc", label: "Total Observasi (Terbanyak)" },
            { value: "total_observasi_asc", label: "Total Observasi (Tersedikit)" }
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
              <table className="w-full text-left table-fixed border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <SortableHeader label="Nama & NIS" sortKey="nama" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[20%] cursor-pointer" />
                    <SortableHeader label="Observasi Terakhir" sortKey="tanggal_terakhir" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[15%] cursor-pointer" />
                    <SortableHeader label="Total Observasi Bulan Ini" sortKey="total_observasi" activeSortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="w-[15%] text-center cursor-pointer" />
                    <th className="p-4 font-semibold text-center w-[15%]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedData.length > 0 ? sortedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-10 h-10 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                            <p className="text-xs text-gray-500 truncate">NIS: {item.nip}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-top text-sm text-gray-600">
                        {item.latest_observasi ? (
                          <div className="space-y-1">
                            <p>{formatLatestObservasiDateTime(item.latest_observasi)}</p>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getObservasiBadgeClass(item.latest_observasi.kategori_skor)}`}>
                              {item.latest_observasi.skor_label}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-4 text-center text-gray-700">{item._count?.observasi_observasi_id_santriTousers || 0}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => navigate(`/${rolePrefix}/daftarSantriObservasi/${item.id}`)}
                          className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-green-100 transition"
                        >
                          <FileText size={16} />
                          Riwayat Observasi
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">Data santri tidak ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-4">
            {sortedData.map((item) => {
              const latest = item.latest_observasi;
              const total = item._count?.observasi_observasi_id_santriTousers || 0;

              return (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                      <p className="text-xs text-gray-500">NIS: {item.nip}</p>
                    </div>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">{total}</span>
                  </div>

                  {latest ? (
                    <div>
                      <p className="text-xs text-gray-500">{formatLatestObservasiDateTime(latest)}</p>
                      <span className={`inline-flex mt-1 rounded-full px-3 py-1 text-xs font-semibold ${getObservasiBadgeClass(latest.kategori_skor)}`}>
                        {latest.skor_label}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Belum ada observasi</p>
                  )}

                  <button
                    onClick={() => navigate(`/${rolePrefix}/daftarSantriObservasi/${item.id}`)}
                    className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition"
                  >
                    Riwayat Observasi
                  </button>
                </div>
              );
            })}
            {santriList.length === 0 && (
              <p className="text-center text-gray-500 py-8">Data santri tidak ditemukan.</p>
            )}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onNext={() => setPage(prev => Math.min(prev + 1, totalPages))}
            onPrev={() => setPage(prev => Math.max(prev - 1, 1))}
          />
        </>
      )}
    </div>
  );
}
