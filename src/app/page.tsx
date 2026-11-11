'use client';

import { AppProvider, useApp } from '@/context/AppContext';
import AppHeader from '@/components/layout/AppHeader';
import BottomNavBar from '@/components/layout/BottomNavBar';
import ToastContainer from '@/components/ui/ToastContainer';
import BerandaScreen from '@/components/screens/BerandaScreen';
import LogistikScreen from '@/components/screens/LogistikScreen';
import FormulirScreen from '@/components/screens/FormulirScreen';
import ProfilScreen from '@/components/screens/ProfilScreen';
import { useState, useEffect } from 'react';

function MobileStatusBar() {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1.5 text-slate-700 text-[12px] font-semibold select-none bg-white border-b border-slate-100">
      <span>{time}</span>
      {/* Minimalist Camera Notch */}
      <div className="w-20 h-3.5 bg-slate-100 rounded-full flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-[14px]">wifi</span>
        <span className="material-symbols-outlined text-[14px]">battery_full</span>
      </div>
    </div>
  );
}

function MainApp() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/80 sm:py-10 sm:px-4 flex items-center justify-center">
      {/* Container */}
      <div className="w-full max-w-[420px] flex flex-col items-center">
        {/* Top Minimal Header on Desktop */}
        <div className="hidden sm:flex items-center justify-between w-full px-2 mb-3 text-slate-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            <span className="font-semibold text-slate-800 tracking-wide font-heading">
              SIAGA POSKO
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Tema 4: Public Crisis Relief</span>
          </div>
          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 shadow-sm">
            Mobile 390 × 844
          </span>
        </div>

        {/* Minimalist Smartphone Frame (White / Clean) */}
        <div className="w-full bg-white text-slate-900 sm:rounded-[36px] sm:shadow-[0_20px_50px_rgba(30,58,138,0.08)] sm:border-[6px] sm:border-white sm:ring-1 sm:ring-slate-200/80 flex flex-col min-h-screen sm:min-h-[820px] sm:max-h-[880px] overflow-hidden relative">
          {/* Status Bar */}
          <MobileStatusBar />

          {/* Sticky Clean Header */}
          <AppHeader />

          {/* Floating Toast Notification */}
          <ToastContainer />

          {/* Screen Content */}
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-white">
            {activeTab === 'beranda' && <BerandaScreen />}
            {activeTab === 'logistik' && <LogistikScreen />}
            {activeTab === 'formulir' && <FormulirScreen />}
            {activeTab === 'profil' && <ProfilScreen />}
          </main>

          {/* Sticky Bottom Navigation Bar */}
          <BottomNavBar />

          {/* Minimalist Home Indicator */}
          <div className="hidden sm:flex justify-center py-2 bg-white border-t border-slate-100">
            <div className="w-28 h-1 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
