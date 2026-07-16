import { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronRight, Menu, X, ArrowLeft, Printer, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

// ─── Screenshot URL resolution (singleton fetch) ───────────────────────────

let screenshotsPromise = null;
const fetchScreenshotsOnce = () => {
  if (!screenshotsPromise) {
    screenshotsPromise = api.get('/public/guidebook/screenshots?role=santri')
      .then(res => res.data.success ? res.data.data : {})
      .catch(err => {
        console.warn('Failed to load guidebook screenshots from database, using fallback paths:', err);
        return {};
      });
  }
  return screenshotsPromise;
};

function parseFilename(filename) {
  const isDesktop = filename.endsWith('_desktop.png');
  const isMobile  = filename.endsWith('_mobile.png');
  if (!isDesktop && !isMobile) return null;

  const device = isDesktop ? 'desktop' : 'mobile';
  const core   = filename.replace(/_(desktop|mobile)\.png$/, '');

  const map = [
    ['login',                            'auth',           'login'],
    ['lupa_password',                    'auth',           'lupa_password'],
    ['dashboard',                        'dashboard',      'main'],
    ['notifikasi',                       'dashboard',      'notifikasi'],
    ['scabies_dashboard',                'scabies',        'dashboard'],
    ['scabies_detail_materi',            'scabies',        'detail_materi'],
    ['scabies_modal_ajukan_materi',      'scabies',        'ajukan_materi'],
    ['scabies_materi',                   'scabies',        'materi'],
    ['riwayat_layanan_modal_detail',     'riwayat_layanan','detail'],
    ['riwayat_layanan_modal_feedback',   'riwayat_layanan','feedback'],
    ['riwayat_layanan',                  'riwayat_layanan','main'],
    ['keuangan_modal_detail',            'keuangan',       'detail'],
    ['keuangan',                         'keuangan',       'main'],
    ['kegiatan_modal_detail',            'kegiatan',       'detail'],
    ['kegiatan_modal_feedback',          'kegiatan',       'feedback'],
    ['kegiatan',                         'kegiatan',       'main'],
    ['pengaduan_modal_detail',           'pengaduan',      'detail'],
    ['pengaduan',                        'pengaduan',      'main'],
    ['layanan_modal_detail',             'layanan',        'detail'],
    ['layanan_modal_form',               'layanan',        'form'],
    ['layanan',                          'layanan',        'main'],
    ['konsultasi_room_riwayat',          'konsultasi',     'room'],
    ['konsultasi_room',                  'konsultasi',     'room_active'],
    ['konsultasi_riwayat',              'konsultasi',     'riwayat'],
    ['konsultasi',                       'konsultasi',     'main'],
    ['profil_upload_foto',               'profil',         'upload_foto'],
    ['profil_data_diri_belum_lengkap',   'profil',         'data_diri_belum_lengkap'],
    ['profil_data_diri',                 'profil',         'data_diri'],
    ['profil_ortu_locked',               'profil',         'ortu_locked'],
    ['profil_ortu_cari',                 'profil',         'ortu_cari'],
    ['profil_ortu',                      'profil',         'ortu'],
    ['profil_modal_ganti_password',      'profil',         'ganti_password'],
    ['profil',                           'profil',         'main'],
  ];

  for (const [prefix, modul, bagian] of map) {
    if (core.startsWith(prefix)) return { modul, bagian, device };
  }
  return null;
}

// ─── Screenshot Component ──────────────────────────────────────────────────

function Screenshot({ desktop, mobile, alt = 'Screenshot' }) {
  const [urls, setUrls] = useState({ desktop, mobile });

  useEffect(() => {
    fetchScreenshotsOnce().then(mapping => {
      const resolve = (localPath) => {
        if (!localPath || typeof localPath !== 'string') return localPath;
        const filename = localPath.split('/').pop();
        const parsed = parseFilename(filename);
        if (parsed) {
          const key = `${parsed.modul}_${parsed.bagian}_${parsed.device}`;
          return mapping[key] || localPath;
        }
        return localPath;
      };
      setUrls({ desktop: resolve(desktop), mobile: resolve(mobile) });
    });
  }, [desktop, mobile]);

  return (
    <div className="flex flex-row gap-4 my-6 justify-center items-end w-full print:my-4 print:page-break-inside-avoid">
      <div className="flex-[7.4] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Desktop</span>
        <img src={urls.desktop} alt={`${alt} - Desktop`} className="h-[180px] md:h-[300px] w-auto max-w-full object-contain rounded-xl border border-gray-200 shadow-md print:h-[240px]" />
      </div>
      <div className="flex-[2.6] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Mobile</span>
        <img src={urls.mobile} alt={`${alt} - Mobile`} className="h-[180px] md:h-[300px] w-auto max-w-full object-contain rounded-xl border border-gray-200 shadow-md print:h-[240px]" />
      </div>
    </div>
  );
}

// ─── Callout Component ─────────────────────────────────────────────────────

function Callout({ type, children }) {
  const configs = {
    important: { extra: ' border-red-500 bg-red-50 text-red-950',      title: 'PENTING',    icon: <AlertTriangle size={16} className="text-red-600 shrink-0" /> },
    warning:   { extra: ' border-amber-500 bg-amber-50 text-amber-950', title: 'PERINGATAN', icon: <AlertTriangle size={16} className="text-amber-600 shrink-0" /> },
    note:      { extra: ' border-blue-500 bg-blue-50 text-blue-950',    title: 'CATATAN',    icon: <Info size={16} className="text-blue-600 shrink-0" /> },
    tip:       { extra: ' border-teal-500 bg-teal-50 text-teal-950',    title: 'TIPS',       icon: <Lightbulb size={16} className="text-teal-600 shrink-0" /> },
  };
  const { extra, title, icon } = configs[type] || configs.tip;

  return (
    <div className={`border-l-4 p-4 my-5 rounded-r-xl text-sm leading-relaxed print:my-3${extra}`}>
      <div className="flex items-center gap-2 font-bold mb-1.5 text-xs tracking-wider">
        {icon}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ─── Markdown Parser ───────────────────────────────────────────────────────

/**
 * Converts inline markdown (bold, italic, code) into React elements.
 */
function parseInline(text) {
  const parts = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) parts.push(<strong key={m.index}>{m[1]}</strong>);
    else if (m[2] !== undefined) parts.push(<em key={m.index}>{m[2]}</em>);
    else if (m[3] !== undefined) parts.push(<code key={m.index} className="bg-gray-100 text-green-700 px-1 rounded text-sm font-mono">{m[3]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const IMG_BASE = '/assets/guidebook/santri/';

/**
 * Parses the flat markdown text into an array of typed block objects.
 */
function parseMarkdown(md) {
  const lines  = md.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { i++; continue; }

    // H1
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() });
      i++; continue;
    }

    // H2
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() });
      i++; continue;
    }

    // Section anchor tag  {section:id}
    const sectionMatch = line.match(/^\{section:(\w+)\}$/);
    if (sectionMatch) {
      blocks.push({ type: 'section_start', id: sectionMatch[1] });
      i++; continue;
    }

    // Callout  > [!type]
    const calloutMatch = line.match(/^>\s*\[!(tip|note|important|warning)\]$/i);
    if (calloutMatch) {
      const type = calloutMatch[1].toLowerCase();
      i++;
      const contentLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        contentLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'callout', calloutType: type, text: contentLines.join(' ') });
      continue;
    }

    // Screenshot image  ![alt](desktop.png|mobile.png)
    const imgMatch = line.match(/^!\[(.+?)\]\((.+?)\|(.+?)\)$/);
    if (imgMatch) {
      blocks.push({
        type: 'screenshot',
        alt: imgMatch[1],
        desktop: IMG_BASE + imgMatch[2].trim(),
        mobile:  IMG_BASE + imgMatch[3].trim(),
      });
      i++; continue;
    }

    // Ordered list item
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trimEnd())) {
        items.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Unordered list item
    if (/^[*-]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[*-]\s/.test(lines[i].trimEnd())) {
        items.push(lines[i].replace(/^[*-]\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Non-empty paragraph
    if (line.trim()) {
      blocks.push({ type: 'p', text: line.trim() });
    }

    i++;
  }

  return blocks;
}

/**
 * Groups parsed blocks into sections (each section starts with section_start).
 * Handles h1 appearing BEFORE the {section:id} anchor in the markdown.
 */
function groupSections(blocks) {
  const sectionOrder = [];
  const sections     = {};
  let current        = null;
  let pendingH1      = null; // h1 that appears before a section_start anchor

  for (const block of blocks) {
    if (block.type === 'section_start') {
      current = block.id;
      sectionOrder.push(current);
      // Assign any pending h1 that came before this anchor
      sections[current] = { h1: pendingH1, blocks: [] };
      pendingH1 = null;
    } else if (block.type === 'h1' && !current) {
      // h1 before any section_start — save it for the upcoming section
      pendingH1 = block.text;
    } else if (!current) {
      // Ignore other blocks before first section
    } else if (block.type === 'h1' && !sections[current].h1) {
      sections[current].h1 = block.text;
    } else {
      sections[current].blocks.push(block);
    }
  }

  return { sectionOrder, sections };
}

// ─── Block Renderer ────────────────────────────────────────────────────────

function renderBlock(block, idx) {
  switch (block.type) {
    case 'h1':
      return (
        <h1 key={idx} className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
          <span>{block.text}</span>
        </h1>
      );
    case 'h2':
      return (
        <h2 key={idx} className="text-xl font-bold text-green-600 mt-8 mb-3">{block.text}</h2>
      );
    case 'p':
      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-4 text-justify">
          {parseInline(block.text)}
        </p>
      );
    case 'ul':
      return (
        <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-justify">
          {block.items.map((item, j) => <li key={j}>{parseInline(item)}</li>)}
        </ul>
      );
    case 'ol':
      return (
        <ol key={idx} className="list-decimal pl-6 space-y-2 mb-6 text-gray-700 text-justify">
          {block.items.map((item, j) => <li key={j}>{parseInline(item)}</li>)}
        </ol>
      );
    case 'callout':
      return (
        <Callout key={idx} type={block.calloutType}>
          {parseInline(block.text)}
        </Callout>
      );
    case 'screenshot':
      return <Screenshot key={idx} desktop={block.desktop} mobile={block.mobile} alt={block.alt} />;
    default:
      return null;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function SantriGuidebook() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]     = useState(false);
  const [activeSection, setActiveSection] = useState('pendahuluan');
  const [parsedData, setParsedData]       = useState(null);
  const [loading, setLoading]             = useState(true);

  const sectionsMeta = [
    { id: 'pendahuluan', label: '1. Pendahuluan' },
    { id: 'instalasi',   label: '2. Instalasi & Login' },
    { id: 'dashboard',   label: '3. Dashboard Utama' },
    { id: 'notifikasi',  label: '4. Notifikasi' },
    { id: 'profil',      label: '5. Profil & Akun' },
    { id: 'keuangan',    label: '6. Tagihan & Keuangan' },
    { id: 'kegiatan',    label: '7. Kegiatan Pesantren' },
    { id: 'pengaduan',   label: '8. Pengaduan Pelanggaran' },
    { id: 'layanan',     label: '9. Layanan Pesantren' },
    { id: 'scabies',     label: '10. Kesehatan & Scabies' },
    { id: 'konsultasi',  label: '11. Konsultasi Timkes' },
  ];

  // Single ref-map holding DOM nodes for each section (avoids calling useRef in a loop)
  const sectionRefsMap = useRef({});

  // Fetch and parse the markdown file
  useEffect(() => {
    fetch('/assets/guidebook-santri.md')
      .then(res => res.text())
      .then(text => {
        const blocks  = parseMarkdown(text);
        const grouped = groupSections(blocks);
        setParsedData(grouped);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load guidebook markdown:', err);
        setLoading(false);
      });
  }, []);

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const s of sectionsMeta) {
        const el = sectionRefsMap.current[s.id];
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(s.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefsMap.current[id];
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      setActiveSection(id);
      setSidebarOpen(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 antialiased print:bg-white print:text-black">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print, header, nav, button, footer { display: none !important; }
          @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
          body { font-size: 12pt !important; line-height: 1.5 !important; background: white !important; color: black !important; }
          .print-container { display: block !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          .print-section-break { page-break-before: always !important; }
          h1, h2, h3, h4, h5, h6 { color: #047857 !important; page-break-inside: avoid !important; page-break-after: avoid !important; }
          h1 { font-size: 24pt !important; margin-top: 30pt !important; margin-bottom: 15pt !important; border-bottom: 2px solid #e5e7eb !important; padding-bottom: 6pt !important; }
          h2 { font-size: 18pt !important; margin-top: 24pt !important; margin-bottom: 12pt !important; }
          h3 { font-size: 14pt !important; margin-top: 18pt !important; margin-bottom: 10pt !important; }
          h4 { font-size: 12pt !important; font-weight: bold !important; margin-top: 14pt !important; }
          p, li, blockquote { font-size: 11pt !important; text-align: left !important; }
          ul, ol { padding-left: 28pt !important; margin-bottom: 12pt !important; }
          li { margin-bottom: 4pt !important; }
          blockquote { background-color: #f9fafb !important; border-left: 4px solid #10b981 !important; padding: 10pt 15pt !important; margin: 12pt 0 !important; font-size: 10.5pt !important; }
          table { width: 100% !important; border-collapse: collapse !important; margin: 15pt 0 !important; font-size: 10pt !important; }
          th, td { padding: 8pt 10pt !important; border-bottom: 1px solid #e5e7eb !important; }
          th { background-color: #f3f4f6 !important; }
          .print-image-row { display: flex !important; flex-direction: row !important; gap: 15pt !important; page-break-inside: avoid !important; margin: 15pt 0 !important; }
        }
      `}} />

      {/* Header */}
      <header className="no-print sticky top-0 z-40 bg-[url('/header.png')] bg-cover bg-center text-white shadow-md px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/santri')} className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors" title="Kembali ke Dashboard">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-green-100" />
            <div>
              <h1 className="text-base font-bold tracking-wide leading-tight">Buku Panduan SIM-Tren</h1>
              <p className="text-xs text-green-100">Panduan penggunaan untuk Santri</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm backdrop-blur-sm">
            <Printer size={15} />
            <span className='hidden md:flex'>Cetak PDF</span>
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-row relative">

        {/* Sidebar */}
        <aside className={`no-print fixed top-26 bottom-0 left-0 z-30 w-72 bg-white border-r border-gray-200 p-5 overflow-y-auto transition-transform duration-300 md:sticky md:top-22 md:h-[calc(100vh-88px)] md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Isi Panduan</h3>
            <nav className="space-y-1">
              {sectionsMeta.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${activeSection === s.id ? 'bg-emerald-50 text-green-600 border-l-4 border-green-500 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span>{s.label}</span>
                  <ChevronRight size={14} className={activeSection === s.id ? 'text-green-500' : 'text-gray-400'} />
                </button>
              ))}
            </nav>
          </div>
          <div className="pt-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">SIM-Tren Darunna'im Yapia</p>
          </div>
        </aside>

        {/* Backdrop mobile */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="no-print fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden" />
        )}

        {/* Main Content */}
        <main className="flex-1 print-container p-6 md:p-10 max-w-4xl mx-auto bg-white shadow-sm md:my-6 md:rounded-2xl border border-gray-100 print:border-none print:shadow-none print:my-0 print:rounded-none">

          {/* Cover for Print */}
          <div className="hidden print:flex flex-col items-center justify-center text-center border-b-4 border-green-600 pb-6 mb-8">
            <img src="/pwa-192x192.png" alt="Logo" className="w-16 h-16 rounded-2xl mb-3 border" />
            <h1 className="text-3xl font-extrabold text-green-600 tracking-wide m-0">BUKU PANDUAN PENGGUNAAN SIM-TREN</h1>
            <p className="text-base text-gray-600 uppercase tracking-widest mt-1">Role: Santri Pesantren Darun-Na'im Yapia</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-200 border-t-green-600" />
            </div>
          )}

          {!loading && parsedData && sectionsMeta.map((s, sIdx) => {
            const sec = parsedData.sections[s.id];
            if (!sec) return null;
            return (
              <section
                key={s.id}
                ref={el => { sectionRefsMap.current[s.id] = el; }}
                className={`mb-14 print:mb-8${sIdx > 0 ? ' print-section-break' : ''}`}
              >
                <h1 className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
                  <span>{sec.h1}</span>
                </h1>
                {sec.blocks.map((block, idx) => renderBlock(block, idx))}
              </section>
            );
          })}

          {/* Footer for Print */}
          <div className="hidden print:block text-center border-t border-gray-200 pt-6 mt-12 text-xs text-gray-400">
            <p>Buku Panduan SIM-Tren Pesantren Darun-Na'im Yapia © {new Date().getFullYear()}</p>
          </div>

        </main>
      </div>
    </div>
  );
}
