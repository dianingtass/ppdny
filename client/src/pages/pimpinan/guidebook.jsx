import { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronRight, Menu, X, ArrowLeft, Printer, Info, AlertTriangle, Lightbulb, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

// ─── Screenshot URL resolution (singleton fetch) ───────────────────────────

let screenshotsPromise = null;
const fetchScreenshotsOnce = () => {
  if (!screenshotsPromise) {
    screenshotsPromise = api.get('/public/guidebook/screenshots?role=pimpinan')
      .then(res => res.data.success ? res.data.data : {})
      .catch(err => {
        console.warn('Failed to load guidebook screenshots from database, using fallback paths:', err);
        return {};
      });
  }
  return screenshotsPromise;
};

function parseFilename(filename) {
  const isDesktop = filename.endsWith('_desktop.png') || filename.endsWith('_desktop.webp');
  const isMobile  = filename.endsWith('_mobile.png') || filename.endsWith('_mobile.webp');
  if (!isDesktop && !isMobile) return null;

  const device = isDesktop ? 'desktop' : 'mobile';
  const core   = filename.replace(/_(desktop|mobile)\.(png|webp)$/, '');

  const map = [
    ['dashboard_utama',   'dashboard',  'utama'],
    ['santri_daftar',     'santri',     'daftar'],
    ['ustadz_daftar',     'ustadz',     'daftar'],
    ['staf_daftar',       'staf',       'daftar'],
    ['orangtua_daftar',   'orangtua',   'daftar'],
    ['kelas_kamar',       'kelas',      'kamar'],
    ['kegiatan_daftar',   'kegiatan',   'daftar'],
    ['layanan_riwayat',   'layanan',    'riwayat'],
    ['pengaduan_daftar',  'pengaduan',  'daftar'],
    ['keuangan_laporan',  'keuangan',   'laporan'],
    ['feedback_evaluasi', 'feedback',   'evaluasi'],
    ['ppdb_rekapitulasi', 'ppdb',       'rekapitulasi'],
    ['ppdb_pendaftar',    'ppdb',       'pendaftar'],
    ['absensi_daftar',    'absensi',    'daftar'],
    ['screening_daftar',  'screening',  'daftar'],
    ['observasi_daftar',  'observasi',  'daftar'],
    ['profil_utama',      'profil',     'utama'],
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
          return mapping[key] || `/assets/guidebook/pimpinan/${filename.replace(/\.png$/, '.webp')}`;
        }
        return `/assets/guidebook/pimpinan/${filename.replace(/\.png$/, '.webp')}`;
      };
      setUrls({ desktop: resolve(desktop), mobile: resolve(mobile) });
    });
  }, [desktop, mobile]);

  return (
    <div className="flex flex-row gap-4 my-6 justify-center items-end w-full print:my-4 print:page-break-inside-avoid">
      <div className="flex-[7.4] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Desktop</span>
        <img 
          src={urls.desktop} 
          alt={`${alt} - Desktop`} 
          className="h-[180px] md:h-[300px] w-auto max-w-full object-contain rounded-xl border border-gray-200 shadow-md print:h-[240px]" 
          onError={(e) => {
            const fallback = `/assets/guidebook/pimpinan/${desktop.split('/').pop().replace(/\.png$/, '.webp')}`;
            if (e.target.src !== fallback) e.target.src = fallback;
          }}
        />
      </div>
      <div className="flex-[2.6] flex flex-col items-center">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 print:text-[10px]">Mobile</span>
        <img 
          src={urls.mobile} 
          alt={`${alt} - Mobile`} 
          className="h-[180px] md:h-[300px] w-auto max-w-full object-contain rounded-xl border border-gray-200 shadow-md print:h-[240px]" 
          onError={(e) => {
            const fallback = `/assets/guidebook/pimpinan/${mobile.split('/').pop().replace(/\.png$/, '.webp')}`;
            if (e.target.src !== fallback) e.target.src = fallback;
          }}
        />
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
    tip:       { extra: ' border-green-500 bg-green-50 text-green-950',  title: 'TIPS',       icon: <Lightbulb size={16} className="text-green-600 shrink-0" /> },
  };
  const { extra, title, icon } = configs[type] || configs.tip;

  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-4 ${extra} print:my-2 print:p-3`}>
      <div className="flex items-center gap-1.5 font-bold text-xs tracking-wider uppercase mb-1">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ─── Inline Formatter ──────────────────────────────────────────────────────

function formatInline(text) {
  const parts = [];
  const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2] !== undefined) {
      parts.push(<strong key={match.index} className="font-semibold text-gray-900">{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      parts.push(<em key={match.index} className="italic text-gray-800">{match[3]}</em>);
    } else if (match[4] !== undefined) {
      parts.push(<code key={match.index} className="bg-gray-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-mono">{match[4]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

// ─── Block Parser ──────────────────────────────────────────────────────────

function parseBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    const secMatch = line.match(/^\{section:([a-zA-Z0-9_-]+)\}/);
    if (secMatch) {
      blocks.push({ type: 'section-anchor', id: secMatch[1] });
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.replace('# ', '').trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.replace('## ', '').trim() });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.replace('### ', '').trim() });
      i++;
      continue;
    }

    if (line.startsWith('> [!')) {
      const type = line.match(/> \[!(.*?)\]/)?.[1]?.toLowerCase() || 'tip';
      const calloutLines = [];
      i++;
      while (i < lines.length && lines[i].startsWith('>')) {
        calloutLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'callout', calloutType: type, text: calloutLines.join('\n') });
      continue;
    }

    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'table', raw: tableLines });
      continue;
    }

    const dualImg = line.match(/^!\[(.*?)\]\((.*?)\|(.*?)\)/);
    if (dualImg) {
      blocks.push({ type: 'dual-image', alt: dualImg[1], desktop: dualImg[2].trim(), mobile: dualImg[3].trim() });
      i++;
      continue;
    }

    const singleImg = line.match(/^!\[(.*?)\]\((.*?)\)/);
    if (singleImg) {
      blocks.push({ type: 'image', alt: singleImg[1], src: singleImg[2].trim() });
      i++;
      continue;
    }

    if (line.match(/^(\*|-)\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^(\*|-)\s+/)) {
        items.push(lines[i].replace(/^(\*|-)\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (line.startsWith('---')) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    const pLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('>') &&
      !lines[i].startsWith('---') &&
      !lines[i].match(/^\{section:/) &&
      !lines[i].match(/^!\[/) &&
      !lines[i].match(/^(\*|-|\d+\.)\s+/) &&
      !lines[i].trim().startsWith('|')
    ) {
      pLines.push(lines[i]);
      i++;
    }
    if (pLines.length) {
      blocks.push({ type: 'p', text: pLines.join(' ') });
    }
  }

  return blocks;
}

// ─── Group Blocks into H1 Sections ─────────────────────────────────────────

function groupSections(blocks) {
  const sections = [];
  let current = null;
  let pendingH1 = null;

  for (const block of blocks) {
    if (block.type === 'h1') {
      pendingH1 = block;
      continue;
    }

    if (block.type === 'section-anchor') {
      if (current) sections.push(current);
      current = {
        id: block.id,
        title: pendingH1 ? pendingH1.text : block.id,
        blocks: [],
      };
      if (pendingH1) {
        current.blocks.push(pendingH1);
        pendingH1 = null;
      }
      continue;
    }

    if (!current) {
      current = {
        id: pendingH1 ? pendingH1.text.toLowerCase().replace(/\s+/g, '-') : 'section-0',
        title: pendingH1 ? pendingH1.text : 'Pendahuluan',
        blocks: [],
      };
      if (pendingH1) {
        current.blocks.push(pendingH1);
        pendingH1 = null;
      }
    }
    current.blocks.push(block);
  }
  if (current) sections.push(current);
  return sections;
}

// ─── Renderers ─────────────────────────────────────────────────────────────

function renderBlock(block, idx) {
  switch (block.type) {
    case 'h1':
      return (
        <h1 key={idx} className="text-2xl md:text-3xl font-extrabold text-green-900 mt-8 mb-4 pb-2 border-b border-green-100 flex items-center gap-2 print:text-xl print:mt-4">
          {block.text}
        </h1>
      );
    case 'h2':
      return (
        <h2 key={idx} className="text-xl md:text-2xl font-bold text-gray-800 mt-6 mb-3 print:text-lg print:mt-3">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={idx} className="text-base md:text-lg font-semibold text-gray-700 mt-4 mb-2">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base print:text-xs">
          {formatInline(block.text)}
        </p>
      );
    case 'callout':
      return (
        <Callout key={idx} type={block.calloutType}>
          {formatInline(block.text)}
        </Callout>
      );
    case 'dual-image':
      return <Screenshot key={idx} desktop={block.desktop} mobile={block.mobile} alt={block.alt} />;
    case 'image':
      return (
        <div key={idx} className="my-6 flex flex-col items-center print:my-2">
          <img src={block.src} alt={block.alt} className="max-h-[360px] w-auto rounded-xl border border-gray-200 shadow-md" />
          {block.alt && <span className="text-xs text-gray-400 mt-2">{block.alt}</span>}
        </div>
      );
    case 'ul':
      return (
        <ul key={idx} className="space-y-1.5 my-3 ml-5 list-disc text-gray-700 text-sm md:text-base print:text-xs">
          {block.items.map((it, i) => (
            <li key={i}>{formatInline(it)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={idx} className="space-y-1.5 my-3 ml-5 list-decimal text-gray-700 text-sm md:text-base print:text-xs">
          {block.items.map((it, i) => (
            <li key={i}>{formatInline(it)}</li>
          ))}
        </ol>
      );
    case 'table': {
      const rows = block.raw.map(r => r.split('|').slice(1, -1).map(c => c.trim()));
      const header = rows[0] || [];
      const body = rows.slice(2);
      return (
        <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-gray-200 shadow-xs print:my-2">
          <table className="min-w-full divide-y divide-gray-200 text-sm print:text-xs">
            <thead className="bg-green-50">
              <tr>
                {header.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left text-xs font-bold text-green-900 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {body.map((r, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  {r.map((c, ci) => (
                    <td key={ci} className="px-3 py-2 text-gray-700">{formatInline(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'hr':
      return <hr key={idx} className="my-8 border-gray-200 print:my-4" />;
    default:
      return null;
  }
}

// ─── Main Guidebook Component ──────────────────────────────────────────────

export default function PimpinanGuidebook() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    fetch('/assets/guidebook-pimpinan.md')
      .then(r => r.text())
      .then(md => {
        const blocks = parseBlocks(md);
        const grouped = groupSections(blocks);
        setSections(grouped);
        if (grouped.length > 0) setActiveId(grouped[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load pimpinan guidebook markdown:', err);
        setLoading(false);
      });
  }, []);

  // ScrollSpy with IntersectionObserver
  useEffect(() => {
    if (sections.length === 0) return;

    if (observerRef.current) observerRef.current.disconnect();

    const callback = (entries) => {
      const visible = entries.find(e => e.isIntersecting);
      if (visible) {
        setActiveId(visible.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0,
    });

    sections.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileDrawerOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50/40 to-white flex flex-col">
      {/* ─── Top Header (Screen only) ─────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-green-100 px-4 py-3 flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/pimpinan')}
            className="p-1.5 rounded-lg text-gray-500 hover:text-green-700 hover:bg-green-50 transition"
            title="Kembali ke Dashboard Pimpinan"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-green-700" />
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">Buku Panduan Eksekutif Pimpinan</h1>
              <p className="text-xs text-gray-500">Tata Kelola & Pengawasan Terpadu SIM-Tren PPDNY</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Daftar Isi"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ─── Main Content Container ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 flex gap-8">
        {/* Desktop Sticky Table of Contents */}
        <aside className="hidden md:block w-72 shrink-0 print:hidden">
          <div className="sticky top-24 bg-white rounded-2xl border border-green-100 p-4 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 text-green-900 font-bold text-sm">
              <BookOpen size={17} className="text-green-700" />
              <span>Daftar Isi Panduan</span>
            </div>
            <nav className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {sections.map((sec, idx) => {
                const isActive = activeId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-green-700 text-white shadow-xs font-semibold'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-900'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {sec.title}</span>
                    <ChevronRight size={14} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-700'} />
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Markdown Content Area */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-green-100 p-6 md:p-10 shadow-xs print:border-none print:shadow-none print:p-0">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Memuat buku panduan eksekutif pimpinan...</div>
          ) : (
            sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24 mb-14 print:mb-8 print:break-inside-avoid">
                {sec.blocks.map((blk, idx) => renderBlock(blk, idx))}
              </section>
            ))
          )}
        </main>
      </div>

      {/* ─── Mobile Drawer Table of Contents ──────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm">Daftar Isi</span>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1 overflow-y-auto flex-1">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    activeId === sec.id ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  {idx + 1}. {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
