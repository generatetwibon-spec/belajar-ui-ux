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
    <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-slate-800 text-[13px] font-semibold select-none bg-white">
      <span>{time}</span>
      {/* Dynamic Island / Notch Pill */}
      <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
        <span className="w-2 h-2 rounded-full bg-blue-900/60" />
      </div>
      <div className="flex items-center gap-1.5 text-[14px]">
        <span className="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-[15px]">wifi</span>
        <span className="material-symbols-outlined text-[16px]">battery_full</span>
      </div>
    </div>
  );
}

function MainApp() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 sm:py-8 sm:px-4 flex items-center justify-center">
      {/* Desktop presentation header & frame */}
      <div className="w-full max-w-[430px] flex flex-col items-center">
        {/* Top desktop badge */}
        <div className="hidden sm:flex items-center justify-between w-full px-2 mb-3 text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-bold">SIAGA POSKO MOBILE</span>
          </div>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
            Preview Mobile View
          </span>
        </div>

        {/* Smartphone Shell Frame */}
        <div className="w-full bg-siaga-surface text-siaga-on-surface sm:rounded-[36px] sm:shadow-[0_20px_70px_rgba(0,0,0,0.6)] sm:border-[8px] sm:border-slate-800 flex flex-col min-h-screen sm:min-h-[840px] sm:max-h-[920px] overflow-hidden relative">
          {/* Simulated Mobile Status Bar on Desktop */}
          <MobileStatusBar />

          {/* Sticky Header */}
          <AppHeader />

          {/* Floating Toast Notification */}
          <ToastContainer />

          {/* Screen Content (Scrollable Container) */}
          <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-siaga-surface">
            {activeTab === 'beranda' && <BerandaScreen />}
            {activeTab === 'logistik' && <LogistikScreen />}
            {activeTab === 'formulir' && <FormulirScreen />}
            {activeTab === 'profil' && <ProfilScreen />}
          </main>

          {/* Sticky Bottom Navigation Bar */}
          <BottomNavBar />

          {/* Home Indicator Bar */}
          <div className="hidden sm:flex justify-center py-1.5 bg-white">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
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
