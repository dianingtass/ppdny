import { useState, useMemo } from "react";

/**
 * Hook untuk sorting data tabel secara client-side.
 *
 * @param {Array}  data   — array data yang akan di-sort
 * @param {string} defaultKey — kolom default yang aktif (string kosong = tidak ada)
 * @param {string} defaultDir — "asc" | "desc"
 *
 * @returns {{ sortedData, sortKey, sortDir, handleSort }}
 */
export default function useSort(data, defaultKey = "", defaultDir = "asc", naturalSortKeys = []) {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState(defaultDir);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const setSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      // Resolve nilai nested, mis. "users.nama"
      const resolve = (obj, path) =>
        path.split(".").reduce((acc, k) => (acc != null ? acc[k] : null), obj);

      const aVal = resolve(a, sortKey);
      const bVal = resolve(b, sortKey);

      // Null/undefined selalu ke bawah
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Angka
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String / lainnya
      if (naturalSortKeys.includes(sortKey)) {
        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true, sensitivity: 'base' });
        return sortDir === "asc" ? comparison : -comparison;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDir === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, naturalSortKeys]);

  return { sortedData, sortKey, sortDir, handleSort, setSort };
}
