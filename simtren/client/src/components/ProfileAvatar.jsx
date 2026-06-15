import { useState } from 'react';
import { User } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

/**
 * Warna avatar berdasarkan hash nama — konsisten per user.
 */
const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
];

function getAvatarColor(name = '') {
  const hash = [...String(name)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

/**
 * Normalisasi nilai foto_profil:
 * - null, undefined, '-', '' → null (tampilkan fallback)
 * - URL lengkap → langsung pakai
 * - nilai lain → lewat getImageUrl (untuk kompatibilitas legacy)
 */
function resolveSrc(fotoProfil) {
  if (!fotoProfil || fotoProfil === '-') return null;
  if (fotoProfil.startsWith('http://') || fotoProfil.startsWith('https://')) return fotoProfil;
  return getImageUrl(fotoProfil);
}

/**
 * ProfileAvatar — Komponen avatar foto profil global.
 *
 * Props:
 * @param {string|null} fotoProfil - URL foto atau null
 * @param {string}      nama       - Nama user (untuk warna avatar & alt text)
 * @param {string}      className  - Class Tailwind tambahan (ukuran wajib dari luar, misal: "w-10 h-10")
 * @param {number}      iconSize   - Ukuran ikon fallback (default: 18)
 * @param {boolean}     rounded    - Apakah rounded-full (default: true). Set false untuk rounded-xl.
 *
 * @example
 * // Avatar kecil di daftar santri
 * <ProfileAvatar fotoProfil={item.foto_profil} nama={item.nama} className="w-10 h-10" />
 *
 * // Avatar besar di halaman profil
 * <ProfileAvatar fotoProfil={dataDiri.foto_profil} nama={dataDiri.nama} className="w-24 h-24" iconSize={40} />
 */
export default function ProfileAvatar({
  fotoProfil,
  nama = '',
  className = '',
  iconSize = 18,
  rounded = true,
}) {
  const [imgError, setImgError] = useState(false);
  const src = resolveSrc(fotoProfil);
  const roundedClass = rounded ? 'rounded-full' : 'rounded-xl';

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={nama || 'Profil'}
        className={`${className} ${roundedClass} object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: lingkaran berwarna + ikon User
  return (
    <div
      className={`${className} ${roundedClass} flex items-center justify-center text-white ${getAvatarColor(nama)}`}
      aria-label={nama || 'Profil'}
      role="img"
    >
      <User size={iconSize} />
    </div>
  );
}
