/**
 * Format angka menjadi string dengan titik ribuan (format Indonesia).
 * Contoh: 500000 → "500.000"
 */
export function formatRibuanDisplay(value) {
  if (value === "" || value === null || value === undefined) return "";
  // Hapus semua non-digit, lalu format
  const raw = String(value).replace(/\D/g, "");
  if (raw === "") return "";
  return parseInt(raw, 10).toLocaleString("id-ID");
}

/**
 * Ambil nilai angka murni (tanpa titik) dari string yang sudah diformat.
 * Contoh: "500.000" → 500000
 */
export function parseRibuan(displayValue) {
  if (!displayValue) return "";
  return String(displayValue).replace(/\./g, "");
}

/**
 * Handler onChange siap pakai untuk input rupiah.
 * Gunakan seperti ini:
 *   onChange={e => handleRupiahChange(e, (raw) => setNominal(raw))}
 *
 * @param {Event} e - event dari input
 * @param {Function} setRaw - setter untuk menyimpan angka murni ke state (tanpa titik)
 * @param {Function} setDisplay - setter untuk mengupdate tampilan input (dengan titik)
 */
export function handleRupiahChange(e, setRaw, setDisplay) {
  const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
  setRaw(raw);
  setDisplay(raw === "" ? "" : parseInt(raw, 10).toLocaleString("id-ID"));
}
