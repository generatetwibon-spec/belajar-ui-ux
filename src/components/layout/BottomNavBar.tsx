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
    <nav className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-xl border-t border-blue-100/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 relative ${
                isActive
                  ? 'text-siaga-primary font-bold scale-105'
                  : 'text-gray-500 hover:text-siaga-primary font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[24px] transition-all"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-siaga-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
