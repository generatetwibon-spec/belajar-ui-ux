'use client';

import { useApp } from '@/context/AppContext';
import { useState, useMemo } from 'react';

type FilterType = 'all' | 'urgent' | 'medical' | 'kitchen';

export default function LogistikScreen() {
  const { poskoList, setActiveTab } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedPoskoId, setSelectedPoskoId] = useState<string | null>(null);

  const filteredPosko = useMemo(() => {
    switch (activeFilter) {
      case 'urgent':
        return poskoList.filter((p) => p.status === 'kritis');
      case 'medical':
        return poskoList.filter((p) => p.jenis === 'medis');
      case 'kitchen':
        return poskoList.filter((p) => p.jenis === 'dapur');
      default:
        return poskoList;
    }
  }, [poskoList, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: poskoList.length,
      urgent: poskoList.filter((p) => p.status === 'kritis').length,
      medical: poskoList.filter((p) => p.jenis === 'medis').length,
      kitchen: poskoList.filter((p) => p.jenis === 'dapur').length,
    };
  }, [poskoList]);

  const scrollToPosko = (id: string) => {
    setSelectedPoskoId(id);
    const element = document.getElementById(`posko-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-5 animate-fade-in">
      {/* 1. Wilayah Pantauan Header */}
      <section className="px-5 pt-3">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
            </div>
            <div>
              <p className="font-heading text-[13px] font-bold text-slate-800 leading-tight">
                Koridor Cianjur - Sukabumi
              </p>
              <p className="font-body text-[11px] text-slate-500">
                Pembaruan telemetry real-time
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            LIVE SYNC
          </span>
        </div>
      </section>

      {/* 2. Interactive Map Container (Minimal Cartography) */}
      <section className="px-5">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 select-none shadow-sm">
          {/* Cartographic Canvas */}
          <svg className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 400 280">
            <rect fill="#F8FAFC" width="100%" height="100%" />

            {/* River flow */}
            <path
              d="M -10,40 C 90,80 130,170 190,210 S 320,270 420,280"
              fill="none"
              stroke="#CCFBF1"
              strokeWidth="20"
              opacity="0.7"
            />
            <path
              d="M -10,40 C 90,80 130,170 190,210 S 320,270 420,280"
              fill="none"
              stroke="#0D9488"
              strokeWidth="2.5"
            />

            {/* Roads */}
            <path d="M 0,180 L 400,80" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M 0,180 L 400,80" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M 140,0 L 260,280" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M 140,0 L 260,280" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4,4" />

            {/* Zone Label */}
            <text fill="#0D9488" fontFamily="sans-serif" fontSize="10" fontWeight="700" x="40" y="130">
              ZONA GENANGAN 1.2M
            </text>
          </svg>

          {/* Map Top Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-100 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            <span className="font-heading text-[11px] font-semibold text-slate-800">
              {poskoList.length} Posko Terpetakan
            </span>
          </div>

          {/* Marker 1: Kritis (Posko 1) */}
          <div
            onClick={() => scrollToPosko('1')}
            className="absolute top-[32%] left-[26%] -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer group"
          >
            <div className="bg-[#DC2626] text-white px-2 py-0.5 rounded-full text-[10px] font-bold font-heading shadow-md mb-1 whitespace-nowrap">
              Posko 01 (Kritis)
            </div>
            <div className="w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[14px]">priority_high</span>
            </div>
          </div>

          {/* Marker 2: Medis (Posko 3) */}
          <div
            onClick={() => scrollToPosko('3')}
            className="absolute top-[42%] left-[70%] -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer group"
          >
            <div className="bg-[#0D9488] text-white px-2 py-0.5 rounded-full text-[10px] font-bold font-heading shadow-md mb-1 whitespace-nowrap">
              Posko PMI (Medis)
            </div>
            <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[14px]">local_hospital</span>
            </div>
          </div>

          {/* Quick Legend Bar */}
          <div className="absolute bottom-2.5 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Kritis (&lt;50%)
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" /> Aman (≥50%)
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Segmented Tabs */}
      <section className="px-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-5 px-5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full font-heading text-[12px] font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Posko ({counts.all})
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-4 py-2 rounded-full font-heading text-[12px] font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'urgent'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Mendesak ({counts.urgent})
          </button>
          <button
            onClick={() => setActiveFilter('medical')}
            className={`px-4 py-2 rounded-full font-heading text-[12px] font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'medical'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Posko Medis ({counts.medical})
          </button>
          <button
            onClick={() => setActiveFilter('kitchen')}
            className={`px-4 py-2 rounded-full font-heading text-[12px] font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'kitchen'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Dapur Umum ({counts.kitchen})
          </button>
        </div>
      </section>

      {/* 4. Posko Cards Feed */}
      <section className="px-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
            Daftar Posko & Kebutuhan
          </h2>
          <span className="font-caption text-[11px] text-slate-400">
            Terdekat ke Anda
          </span>
        </div>

        {filteredPosko.map((posko) => {
          const isSelected = selectedPoskoId === posko.id;
          return (
            <article
              key={posko.id}
              id={`posko-${posko.id}`}
              className={`bg-white border rounded-2xl p-4 transition-all shadow-sm ${
                isSelected
                  ? 'border-[#1E3A8A] ring-2 ring-blue-100'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-heading text-[14px] font-bold text-slate-900 leading-snug">
                    {posko.nama}
                  </h3>
                  <div className="flex items-center gap-1.5 font-body text-[12px] text-slate-500 mt-1">
                    <span>{posko.jarak_km} km</span>
                    <span>•</span>
                    <span>Kapasitas {posko.terisi}/{posko.kapasitas} Jiwa</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold font-heading px-2.5 py-0.5 rounded-full shrink-0 ${
                    posko.status === 'kritis'
                      ? 'bg-red-50 text-[#DC2626] border border-red-100'
                      : 'bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]'
                  }`}
                >
                  {posko.status === 'kritis' ? 'KRITIS' : 'STABIL'}
                </span>
              </div>

              {/* Progress bars (Makanan, Obat, Selimut) */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-2.5 mb-3.5">
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-slate-600 font-medium">Makanan Siap Saji</span>
                  <span className={`font-bold ${posko.makanan_pct < 50 ? 'text-[#DC2626]' : 'text-[#0D9488]'}`}>
                    {posko.makanan_pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${posko.makanan_pct < 50 ? 'bg-[#DC2626]' : 'bg-[#0D9488]'}`}
                    style={{ width: `${posko.makanan_pct}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[12px] mt-1">
                  <span className="text-slate-600 font-medium">Obat-obatan & P3K</span>
                  <span className={`font-bold ${posko.obat_pct < 50 ? 'text-[#DC2626]' : 'text-[#0D9488]'}`}>
                    {posko.obat_pct}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${posko.obat_pct < 50 ? 'bg-[#DC2626]' : 'bg-[#0D9488]'}`}
                    style={{ width: `${posko.obat_pct}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-caption text-[11px] text-slate-400">
                  {posko.relawan_count} Relawan Bertugas
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('formulir')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white font-heading text-[12px] font-semibold hover:bg-[#172554] transition-colors"
                  >
                    Kirim Bantuan
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${posko.lat || -6.8124},${posko.lng || 107.1352}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-heading text-[12px] font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Rute
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
