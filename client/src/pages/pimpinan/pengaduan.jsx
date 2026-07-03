import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { Loader2, CheckCircle } from 'lucide-react';
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import DetailPengaduanModal from '../../components/DetailPengaduanModal';
import ProfileAvatar from '../../components/ProfileAvatar';
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";
import SortDropdown from '../../components/SortDropdown';

export default function PimpinanPengaduan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, showAlert, clearAlert } = useAlert();

  const [search, setSearch] = useState("");
  const [rolePelapor, setRolePelapor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, terlama
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [rolePelapor, startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pimpinan/pengaduan", {
        params: { rolePelapor, startDate, endDate }
      });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat daftar pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const sortedData = [...data]
    .filter(item => {
      const matchSearch = (item.judul?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.santri?.nama?.toLowerCase() || "").includes(search.toLowerCase());
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.waktu_raw || 0);
      const dateB = new Date(b.waktu_raw || 0);
      if (sortBy === "terbaru") return dateB - dateA;
      if (sortBy === "terlama") return dateA - dateB;
      return 0;
    });

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pengaduan</h1>
          <p className="text-gray-500 text-sm">Laporkan pelanggaran & kedisiplinan</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-3 items-center justify-between w-full">
          <SearchBar placeholder="Cari berdasarkan judul laporan atau nama santri..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="flex-1" />
          <div className="flex gap-2 items-center">
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "terbaru", label: "Terbaru" },
                { value: "terlama", label: "Terlama" }
              ]}
            />
            <FilterDropdown
              activeCount={(rolePelapor ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0) + (filterStatus !== "Semua" ? 1 : 0)}
              onReset={() => {
                setRolePelapor("");
                setStartDate("");
                setEndDate("");
                setFilterStatus("Semua");
              }}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Status Pengaduan</label>
                  <FilterSelect
                    placeholder="Semua Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value || "Semua")}
                    options={[
                      { value: "Semua", label: "Semua Status" },
                      { value: "Aktif", label: "Aktif" },
                      { value: "Selesai", label: "Selesai" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Dibuat Oleh</label>
                  <FilterSelect
                    placeholder="Semua Pembuat"
                    value={rolePelapor}
                    onChange={(e) => setRolePelapor(e.target.value)}
                    options={[
                      { value: "ustadz", label: "Ustadz / Wali Kelas" },
                      { value: "orangtua", label: "Orang Tua" },
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
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-10">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
            <p className="text-gray-500">Memuat data...</p>
          </div>
        ) : sortedData.length > 0 ? (
          sortedData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.status === 'Selesai' ? 'bg-green-500' : 'bg-orange-500'}`}></div>

              <div className="flex gap-4 items-start pl-2">
                <div className="flex-shrink-0 pt-1">
                  <ProfileAvatar fotoProfil={item.santri.foto_profil} nama={item.santri.nama} className="w-10 h-10 border border-orange-100 flex-shrink-0" iconSize={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                        <span className="font-semibold text-gray-700">Santri: {item.santri.nama}</span>
                        <span>•</span>
                        <span>{item.waktu}</span>
                      </p>
                      <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition">
                        {item.judul}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3 mt-1">
                    {item.deskripsi}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-gray-50 mt-2">
                    <div className={`flex items-center text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${item.status === 'Selesai' ? 'text-green-700 bg-green-50 border border-green-100' : 'text-orange-700 bg-orange-50 border border-orange-100'}`}>
                      {item.status || 'Aktif'}
                    </div>
                    <div className="text-xs font-medium text-gray-500 flex items-center bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      Dilaporkan oleh: {item.pelapor}
                    </div>
                    {item.jumlah_tanggapan > 0 && (
                      <div className="text-xs font-medium text-gray-400 ml-auto flex items-center">
                        💬 {item.jumlah_tanggapan} Diskusi
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Tidak ada laporan</h3>
            <p className="text-gray-500 text-sm mt-1">Tidak ada pengaduan yang cocok dengan pencarian atau filter.</p>
          </div>
        )}
      </div>

      {selectedId && (
        <DetailPengaduanModal
          idAduan={selectedId}
          onClose={() => setSelectedId(null)}
          role="pimpinan"
        />
      )}
    </div>
  );
}