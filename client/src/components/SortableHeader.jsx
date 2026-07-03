import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

/**
 * Header kolom tabel yang bisa diklik untuk sorting.
 *
 * Props:
 *  - label     : teks header
 *  - sortKey   : key field yang dipakai untuk sort (contoh: "nama", "users.nama")
 *  - activeSortKey : sortKey yang sedang aktif (dari useSort)
 *  - sortDir   : "asc" | "desc" (dari useSort)
 *  - onSort    : fungsi handleSort(key) dari useSort
 *  - className : class tambahan untuk <th> (termasuk lebar & text-center)
 *
 * Catatan: gunakan className="text-center" untuk memusatkan isi header;
 * komponen ini otomatis menambahkan justify-center ke button saat terdeteksi.
 */
export default function SortableHeader({
  label,
  sortKey,
  activeSortKey,
  sortDir,
  onSort,
  className = "",
}) {
  const isActive = activeSortKey === sortKey;
  const isCentered = className.includes("text-center");

  return (
    <th
      className={`p-4 select-none cursor-pointer ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <button
        type="button"
        className={`flex items-center gap-1 group hover:text-green-600 transition-colors ${isCentered ? "justify-center w-full" : ""}`}
      >
        <span className="uppercase">{label}</span>
        <span className={`transition-colors ${isActive ? "text-green-600" : "text-gray-300 group-hover:text-green-400"}`}>
          {isActive ? (
            sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </span>
      </button>
    </th>
  );
}
