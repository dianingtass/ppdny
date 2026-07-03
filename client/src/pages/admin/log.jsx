import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { Loader2, Activity, Clock } from "lucide-react";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";


const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', { 
        day: 'numeric', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).format(date);
};

const formatEntitas = (string) => {
    if (!string) return "";
    return string.replace(/-/g, ' ');
};

export default function Log() {
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ totalPages: 0, currentPage: 1 });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); 
    const [filterAksi, setFilterAksi] = useState("Semua");
    const [filterRole, setFilterRole] = useState("Semua");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [availableRoles, setAvailableRoles] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await api.get("/admin/log/roles");
                if (res.data.success) setAvailableRoles(res.data.data);
            } catch (err) { 
                console.error("Gagal mengambil daftar role:", err.response?.data?.message || err.message); 
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, filterAksi, filterRole, startDate, endDate]);

    useEffect(() => {
        fetchLogs();
    }, [debouncedSearch, filterAksi, filterRole, startDate, endDate, currentPage]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/log", {
                params: {
                    page: currentPage,
                    limit: 15,
                    search: debouncedSearch,
                    aksi: filterAksi,
                    role: filterRole,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined
                }
            });
            
            if (res.data.success) {
                setDataList(res.data.data);
                setMeta(res.data.meta);
            }
        } catch (err) {
            console.error("Gagal memuat log:", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
                        <p className="text-gray-500 text-sm">Pantau seluruh rekam jejak aktivitas manipulasi data di dalam sistem</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 items-center justify-between w-full">
                <SearchBar placeholder="Cari (Nama, aksi, role, dll)..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="flex-1" />
                <FilterDropdown
                  activeCount={(filterAksi !== "Semua" ? 1 : 0) + (filterRole !== "Semua" ? 1 : 0) + (startDate ? 1 : 0) + (endDate ? 1 : 0)}
                  onReset={() => {
                    setFilterAksi("Semua");
                    setFilterRole("Semua");
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Aksi</label>
                      <FilterSelect
                        value={filterAksi}
                        onChange={(e) => setFilterAksi(e.target.value)}
                        options={[
                          { value: "Semua", label: "Semua Aksi" },
                          { value: "CREATE", label: "CREATE (Tambah)" },
                          { value: "UPDATE", label: "UPDATE (Ubah)" },
                          { value: "DELETE", label: "DELETE (Hapus)" },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Role Pengguna</label>
                      <FilterSelect
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        options={[
                          { value: "Semua", label: "Semua Role" },
                          ...availableRoles.map(role => ({ value: role, label: role.toUpperCase() }))
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                        <p className="text-gray-500">Memuat data log...</p>
                    </div>
                ) : dataList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        Tidak ada log aktivitas yang tercatat
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-100 bg-gray-50 uppercase tracking-wider text-[11px] font-bold">
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Aksi</th>
                                    <th className="px-6 py-4">Entitas</th>
                                    <th className="px-6 py-4">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dataList.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                {formatDateTime(log.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{log.nama_user}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {log.role_user}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                                log.aksi === 'CREATE' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                log.aksi === 'UPDATE' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                                {log.aksi}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Activity size={14} className="text-gray-400" />
                                                <span className="font-semibold text-gray-700 uppercase text-[10px]">
                                                    {formatEntitas(log.entitas)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium max-w-xs truncate" title={log.keterangan}>
                                            {log.keterangan}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {meta.totalPages > 1 && (
                <div className="flex justify-between items-center py-4 bg-white px-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500">
                        Halaman <span className="font-bold text-gray-700">{meta.currentPage}</span> dari <span className="font-bold text-gray-700">{meta.totalPages}</span>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}