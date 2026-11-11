'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';

const NAV_ITEMS: { id: TabId; label: string; icon: string; iconFill: string }[] = [
  { id: 'beranda', label: 'Beranda', icon: 'home', iconFill: 'home' },
  { id: 'logistik', label: 'Logistik', icon: 'inventory_2', iconFill: 'inventory_2' },
  { id: 'formulir', label: 'Pengajuan', icon: 'assignment_add', iconFill: 'assignment_add' },
  { id: 'profil', label: 'Profil', icon: 'account_circle', iconFill: 'account_circle' },
];

export default function BottomNavBar() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-nav"
      style={{ borderTop: '1px solid rgba(197, 197, 211, 0.3)' }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] min-h-[44px] gap-0.5 transition-all duration-200 rounded-xl px-3 py-1 ${
                isActive
                  ? 'text-siaga-primary'
                  : 'text-siaga-on-surface-variant hover:text-siaga-on-surface'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[24px] transition-all duration-200"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span
                className={`text-[11px] leading-[14px] tracking-[0.04em] transition-all duration-200 ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-siaga-primary opacity-0" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
