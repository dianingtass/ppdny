import React, { useState, useEffect } from "react";
import api from "../../config/api";
import {
  Eye,
  Loader2,
  Mail,
  Phone
} from "lucide-react";
import AlertToast from "../../components/AlertToast";
import { useAlert } from "../../hooks/useAlert";
import InputUstadzModal from "../../components/InputUstadzModal";
import usePagination from "../../components/pagination/usePagination";
import Pagination from "../../components/pagination/Pagination";
import ProfileAvatar from '../../components/ProfileAvatar';
import SearchBar from "../../components/SearchBar";
import FilterSelect from "../../components/FilterSelect";
import FilterDropdown from "../../components/FilterDropdown";

export default function DataUstadz() {
  const [ustadzList, setUstadzList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const filteredUstadzList = ustadzList.filter(
    (item) => !selectedGender || item.jenis_kelamin === selectedGender
  );

  // Custom Hook Pagination
  const { currentData, currentPage, maxPage, next, prev, jump } =
    usePagination(filteredUstadzList);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { message, showAlert, clearAlert } = useAlert();

  // 1. Fetch Data
  const fetchUstadz = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pimpinan/ustadz?search=${search}`);
      setUstadzList(res.data.data);
    } catch (err) {
      console.error(err);
      showAlert("error", "Gagal memuat data ustadz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUstadz();
      jump(1); // Reset page saat search berubah
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    jump(1);
  }, [selectedGender]);

  const handleEdit = (data) => {
    setIsEditing(true);
    setSelectedData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 relative">
      <AlertToast message={message} onClose={clearAlert} />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Ustadz</h1>
          <p className="text-gray-500 text-sm">Kelola data tenaga pengajar</p>
        </div>
      </div>

      {/* Search Bar + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <SearchBar
          placeholder="Cari nama atau NIP..."
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
            <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
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
        <div className="p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-green-500 mb-2" size={32} />
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        <>
          {/* VIEW 1: TABEL (Desktop) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold w-[40%]">Nama & NIP</th>
                    <th className="p-4 font-semibold w-[25%]">Kontak</th>
                    <th className="p-4 font-semibold w-[25%]">Jenis Kelamin</th>
                    <th className="p-4 font-semibold text-center w-[10%]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-12 h-12 border border-gray-100 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.nama}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.nip || "Tanpa NIP"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail size={14} /> {item.email || "-"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={14} /> {item.no_hp || "-"}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {item.jenis_kelamin ? (item.jenis_kelamin === "Laki_laki" ? "Laki-laki" : "Perempuan") : "-"}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Lihat Detail"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        Data tidak ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* VIEW 2: CARDS (Mobile) */}
          <div className="block md:hidden space-y-4">
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-12 h-12 border border-gray-100 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {item.nama}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        NIP: {item.nip || "Tanpa NIP"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  <div className="grid grid-cols-1 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span>{item.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{item.no_hp || "-"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEdit(item)}
                    className="w-full py-2 bg-green-50 text-green-600 rounded-xl font-bold text-sm flex justify-center items-center gap-2 active:scale-95 transition"
                  >
                    <Eye size={16} /> Lihat Profil
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-xl text-gray-500">
                Data ustadz kosong.
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={maxPage}
            onNext={next}
            onPrev={prev}
          />
        </>
      )}

      {/* Modal detail view only for Pimpinan */}
      <InputUstadzModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={false}
        editData={selectedData}
        onSubmit={() => {}}
        saving={false}
        viewOnly={true}
      />
    </div>
  );
}
