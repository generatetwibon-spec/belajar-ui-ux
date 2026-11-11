'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';
import { useState, useEffect, useMemo, useRef } from 'react';

function StatCard({
  value,
  label,
  unit,
  badge,
  bar,
}: {
  value: string | number;
  label: string;
  unit?: string;
  badge: string;
  bar: number;
}) {
  const [display, setDisplay] = useState(0);
  const numVal =
    typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = numVal * eased;
      setDisplay(Math.round(start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [numVal]);

  return (
    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between transition-all hover:bg-white hover:shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
        <span className="text-[10px] font-semibold text-[#0D9488] bg-[#F0FDFA] border border-[#CCFBF1] px-2 py-0.5 rounded-full">
          {badge}
        </span>
      </div>
      <div>
        <div className="font-heading text-[22px] font-bold text-slate-900 tracking-tight tabular-nums">
          {display.toLocaleString('id-ID')}
          {unit && <span className="font-sans text-[13px] font-normal text-slate-500 ml-0.5">{unit}</span>}
        </div>
        <div className="font-caption text-[12px] text-slate-500 mt-0.5 leading-snug">
          {label}
        </div>
      </div>
      <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden mt-3">
        <div
          className="h-full rounded-full bg-[#1E3A8A] transition-all duration-700"
          style={{ width: `${Math.min(bar, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function BerandaScreen() {
  const { stats, poskoList, setActiveTab, searchQuery, setSearchQuery } = useApp();
  const [debouncedQ, setDebouncedQ] = useState(searchQuery);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(searchQuery), 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchQuery]);

  const filteredPosko = useMemo(() => {
    if (!debouncedQ.trim()) return poskoList;
    const q = debouncedQ.toLowerCase();
    return poskoList.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.jenis.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [poskoList, debouncedQ]);

  const quickActions: {
    icon: string;
    title: string;
    desc: string;
    badge: string;
    tab: TabId;
  }[] = [
    {
      icon: 'local_shipping',
      title: 'Distribusi Logistik',
      desc: 'Dropping sembako, selimut & air bersih',
      badge: 'Prioritas',
      tab: 'logistik',
    },
    {
      icon: 'assignment_add',
      title: 'Ajukan Kebutuhan',
      desc: 'Form kebutuhan darurat & koordinat GPS',
      badge: 'Buka',
      tab: 'formulir',
    },
    {
      icon: 'groups',
      title: 'Koordinasi Relawan',
      desc: 'Daftar piket tugas dan verifikasi lapangan',
      badge: '14 Aktif',
      tab: 'profil',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 animate-fade-in">
      {/* 1. Status Darurat Card (Clean White with Navy border) */}
      <section className="px-5 pt-4">
        <div className="bg-white border-2 border-[#1E3A8A] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          {/* Subtle background tone */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/60 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />

          {/* Live Tag */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A] animate-pulse" />
              <span className="font-caption text-[11px] font-bold text-[#1E3A8A] tracking-wider uppercase">
                Pembaruan Langsung
              </span>
            </div>
            <span className="font-caption text-[11px] text-slate-500">
              Sinkron: Otomatis
            </span>
          </div>

          <h2 className="font-heading text-[18px] font-bold text-slate-900 leading-snug mb-1.5">
            Gempa & Banjir Susulan Wilayah Pantura & Cianjur
          </h2>
          <p className="font-body text-[13px] text-slate-600 leading-relaxed mb-4">
            Fokus prioritas: Penyaluran air bersih dan pasokan medis darurat di 6 posko aktif.
          </p>

          {/* Emergency Call Button */}
          <a
            href="tel:112"
            className="w-full flex items-center justify-center gap-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white py-3 px-4 rounded-xl font-heading text-[13px] font-bold transition-all active:scale-[0.99] shadow-sm"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              call
            </span>
            <span>Hubungi Posko 112 / 119 (Bebas Pulsa)</span>
          </a>
        </div>
      </section>

      {/* 2. Real-time Search Bar */}
      <section className="px-5">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor posko, nama relawan, atau stok bantuan..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-body text-[13px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
        {debouncedQ && (
          <p className="font-caption text-[12px] text-slate-500 mt-2 pl-1">
            Menampilkan <strong>{filteredPosko.length}</strong> posko untuk &ldquo;{debouncedQ}&rdquo;
          </p>
        )}
      </section>

      {/* 3. Ringkasan Data Siaga (3 Spacious Stats Cards) */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
            Ringkasan Data Lapangan
          </span>
          <span className="font-caption text-[11px] font-semibold text-[#0D9488] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
            Terverifikasi
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            value={stats.totalPoskoAktif}
            label="Posko Aktif"
            badge="Terdata"
            bar={80}
          />
          <StatCard
            value={stats.persenStokLogistik}
            label="Stok Rata-rata"
            unit="%"
            badge="Cukup"
            bar={stats.persenStokLogistik}
          />
          <StatCard
            value={stats.totalRelawan}
            label="Relawan Siaga"
            badge="Standby"
            bar={90}
          />
        </div>
      </section>

      {/* 4. Aksi Lapangan Cepat */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
            Aksi Lapangan Cepat
          </span>
          <span className="font-caption text-[11px] text-slate-400">
            Pintasan Menu
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => setActiveTab(action.tab)}
              className="flex items-center p-3.5 bg-white border border-slate-100 hover:border-slate-200 rounded-2xl hover:shadow-sm transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#1E3A8A] mr-3.5 flex-shrink-0 group-hover:bg-[#EFF6FF] transition-colors">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {action.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-heading text-[14px] font-bold text-slate-900 truncate">
                    {action.title}
                  </span>
                  <span className="font-caption text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                    {action.badge}
                  </span>
                </div>
                <p className="font-body text-[12px] text-slate-500 truncate">
                  {action.desc}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-400 ml-2 text-[18px] group-hover:translate-x-0.5 group-hover:text-[#1E3A8A] transition-all flex-shrink-0">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Peta Radius Bahaya Preview (Clean Minimal Cartography) */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#1E3A8A]">
              explore
            </span>
            <span className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
              Pemetaan Radius Bahaya
            </span>
          </div>
          <button
            onClick={() => setActiveTab('logistik')}
            className="font-caption text-[12px] text-[#1E3A8A] font-semibold hover:underline flex items-center gap-0.5"
          >
            Buka Peta
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="w-full h-36 bg-slate-50 relative border-b border-slate-100">
            {/* Minimal SVG map preview */}
            <svg viewBox="0 0 400 144" className="w-full h-full" preserveAspectRatio="none">
              <rect fill="#F8FAFC" width="400" height="144" />
              <path
                d="M -10,40 C 90,80 130,100 190,120 S 320,140 420,144"
                fill="none"
                stroke="#CCFBF1"
                strokeWidth="14"
              />
              <path
                d="M -10,40 C 90,80 130,100 190,120 S 320,140 420,144"
                fill="none"
                stroke="#0D9488"
                strokeWidth="2"
              />
              <path d="M 0,90 L 400,55" stroke="#FFFFFF" strokeWidth="6" />
              <path d="M 0,90 L 400,55" stroke="#E2E8F0" strokeWidth="1.5" />
              <circle cx="120" cy="78" r="6" fill="#DC2626" />
              <circle cx="120" cy="78" r="14" fill="#DC2626" opacity="0.15" />
              <circle cx="260" cy="65" r="5" fill="#0D9488" />
              <text x="135" y="82" fontSize="9" fill="#0F172A" fontFamily="sans-serif" fontWeight="600">
                Posko Induk Balai Desa
              </text>
            </svg>
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <div>
              <p className="font-heading text-[13px] font-bold text-slate-800">
                Posko Terdekat: Balai Desa Sukamaju
              </p>
              <p className="font-body text-[12px] text-slate-500">
                Jarak 0.8 km • Kapasitas 380/420 Jiwa
              </p>
            </div>
            <button
              onClick={() => setActiveTab('logistik')}
              className="bg-[#1E3A8A] text-white px-3 py-1.5 rounded-lg font-heading text-[12px] font-semibold hover:bg-[#172554] transition-colors"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </section>

      {/* 6. Kabar Terkini (Clean 16:9 Cards) */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
              Kabar Posko Terkini
            </h3>
            <p className="font-body text-[12px] text-slate-500">
              Laporan terverifikasi tim gabungan
            </p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          <article className="bg-white border border-slate-100 rounded-2xl overflow-hidden w-[260px] flex-shrink-0 shadow-sm">
            <div className="w-full h-28 bg-slate-100 relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80)',
                }}
              />
              <span className="absolute top-2 left-2 bg-[#0D9488] text-white text-[10px] font-bold font-heading px-2 py-0.5 rounded-full">
                DAPUR UMUM
              </span>
            </div>
            <div className="p-3.5">
              <h4 className="font-heading text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 mb-1.5">
                Distribusi 2.500 Porsi Nasi Bungkus ke Wilayah Terisolir
              </h4>
              <p className="font-caption text-[11px] text-slate-400">
                12 Menit lalu • Tim Relawan
              </p>
            </div>
          </article>

          <article className="bg-white border border-slate-100 rounded-2xl overflow-hidden w-[260px] flex-shrink-0 shadow-sm">
            <div className="w-full h-28 bg-slate-100 relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=400&q=80)',
                }}
              />
              <span className="absolute top-2 left-2 bg-[#1E3A8A] text-white text-[10px] font-bold font-heading px-2 py-0.5 rounded-full">
                JALUR LOGISTIK
              </span>
            </div>
            <div className="p-3.5">
              <h4 className="font-heading text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 mb-1.5">
                Akses Jalan Utama Sukamaju Telah Dibersihkan dari Puing
              </h4>
              <p className="font-caption text-[11px] text-slate-400">
                45 Menit lalu • Tim SAR
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
