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
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-white/92 backdrop-blur-xl shadow-header">
      <div className="h-16 px-margin-mobile flex items-center justify-between max-w-lg mx-auto">
        {/* Logo + Title */}
        <div className="flex items-center gap-space-xs">
          {/* Shield icon as logo */}
          <div className="w-9 h-9 rounded-xl bg-siaga-primary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px] text-siaga-on-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-headline-sm font-bold text-siaga-primary leading-tight tracking-tight">
              SIAGA POSKO
            </span>
            <span className="text-label-sm text-siaga-on-surface-variant font-medium tracking-wide uppercase">
              {TAB_TITLES[activeTab]}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notification bell */}
          <button
            aria-label="Pemberitahuan darurat"
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-siaga-on-surface-variant hover:text-siaga-primary hover:bg-siaga-surface-container-low transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-siaga-error rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Profile avatar */}
          <button
            onClick={() => setActiveTab('profil')}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-siaga-surface-container-low transition-all"
            aria-label="Buka profil relawan"
          >
            <div className="w-8 h-8 rounded-full bg-siaga-primary-container flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[20px] text-siaga-on-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
