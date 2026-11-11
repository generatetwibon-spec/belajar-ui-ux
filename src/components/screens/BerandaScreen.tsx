'use client';

import { useApp } from '@/context/AppContext';
import { TabId } from '@/lib/types';
import { useState, useEffect, useMemo, useRef } from 'react';

function StatCard({
  value,
  label,
  unit,
  badge,
  badgeColor,
  bar,
  barColor,
}: {
  value: string | number;
  label: string;
  unit?: string;
  badge: string;
  badgeColor: string;
  bar: number;
  barColor: string;
}) {
  const [display, setDisplay] = useState(0);
  const numVal = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));

  useEffect(() => {
    let start = 0;
    const duration = 800;
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
    <div className="bg-white p-3 rounded-2xl shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1.5">
        <span className="w-2 h-2 rounded-full bg-siaga-secondary" />
        <span className={`text-label-sm px-1.5 py-0.5 rounded-full text-[10px] font-bold ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <div className="mb-2">
        <div className="text-headline-md font-bold text-siaga-on-surface tabular-nums">
          {display.toLocaleString('id-ID')}
          {unit && <span className="text-body-sm font-normal text-siaga-on-surface-variant ml-0.5">{unit}</span>}
        </div>
        <div className="text-body-sm text-siaga-on-surface-variant truncate">{label}</div>
      </div>
      <div className="w-full bg-siaga-surface-container-high h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${Math.min(bar, 100)}%` }}
        />
      </div>
    </div>
  );
}

function NewsCard({
  image,
  badge,
  badgeColor,
  title,
  time,
  team,
}: {
  image: string;
  badge: string;
  badgeColor: string;
  title: string;
  time: string;
  team: string;
}) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-card flex-shrink-0 w-[280px]">
      <div className="relative w-full h-32 bg-siaga-surface-container-high overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-full text-label-sm font-bold uppercase tracking-wide ${badgeColor}`}>
            {badge}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-body-md font-semibold text-siaga-on-surface leading-snug mb-1 line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center gap-1 text-siaga-on-surface-variant text-body-sm">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>{time} • {team}</span>
        </div>
      </div>
    </article>
  );
}

