import { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronRight, Menu, X, ArrowLeft, Printer, Download, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';

// ─── Screenshot URL resolution (singleton fetch) ───────────────────────────

let screenshotsPromise = null;
const fetchScreenshotsOnce = () => {
  if (!screenshotsPromise) {
    screenshotsPromise = api.get('/public/guidebook/screenshots?role=ppdb')
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
    ['ppdb_status_modal_lupa', 'ppdb', 'status_modal_lupa'],
    ['ppdb_status_verifikasi', 'ppdb', 'status_verifikasi'],
    ['ppdb_status_pencarian',  'ppdb', 'status_pencarian'],
    ['ppdb_status_diterima',   'ppdb', 'status_diterima'],
    ['ppdb_status_seleksi',    'ppdb', 'status_seleksi'],
    ['ppdb_status_lulus',      'ppdb', 'status_lulus'],
    ['ppdb_form_gelombang',    'ppdb', 'form_gelombang'],
    ['ppdb_form_datadiri',     'ppdb', 'form_datadiri'],
    ['ppdb_form_datawali',     'ppdb', 'form_datawali'],
    ['ppdb_form_dokumen',      'ppdb', 'form_dokumen'],
    ['ppdb_form_selesai',      'ppdb', 'form_selesai'],
    ['ppdb_landing_hero',      'ppdb', 'landing_hero'],
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
          return mapping[key] || `/assets/guidebook/ppdb/${filename.replace(/\.png$/, '.webp')}`;
        }
        return `/assets/guidebook/ppdb/${filename.replace(/\.png$/, '.webp')}`;
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
            const fallback = `/assets/guidebook/ppdb/${desktop.split('/').pop().replace(/\.png$/, '.webp')}`;
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
            const fallback = `/assets/guidebook/ppdb/${mobile.split('/').pop().replace(/\.png$/, '.webp')}`;
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
  return parts;
}

// ─── Parser ────────────────────────────────────────────────────────────────

function parseBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let inTable = false;
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (inTable) {
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        tableRows.push(trimmed);
        continue;
      } else {
        blocks.push({ type: 'table', raw: tableRows });
        inTable = false;
        tableRows = [];
      }
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableRows = [trimmed];
      continue;
    }

    if (trimmed.startsWith('{section:') && trimmed.endsWith('}')) {
      const id = trimmed.slice(9, -1);
      blocks.push({ type: 'section-anchor', id });
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2).trim() });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() });
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      continue;
    }

    if (trimmed.startsWith('> [!')) {
      const match = trimmed.match(/^>\s*\[!(important|warning|note|tip)\]/i);
      const calloutType = match ? match[1].toLowerCase() : 'tip';
      const calloutLines = [];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith('>')) {
        calloutLines.push(lines[j].trim().replace(/^>\s*/, ''));
        j++;
      }
      i = j - 1;
      blocks.push({ type: 'callout', calloutType, text: calloutLines.join(' ') });
      continue;
    }

    const dualImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\|(.*?)\)$/);
    if (dualImgMatch) {
      const alt = dualImgMatch[1];
      const desktop = dualImgMatch[2].trim();
      const mobile = dualImgMatch[3].trim();
      blocks.push({
        type: 'dual-image',
        alt,
        desktop: desktop.startsWith('/') ? desktop : `/assets/guidebook/ppdb/${desktop}`,
        mobile: mobile.startsWith('/') ? mobile : `/assets/guidebook/ppdb/${mobile}`,
      });
      continue;
    }

    const singleImgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (singleImgMatch) {
      const alt = singleImgMatch[1];
      const src = singleImgMatch[2].trim();
      blocks.push({
        type: 'image',
        alt,
        src: src.startsWith('/') ? src : `/assets/guidebook/ppdb/${src}`,
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [trimmed.replace(/^[-*]\s+/, '')];
      let j = i + 1;
      while (j < lines.length && /^[-*]\s+/.test(lines[j].trim())) {
        items.push(lines[j].trim().replace(/^[-*]\s+/, ''));
        j++;
      }
      i = j - 1;
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [trimmed.replace(/^\d+\.\s+/, '')];
      let j = i + 1;
      while (j < lines.length && /^\d+\.\s+/.test(lines[j].trim())) {
        items.push(lines[j].trim().replace(/^\d+\.\s+/, ''));
        j++;
      }
      i = j - 1;
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      continue;
    }

    if (trimmed.length > 0) {
      blocks.push({ type: 'p', text: trimmed });
    }
  }

  if (inTable && tableRows.length > 0) {
    blocks.push({ type: 'table', raw: tableRows });
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
        <h1 key={idx} className="text-3xl font-extrabold text-emerald-950 border-b-2 border-green-100 pb-3 mb-6 flex items-center gap-3">
          <span>{block.text}</span>
        </h1>
      );
    case 'h2':
      return (
        <h2 key={idx} className="text-xl font-bold text-green-700 mt-8 mb-3">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 key={idx} className="text-base md:text-lg font-semibold text-gray-800 mt-4 mb-2">
          {block.text}
        </h3>
      );
    case 'p':
      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-4 text-justify">
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
        <ul key={idx} className="list-disc pl-6 space-y-2 mb-6 text-gray-700 text-justify">
          {block.items.map((it, i) => (
            <li key={i}>{formatInline(it)}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={idx} className="list-decimal pl-6 space-y-2 mb-6 text-gray-700 text-justify">
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

export default function PPDBGuidebook() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    fetch('/assets/guidebook-ppdb.md')
      .then(r => r.text())
      .then(md => {
        const blocks = parseBlocks(md);
        const grouped = groupSections(blocks);
        setSections(grouped);
        if (grouped.length > 0) setActiveId(grouped[0].id);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load PPDB guidebook markdown:', err);
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
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    });

    sections.forEach((sec) => {
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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setMobileDrawerOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
          <button
            onClick={() => navigate('/ppdb')}
            className="flex-shrink-0 p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Kembali ke Portal PPDB"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-green-100" />
            <div>
              <h1 className="text-base font-bold tracking-wide leading-tight">Buku Panduan PPDB SIM-Tren</h1>
              <p className="text-xs text-green-100">Panduan Pendaftaran Santri Baru Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/docs/Panduan_SIM-Tren_PPDB.pdf"
            download="Panduan_SIM-Tren_PPDB.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm text-white"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Unduh PDF</span>
          </a>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm backdrop-blur-sm"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Cetak</span>
          </button>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Daftar Isi"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-row relative">
        {/* Desktop Sticky Sidebar */}
        <aside className={`no-print fixed top-26 bottom-0 left-0 z-30 w-72 bg-white border-r border-gray-200 p-5 overflow-y-auto transition-transform duration-300 md:sticky md:top-22 md:h-[calc(100vh-88px)] md:translate-x-0 ${mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Isi Panduan</h3>
            <nav className="space-y-1">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                    activeId === sec.id
                      ? 'bg-emerald-50 text-green-700 border-l-4 border-green-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {sec.title}</span>
                  <ChevronRight size={14} className={activeId === sec.id ? 'text-green-600' : 'text-gray-400'} />
                </button>
              ))}
            </nav>
          </div>
          <div className="pt-5 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">SIM-Tren Darunna'im Yapia</p>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileDrawerOpen && (
          <div onClick={() => setMobileDrawerOpen(false)} className="no-print fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden" />
        )}

        {/* Main Content Area */}
        <main className="flex-1 print-container p-6 md:p-10 max-w-4xl mx-auto bg-white shadow-sm md:my-6 md:rounded-2xl border border-gray-100 print:border-none print:shadow-none print:my-0 print:rounded-none">
          {/* Cover for Print */}
          <div className="hidden print:flex flex-col items-center justify-center text-center border-b-4 border-green-600 pb-6 mb-8">
            <img src="/pwa-192x192.png" alt="Logo" className="w-16 h-16 rounded-2xl mb-3 border" />
            <h1 className="text-3xl font-extrabold text-green-600 tracking-wide m-0">BUKU PANDUAN PENGGUNAAN SIM-TREN</h1>
            <p className="text-base text-gray-600 uppercase tracking-widest mt-1">Role: Calon Santri & Wali (PPDB Online) Pesantren Darun-Na'im Yapia</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-200 border-t-green-600" />
            </div>
          ) : (
            sections.map((sec, sIdx) => (
              <section key={sec.id} id={sec.id} className={`mb-14 print:mb-8${sIdx > 0 ? ' print-section-break' : ''}`}>
                {sec.blocks.map((blk, idx) => renderBlock(blk, idx))}
              </section>
            ))
          )}

          {/* Footer for Print */}
          <div className="hidden print:block text-center border-t border-gray-200 pt-6 mt-12 text-xs text-gray-400">
            <p>Buku Panduan SIM-Tren Pesantren Darun-Na'im Yapia © {new Date().getFullYear()}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
