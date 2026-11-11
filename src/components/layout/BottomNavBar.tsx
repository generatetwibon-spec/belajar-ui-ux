'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';

const NAV_ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: 'beranda', label: 'Beranda', icon: 'home' },
  { id: 'logistik', label: 'Logistik', icon: 'inventory_2' },
  { id: 'formulir', label: 'Pengajuan', icon: 'assignment_add' },
  { id: 'profil', label: 'Profil', icon: 'account_circle' },
];

export default function BottomNavBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-2px_12px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-around h-16 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive
                  ? 'text-[#1E3A8A] font-semibold'
                  : 'text-slate-400 hover:text-slate-700 font-normal'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[23px] transition-transform duration-150"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="font-caption text-[11px] leading-tight mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
