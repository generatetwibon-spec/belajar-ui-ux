'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';

const TAB_TITLES: Record<TabId, string> = {
  beranda: 'Beranda',
  logistik: 'Distribusi Logistik & Peta',
  formulir: 'Formulir Pengajuan',
  profil: 'Profil Relawan',
};

export default function AppHeader() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b border-blue-100/80 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-siaga-primary-container flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-[24px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold text-siaga-primary leading-tight tracking-tight">
              SIAGA POSKO
            </span>
            <span className="text-[11px] text-siaga-on-surface-variant font-bold tracking-wide uppercase">
              {TAB_TITLES[activeTab]}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Notification bell */}
          <button
            aria-label="Pemberitahuan darurat"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-siaga-on-surface-variant hover:text-siaga-primary hover:bg-siaga-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-siaga-error rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => setActiveTab('profil')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-siaga-surface-container-low transition-all"
            aria-label="Buka profil relawan"
          >
            <div className="w-8 h-8 rounded-full bg-siaga-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
              BS
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
