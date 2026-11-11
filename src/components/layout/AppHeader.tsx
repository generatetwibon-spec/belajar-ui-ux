'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';

const TAB_TITLES: Record<TabId, string> = {
  beranda: 'Beranda Posko',
  logistik: 'Peta & Distribusi Logistik',
  formulir: 'Pengajuan Kebutuhan',
  profil: 'Profil Relawan',
};

export default function AppHeader() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="h-16 px-5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-sm">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-[16px] font-bold text-[#1E3A8A] tracking-tight leading-tight">
              SIAGA POSKO
            </span>
            <span className="font-caption text-[11px] text-slate-500 font-medium">
              {TAB_TITLES[activeTab]}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Pemberitahuan darurat"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-[#1E3A8A] hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white" />
          </button>

          <button
            onClick={() => setActiveTab('profil')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity"
            aria-label="Buka profil relawan"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#1E3A8A] text-xs font-bold font-heading">
              BS
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