export default function BerandaScreen() {
  const { stats, poskoList, setActiveTab, searchQuery, setSearchQuery } = useApp();
  const [debouncedQ, setDebouncedQ] = useState(searchQuery);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedQ(searchQuery), 300);
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

  const quickActions: { icon: string; title: string; desc: string; badge: string; badgeColor: string; tab: TabId; iconBg: string }[] = [
    {
      icon: 'local_shipping',
      title: 'Distribusi Logistik',
      desc: 'Kirim & lacak sembako, selimut, dan air bersih',
      badge: 'Prioritas',
      badgeColor: 'bg-siaga-secondary-fixed text-siaga-on-secondary-fixed',
      tab: 'logistik',
      iconBg: 'bg-siaga-secondary-container text-siaga-on-secondary-container',
    },
    {
      icon: 'assignment_add',
      title: 'Ajukan Kebutuhan',
      desc: 'Form pengajuan logistik & laporan darurat',
      badge: 'Darurat',
      badgeColor: 'bg-siaga-surface-container-high text-siaga-on-primary-fixed-variant',
      tab: 'formulir',
      iconBg: 'bg-siaga-primary-fixed text-siaga-on-primary-fixed',
    },
    {
      icon: 'groups',
      title: 'Koordinasi Relawan',
      desc: 'Shift piket, penempatan titik pantau & log medis',
      badge: 'Shift Aktif',
      badgeColor: 'bg-siaga-surface-variant text-siaga-on-surface-variant',
      tab: 'profil',
      iconBg: 'bg-siaga-surface-container-high text-siaga-primary',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-6 space-y-4 animate-fade-in-up">
      {/* Emergency Status Banner */}
      <section className="bg-siaga-primary-container text-white px-margin-mobile py-space-sm shadow-md rounded-b-2xl relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5" />

        <div className="flex items-center justify-between gap-2 mb-2 relative">
          <div className="inline-flex items-center gap-1.5 bg-siaga-error/20 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-siaga-error animate-ping" />
            <span className="text-label-sm uppercase tracking-wider text-red-200 font-bold">Pembaruan Langsung</span>
          </div>
          <span className="text-body-sm text-blue-200 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            Sinkron: Barusan
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-siaga-secondary-fixed mb-1 relative">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          <span className="text-label-md uppercase tracking-wide font-bold">Status Siaga 1</span>
        </div>
        <h2 className="text-headline-sm font-bold leading-snug mb-0.5 relative">
          Gempa & Banjir Susulan Wilayah Pantura & Cianjur
        </h2>
        <p className="text-body-sm text-blue-100 mb-3 relative">
          Prioritas evakuasi tanggap darurat dan dropping air bersih di zona merah.
        </p>

        <a
          href="tel:112"
          className="w-full flex items-center justify-center gap-2 bg-siaga-error text-white py-3 px-4 rounded-xl font-bold text-label-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all relative"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            call
          </span>
          <span>Hubungi Posko 112 / 119 (Bebas Pulsa)</span>
        </a>
      </section>

      {/* Search Bar */}
      <section className="px-margin-mobile">
        <div className="relative w-full shadow-card rounded-xl bg-white">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-siaga-on-surface-variant">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor posko, nama pengungsi, atau kebutuhan bantuan..."
            className="w-full pl-11 pr-11 py-3.5 bg-transparent rounded-xl text-body-md text-siaga-on-surface placeholder:text-siaga-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-siaga-primary-container transition-all"
          />
          <button
            aria-label="Filter Pencarian"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-siaga-on-surface-variant hover:text-siaga-primary"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
        {/* Search results hint */}
        {debouncedQ && (
          <p className="text-body-sm text-siaga-on-surface-variant mt-1.5 pl-1">
            Menampilkan <strong>{filteredPosko.length}</strong> posko untuk &quot;{debouncedQ}&quot;
          </p>
        )}
      </section>

      {/* Stats Grid */}
      <section className="px-margin-mobile">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-label-md text-siaga-on-surface-variant uppercase tracking-wide font-semibold">Ringkasan Data Siaga</span>
          <span className="text-label-sm text-siaga-secondary flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-siaga-secondary" />
            Data Terverifikasi
          </span>
        </div>
        <div className="grid grid-cols-3 gap-space-sm">
          <StatCard
            value={stats.totalPoskoAktif}
            label="Posko Aktif"
            badge="+4 baru"
            badgeColor="bg-siaga-secondary-container text-siaga-on-secondary-container"
            bar={85}
            barColor="bg-siaga-secondary"
          />
          <StatCard
            value={stats.persenStokLogistik}
            label="Stok Logistik"
            unit="%"
            badge="5 Hari"
            badgeColor="bg-siaga-surface-variant text-siaga-primary"
            bar={stats.persenStokLogistik}
            barColor="bg-siaga-primary"
          />
          <StatCard
            value={stats.totalRelawan}
            label="Relawan"
            badge="210 Siap"
            badgeColor="bg-siaga-secondary-fixed text-siaga-on-secondary-fixed"
            bar={90}
            barColor="bg-siaga-secondary"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-margin-mobile">
        <h3 className="text-headline-sm font-bold text-siaga-on-surface mb-3">Aksi Lapangan Cepat</h3>
        <div className="flex flex-col gap-space-sm">
          {quickActions.map((action) => (
            <button
              key={action.tab}
              onClick={() => setActiveTab(action.tab)}
              className="flex items-center p-3.5 bg-white rounded-2xl shadow-card hover:shadow-card-elevated hover:bg-siaga-surface-container-low transition-all active:scale-[0.99] group text-left"
            >
              <div className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {action.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-label-lg font-bold text-siaga-on-surface truncate">{action.title}</span>
                  <span className={`text-label-sm px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                </div>
                <p className="text-body-sm text-siaga-on-surface-variant truncate">{action.desc}</p>
              </div>
              <span className="material-symbols-outlined text-siaga-on-surface-variant ml-2 text-[20px] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Map Preview */}
      <section className="px-margin-mobile">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-siaga-primary">pin_drop</span>
            <h3 className="text-headline-sm font-bold text-siaga-on-surface">Peta Radius Bahaya</h3>
          </div>
          <button
            onClick={() => setActiveTab('logistik')}
            className="text-label-md text-siaga-primary font-bold hover:underline flex items-center gap-0.5"
          >
            Lihat Peta
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-card bg-white">
          <div
            className="w-full h-36 bg-cover bg-center"
            style={{
              background: 'linear-gradient(135deg, #eff4ff 0%, #e5eeff 100%)',
              position: 'relative',
            }}
          >
            {/* Simplified SVG map preview */}
            <svg viewBox="0 0 400 144" className="w-full h-full" preserveAspectRatio="none">
              <rect fill="#eff4ff" width="400" height="144" />
              <path d="M-10,40 C90,80 130,100 190,120 S320,140 420,144" fill="none" stroke="#99efe5" strokeWidth="12" opacity="0.5" />
              <path d="M-10,40 C90,80 130,100 190,120 S320,140 420,144" fill="none" stroke="#006a63" strokeWidth="2" />
              <path d="M0,90 L400,55" stroke="#ffffff" strokeWidth="5" />
              <path d="M0,90 L400,55" stroke="#c5c5d3" strokeWidth="1.5" />
              <circle cx="120" cy="78" r="8" fill="#ba1a1a" opacity="0.8" />
              <circle cx="120" cy="78" r="14" fill="#ba1a1a" opacity="0.2" className="animate-ping" />
              <circle cx="250" cy="65" r="6" fill="#006a63" opacity="0.8" />
              <text x="100" y="102" fontSize="8" fill="#444651" fontFamily="Inter" fontWeight="600">Zona Merah Cianjur</text>
            </svg>
          </div>
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-siaga-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                fmd_bad
              </span>
              <div>
                <p className="text-label-md font-bold text-siaga-on-surface">Posko Utama Balai Desa Sukamaju</p>
                <p className="text-body-sm text-siaga-on-surface-variant">Jarak: 1.4 km • Kapasitas Tersisa: 40 Orang</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('logistik')}
              className="bg-siaga-primary text-white px-3 py-1.5 rounded-lg text-label-sm font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[14px]">navigation</span>
              Rute
            </button>
          </div>
        </div>
      </section>

      {/* News Feed */}
      <section className="px-margin-mobile">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-headline-sm font-bold text-siaga-on-surface">Kabar Terkini Bencana</h3>
            <p className="text-body-sm text-siaga-on-surface-variant">Informasi terverifikasi oleh posko gabungan</p>
          </div>
          <button className="text-label-md text-siaga-primary font-bold hover:underline flex items-center">
            Lihat Semua
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        {/* Horizontal scroll news */}
        <div className="flex gap-3 overflow-x-auto -mx-margin-mobile px-margin-mobile pb-2">
          <NewsCard
            image="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80"
            badge="LOGISTIK DESA"
            badgeColor="bg-siaga-secondary text-white"
            title="Dapur Umum Lapangan Posko 03 Mulai Distribusi 2.500 Nasi Bungkus"
            time="12 Menit lalu"
            team="Tim Dapur Umum"
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=400&q=80"
            badge="EVAKUASI"
            badgeColor="bg-siaga-primary-container text-white"
            title="Akses Jalan Utama Menuju Desa Sukamaju Terbuka untuk Kendaraan Medis"
            time="45 Menit lalu"
            team="Tim SAR Gabungan"
          />
          <NewsCard
            image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80"
            badge="KESEHATAN"
            badgeColor="bg-siaga-error text-white"
            title="Kebutuhan Obat Kulit dan Selimut Bayi Mendesak di Posko Balai RW 04"
            time="2 Jam lalu"
            team="Posko Kesehatan"
          />
        </div>
      </section>

      {/* Donation Banner */}
      <section className="px-margin-mobile">
        <div className="bg-siaga-surface-container-low rounded-2xl p-4 flex items-center justify-between shadow-card">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-siaga-secondary-fixed text-siaga-on-secondary-fixed flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                volunteer_activism
              </span>
            </div>
            <div>
              <h4 className="text-label-lg font-bold text-siaga-on-surface">Salurkan Bantuan Spesifik</h4>
              <p className="text-body-sm text-siaga-on-surface-variant">Donasi popok, susu balita, & pembalut higienis terkoordinasi.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('formulir')}
            className="bg-siaga-secondary text-white px-3.5 py-2 rounded-xl text-label-sm font-bold flex-shrink-0 ml-2 hover:opacity-90 active:scale-95 transition-all"
          >
            Ajukan
          </button>
        </div>
      </section>
    </div>
  );
}
