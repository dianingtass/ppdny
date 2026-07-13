import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { Loader2, Activity, Clock } from "lucide-react";
import usePagination from "../../components/pagination/usePagination";
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

const formatRoleName = (role) => {
    if (!role) return "-";
    const mapping = {
        admin: "Admin",
        pimpinan: "Pimpinan",
        ustadz: "Ustadz",
        timkesehatan: "Tim Kesehatan",
        pengurus: "Pengurus",
        orangtua: "Wali / Orang Tua",
        santri: "Santri",
    };
    return mapping[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

export default function Log() {
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(""); 
    const [filterAksi, setFilterAksi] = useState("Semua");
    const [filterRole, setFilterRole] = useState("Semua");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [availableRoles, setAvailableRoles] = useState([]);

    const { currentData, currentPage, maxPage, next, prev, jump } = usePagination(dataList);

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

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/log", {
                params: {
                    search: debouncedSearch,
                    aksi: filterAksi,
                    role: filterRole,
                    startDate: startDate || undefined,
                    endDate: endDate || undefined
                }
            });
            
            if (res.data.success) {
                setDataList(res.data.data);
            }
        } catch (err) {
            console.error("Gagal memuat log:", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchLogs();
            jump(1);
        };
        load();
    }, [debouncedSearch, filterAksi, filterRole, startDate, endDate]);

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
                          ...availableRoles.map(role => ({ value: role, label: formatRoleName(role) }))
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

            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                    <p className="text-gray-500">Memuat data log...</p>
                </div>
            ) : dataList.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
                    Tidak ada log aktivitas yang tercatat
                </div>
            ) : (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    {currentData.map((log) => (
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
                    </div>

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-4">
                        {currentData.map((log) => (
                            <div key={log.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{log.nama_user}</h3>
                                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                            {log.role_user}
                                        </span>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                                        log.aksi === 'CREATE' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        log.aksi === 'UPDATE' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                        'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {log.aksi}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100"></div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <Activity size={14} className="text-gray-400" />
                                        <span className="font-bold text-gray-700 uppercase text-[10px]">
                                            {formatEntitas(log.entitas)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 break-words leading-relaxed">
                                        {log.keterangan}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} className="text-gray-400" />
                                        <span>{formatDateTime(log.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={maxPage}
                onNext={next}
                onPrev={prev}
            />
        </div>
    );
}