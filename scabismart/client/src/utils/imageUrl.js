export function getImageUrl(value) {
  if (!value) return null;
  // Sudah berupa full URL (Cloudinary atau lainnya)
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  // Legacy: nilai lama berupa filename saja — kembalikan null daripada gambar rusak
  return null;
}
