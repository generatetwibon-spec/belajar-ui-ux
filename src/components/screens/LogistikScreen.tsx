'use client';

import { useApp } from '@/context/AppContext';
import { Posko } from '@/lib/types';
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

  // Helper for progress bar color: <50% red, >=50% teal/green
  const getProgressColor = (pct: number) => {
    if (pct < 50) return 'bg-siaga-error';
    if (pct < 70) return 'bg-amber-500';
    return 'bg-siaga-secondary';
  };

  const getTextColor = (pct: number) => {
    if (pct < 50) return 'text-siaga-error';
    if (pct < 70) return 'text-amber-600';
    return 'text-siaga-secondary';
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-3 animate-fade-in-up">
      {/* Top Banner: Wilayah & Telemetry */}
      <section className="px-margin-mobile pt-1">
        <div className="bg-siaga-surface-container-high rounded-2xl p-3 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-siaga-secondary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[18px]">satellite_alt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-label-md text-siaga-primary font-bold truncate">
                Koridor Tanggap Cianjur-Sukabumi
              </span>
              <span className="text-body-sm text-siaga-on-surface-variant truncate">
                Pembaruan telemetry: Real-time aktif
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full text-siaga-secondary text-label-sm shrink-0 font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-siaga-secondary animate-ping" />
            LIVE SYNC
          </div>
        </div>
      </section>

      {/* Interactive Vector Map Container */}
      <section className="px-margin-mobile">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-card bg-siaga-surface-container-low select-none border border-blue-100">
          {/* Cartographic SVG Canvas */}
          <svg className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 400 320">
            <defs>
              <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#d3e4fe" strokeOpacity="0.5" strokeWidth="0.75" />
              </pattern>
              <linearGradient id="flood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9cf2e8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#80d5cb" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="hazard-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffdad6" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <rect fill="#eff4ff" width="100%" height="100%" />
            <rect fill="url(#grid-pattern)" width="100%" height="100%" />

            {/* Contours */}
            <path d="M -20,120 Q 80,60 180,95 T 420,70" fill="none" stroke="#cbdbf5" strokeDasharray="4,4" strokeWidth="1.5" />
            <path d="M -20,170 Q 120,130 220,180 T 430,140" fill="none" stroke="#cbdbf5" strokeDasharray="4,4" strokeWidth="1.5" />
            <path d="M -10,240 Q 110,210 240,250 T 430,220" fill="none" stroke="#cbdbf5" strokeDasharray="4,4" strokeWidth="1.5" />

            {/* River Banjir Luapan */}
            <path d="M -10,40 C 90,80 130,170 190,210 S 320,290 420,310" fill="none" opacity="0.65" stroke="#99efe5" strokeLinecap="round" strokeWidth="18" />
            <path d="M -10,40 C 90,80 130,170 190,210 S 320,290 420,310" fill="none" stroke="#006a63" strokeLinecap="round" strokeWidth="3" />

            {/* Inundation Hazard Polygon */}
            <path d="M 40,70 Q 130,110 160,170 T 90,230 Q 30,190 20,130 Z" fill="url(#flood-gradient)" />
            <path d="M 230,180 Q 340,170 380,240 T 260,290 Q 210,250 230,180 Z" fill="url(#hazard-gradient)" />

            {/* Road Networks */}
            <path d="M 0,200 L 400,100" stroke="#ffffff" strokeWidth="6" />
            <path d="M 0,200 L 400,100" stroke="#757682" strokeDasharray="6,4" strokeWidth="2" />
            <path d="M 140,0 L 260,320" stroke="#ffffff" strokeWidth="5" />
            <path d="M 140,0 L 260,320" stroke="#4059aa" strokeWidth="1.5" />

            {/* Text Annotations */}
            <text fill="#00504a" fontFamily="Inter" fontSize="9" fontWeight="700" letterSpacing="0.05em" x="50" y="145">
              ZONA GENANGAN AIR (1.2M)
            </text>
            <text fill="#87000a" fontFamily="Inter" fontSize="9" fontWeight="700" letterSpacing="0.05em" x="240" y="275">
              AREA RAWAN LONGSOR
            </text>
          </svg>

          {/* Top Overlay Controls */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-card flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-siaga-primary animate-pulse" />
              <span className="text-label-sm text-siaga-on-surface font-bold">
                {poskoList.length} Posko Terpetakan
              </span>
            </div>
            <button
              onClick={() => setActiveTab('formulir')}
              className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-card flex items-center gap-1 text-siaga-primary hover:bg-siaga-surface-container-high transition-all font-bold text-label-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
              Tambah Posko
            </button>
          </div>

          {/* Interactive Marker Pin 1: Kritis (Posko 1) */}
          <div
            onClick={() => scrollToPosko('1')}
            className="absolute top-[28%] left-[24%] -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          >
            <div className="bg-siaga-error text-white px-2 py-0.5 rounded-full shadow-md text-label-sm font-bold flex items-center gap-1 whitespace-nowrap mb-1">
              <span className="material-symbols-outlined text-[12px]">warning</span>
              <span>Posko Balai Desa (Kritis)</span>
            </div>
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-siaga-error opacity-40 animate-ping" />
              <div className="w-7 h-7 rounded-full bg-siaga-error text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[16px]">priority_high</span>
              </div>
            </div>
            <div className="w-1.5 h-2 bg-siaga-error rounded-b-full" />
          </div>

          {/* Interactive Marker Pin 2: Medis (Posko 3) */}
          <div
            onClick={() => scrollToPosko('3')}
            className="absolute top-[38%] left-[72%] -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          >
            <div className="bg-siaga-secondary text-white px-2 py-0.5 rounded-full shadow-md text-label-sm font-bold flex items-center gap-1 whitespace-nowrap mb-1">
              <span className="material-symbols-outlined text-[12px]">medical_services</span>
              <span>Posko PMI (Medis)</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-siaga-secondary text-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[16px]">local_hospital</span>
            </div>
            <div className="w-1.5 h-2 bg-siaga-secondary rounded-b-full" />
          </div>

          {/* Interactive Marker Pin 3: Dapur (Posko 4) */}
          <div
            onClick={() => scrollToPosko('4')}
            className="absolute top-[68%] left-[45%] -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
          >
            <div className="bg-siaga-primary-container text-white px-2 py-0.5 rounded-full shadow-md text-label-sm font-bold flex items-center gap-1 whitespace-nowrap mb-1">
              <span className="material-symbols-outlined text-[12px]">restaurant</span>
              <span>Dapur Umum</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-siaga-primary-container text-white flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[16px]">soup_kitchen</span>
            </div>
            <div className="w-1.5 h-2 bg-siaga-primary-container rounded-b-full" />
          </div>

          {/* Quick Legend Bar */}
          <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-card flex items-center gap-3">
            <div className="flex items-center gap-1 text-label-sm text-siaga-on-surface-variant font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-siaga-error" /> Kritis (&lt;50%)
            </div>
            <div className="flex items-center gap-1 text-label-sm text-siaga-on-surface-variant font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-siaga-secondary" /> Aman (&ge;50%)
            </div>
            <div className="flex items-center gap-1 text-label-sm text-siaga-on-surface-variant font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-siaga-primary-container" /> Dapur
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="w-full">
        <div className="flex items-center gap-2 overflow-x-auto px-margin-mobile py-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              activeFilter === 'all'
                ? 'bg-siaga-primary-container text-white shadow-md'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Semua Posko ({counts.all})
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-4 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              activeFilter === 'urgent'
                ? 'bg-siaga-error text-white shadow-md'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Butuh Mendesak ({counts.urgent})
          </button>
          <button
            onClick={() => setActiveFilter('medical')}
            className={`px-4 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              activeFilter === 'medical'
                ? 'bg-siaga-secondary text-white shadow-md'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Posko Medis ({counts.medical})
          </button>
          <button
            onClick={() => setActiveFilter('kitchen')}
            className={`px-4 py-2 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              activeFilter === 'kitchen'
                ? 'bg-siaga-primary text-white shadow-md'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Dapur Umum ({counts.kitchen})
          </button>
        </div>
      </section>

      {/* Posko Cards Feed */}
      <section className="px-margin-mobile flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-siaga-primary">format_list_bulleted</span>
            <h2 className="text-headline-sm font-bold text-siaga-on-surface">Daftar Distribusi Logistik</h2>
          </div>
          <span className="text-label-sm text-siaga-on-surface-variant font-medium">Urutkan: Terdekat</span>
        </div>

        {filteredPosko.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card text-siaga-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-siaga-outline mb-2">inventory_2</span>
            <p className="font-semibold text-body-md">Tidak ada posko dengan filter ini</p>
          </div>
        ) : (
          filteredPosko.map((posko) => {
            const isSelected = selectedPoskoId === posko.id;
            return (
              <article
                key={posko.id}
                id={`posko-${posko.id}`}
                className={`bg-white rounded-2xl p-4 shadow-card flex flex-col gap-3 transition-all ${
                  isSelected ? 'ring-2 ring-siaga-primary shadow-card-elevated' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-label-lg font-bold text-siaga-primary leading-tight">
                        {posko.nama}
                      </h3>
                      <span className="bg-siaga-secondary-container text-siaga-on-secondary-container px-2 py-0.5 rounded-full text-label-sm font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">verified</span> Resmi
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-siaga-on-surface-variant text-body-sm mt-1">
                      <span className="material-symbols-outlined text-[15px] text-siaga-secondary">distance</span>
                      <span>{posko.jarak_km} km</span>
                      <span>•</span>
                      <span className="material-symbols-outlined text-[15px]">group</span>
                      <span>Kapasitas: {posko.kapasitas} ({posko.terisi} terisi)</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-label-sm font-bold shrink-0 flex items-center gap-1 ${
                      posko.status === 'kritis'
                        ? 'bg-siaga-error-container text-siaga-on-error-container'
                        : posko.status === 'stok_menipis'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-siaga-secondary-container text-siaga-on-secondary-container'
                    }`}
                  >
                    {posko.status === 'kritis' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-siaga-error animate-ping" />
                    )}
                    {posko.status === 'kritis'
                      ? 'KRITIS'
                      : posko.status === 'stok_menipis'
                      ? 'MENIPIS'
                      : 'AMAN'}
                  </span>
                </div>

                {/* Real-time Needs Progress Bars */}
                <div className="bg-siaga-surface-container-low rounded-xl p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-siaga-on-surface-variant text-label-sm font-semibold pb-1 border-b border-blue-100">
                    <span>Ketersediaan Stok Kebutuhan</span>
                    <span className={posko.makanan_pct < 50 ? 'text-siaga-error font-bold' : 'text-siaga-secondary font-bold'}>
                      {posko.makanan_pct < 50 ? 'Perlu Dropping Segera' : 'Kondisi Stabil'}
                    </span>
                  </div>

                  {/* Makanan */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-siaga-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-siaga-on-surface-variant">rice_bowl</span>
                        Makanan Siap Saji
                      </span>
                      <span className={`text-label-md font-bold ${getTextColor(posko.makanan_pct)}`}>
                        {posko.makanan_pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(posko.makanan_pct)}`}
                        style={{ width: `${posko.makanan_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Obat-obatan */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-siaga-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-siaga-error">medication</span>
                        Obat-obatan & P3K
                      </span>
                      <span className={`text-label-md font-bold ${getTextColor(posko.obat_pct)}`}>
                        {posko.obat_pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(posko.obat_pct)}`}
                        style={{ width: `${posko.obat_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Selimut & Pakaian */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-body-sm">
                      <span className="text-siaga-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-siaga-secondary">bed</span>
                        Selimut & Pakaian
                      </span>
                      <span className={`text-label-md font-bold ${getTextColor(posko.selimut_pct)}`}>
                        {posko.selimut_pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(posko.selimut_pct)}`}
                        style={{ width: `${posko.selimut_pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <span className="text-body-sm text-siaga-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-siaga-secondary">support_agent</span>
                    {posko.relawan_count} Relawan Siaga
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('formulir')}
                      className="px-3 py-1.5 rounded-xl bg-siaga-secondary text-white text-label-sm font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      Kirim Bantuan
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${posko.lat || -6.8124},${posko.lng || 107.1352}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-siaga-surface-container text-siaga-primary text-label-sm font-bold hover:bg-siaga-surface-container-high active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">directions</span>
                      Rute
                    </a>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
