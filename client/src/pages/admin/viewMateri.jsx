import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import CardMateri from "../../components/CardMateri";
import api from "../../config/api";
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";


export default function MateriView() {
    const [materi, setMateri] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSumber, setSelectedSumber] = useState("");
    const [loading, setLoading] = useState(true);
    
    const fetchMateri = async () => {
        setLoading(true);
        try {
            const res = await api.get("/global/viewMateri", {
                headers: { "Cache-Control": "no-cache" }
            });
            
            if (res.data.success) {
                setMateri(res.data.data.list_materi);
            } else {
                console.error(res.data.message);
                setMateri([]);
            }
        } catch (err) {
            console.error("Fetch error:", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchMateri();
    }, []);

    const filteredMateri = materi.filter((item) => {
        const matchSearch = item.judul.toLowerCase().includes(search.toLowerCase());
        const matchSumber = !selectedSumber ||
            (selectedSumber === "pengalaman" ? item.sumber === "pengalaman" : item.sumber !== "pengalaman");
        return matchSearch && matchSumber;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Daftar Materi</h1>
                    <p className="text-gray-500 text-sm">Jendela Ilmu Pengetahuan Tentang Scabies</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                <SearchBar
                    placeholder="Cari berdasarkan judul materi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => setSearch("")}
                    className="flex-1"
                />
                <FilterDropdown
                    activeCount={selectedSumber ? 1 : 0}
                    onReset={() => setSelectedSumber("")}
                >
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Sumber Materi</label>
                        <FilterSelect
                            placeholder="Semua Sumber"
                            value={selectedSumber}
                            onChange={(e) => setSelectedSumber(e.target.value)}
                            options={[
                                { value: "teori", label: "Berdasarkan Teori" },
                                { value: "pengalaman", label: "Berdasarkan Pengalaman" },
                            ]}
                        />
                    </div>
                </FilterDropdown>
            </div>

            {loading ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
                    <p className="text-gray-500">Memuat materi...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-10">
                    {filteredMateri.length > 0 ? (
                        filteredMateri.map((item) => (
                            <CardMateri 
                                key={item.id} 
                                materi={item} 
                                detailBasePath="/materi/detail" 
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center p-12 bg-white rounded-xl border border-gray-100 text-gray-500 shadow-sm">
                            Materi tidak ditemukan.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}