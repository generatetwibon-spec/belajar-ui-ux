'use client';

import { useApp } from '@/context/AppContext';
import { LogisticRequest } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useState, useMemo } from 'react';

type FilterActivity = 'all' | 'logistik' | 'warga';

export default function ProfilScreen() {
  const { requests, addToast, setActiveTab } = useApp();
  const [filter, setFilter] = useState<FilterActivity>('all');
  const [isAvailable, setIsAvailable] = useState(true);

  const filteredRequests = useMemo(() => {
    if (filter === 'all' || filter === 'logistik') return requests;
    return []; // For now, citizens reports tab
  }, [requests, filter]);

  const getStatusBadge = (status: LogisticRequest['status']) => {
    switch (status) {
      case 'pengiriman':
        return {
          label: 'Dalam Pengiriman',
          className: 'bg-amber-100 text-amber-900 border border-amber-200',
          dotClass: 'bg-amber-500 animate-ping',
          icon: 'local_shipping',
          subtext: 'Armada logistik sedang menuju lokasi',
        };
      case 'tersalurkan':
        return {
          label: 'Tersalurkan',
          className: 'bg-siaga-secondary-container text-siaga-on-secondary-container border border-teal-200',
          dotClass: 'bg-siaga-secondary',
          icon: 'check_circle',
          subtext: 'Telah diterima & dibagikan ke warga terdampak',
        };
      case 'menunggu':
      default:
        return {
          label: 'Menunggu Verifikasi',
          className: 'bg-blue-100 text-blue-900 border border-blue-200',
          dotClass: 'bg-blue-500 animate-pulse',
          icon: 'pending',
          subtext: 'Menunggu konfirmasi koordinator gudang logistik',
        };
    }
  };

  const handleToggleStatus = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    addToast(
      'info',
      nextState ? 'Status kesiapan diubah: SIAP TUGAS' : 'Status kesiapan diubah: ISTIRAHAT'
    );
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-4 animate-fade-in-up">
      {/* Volunteer Profile Hero Card */}
      <section className="px-margin-mobile pt-1">
        <div className="bg-white rounded-2xl p-4 shadow-card border border-blue-50 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-siaga-primary-container flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-siaga-secondary border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>
                </span>
              </div>

              {/* Volunteer Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-headline-sm font-bold text-siaga-on-surface leading-tight">
                    Budi Santoso
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1 text-siaga-secondary font-bold text-label-sm mt-0.5">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span>Relawan Terverifikasi BPBD</span>
                </div>
                <span className="text-body-sm text-siaga-on-surface-variant font-mono">
                  ID: REL-2024-88412
                </span>
              </div>
            </div>

            {/* Status chip toggle */}
            <button
              onClick={handleToggleStatus}
              className={`px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isAvailable
                  ? 'bg-siaga-secondary-container text-siaga-on-secondary-container'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-siaga-secondary animate-pulse' : 'bg-gray-500'}`} />
              <span>{isAvailable ? 'SIAP TUGAS' : 'ISTIRAHAT'}</span>
            </button>
          </div>

          {/* Volunteer Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <div className="bg-siaga-surface-container-low rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-headline-sm font-bold text-siaga-primary">14</span>
              <span className="text-label-sm text-siaga-on-surface-variant mt-0.5">Misi Selesai</span>
            </div>
            <div className="bg-siaga-surface-container-low rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-headline-sm font-bold text-siaga-secondary">4</span>
              <span className="text-label-sm text-siaga-on-surface-variant mt-0.5">Posko Diampu</span>
            </div>
            <div className="bg-siaga-surface-container-low rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <span className="text-headline-sm font-bold text-siaga-on-surface">14</span>
              <span className="text-label-sm text-siaga-on-surface-variant mt-0.5">Hari Bertugas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Database & Sync Status Banner */}
      <section className="px-margin-mobile">
        <div className="bg-siaga-surface-container rounded-2xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-siaga-primary">
              {isSupabaseConfigured ? 'cloud_done' : 'database'}
            </span>
            <div className="flex flex-col">
              <span className="text-label-sm font-bold text-siaga-primary">
                {isSupabaseConfigured ? 'Supabase PostgreSQL Terhubung' : 'Mode Data Lokal Aktif'}
              </span>
              <span className="text-body-sm text-siaga-on-surface-variant">
                {isSupabaseConfigured
                  ? 'Sinkronisasi real-time posko & pengajuan aktif'
                  : 'Siap dihubungkan ke Supabase via .env.local'}
              </span>
            </div>
          </div>
          <span className="text-label-sm px-2.5 py-1 rounded-full bg-white text-siaga-primary font-bold shadow-sm">
            {requests.length} Data
          </span>
        </div>
      </section>

      {/* Activity Tracker Section */}
      <section className="px-margin-mobile flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-headline-sm font-bold text-siaga-on-surface">Riwayat & Pelacakan</h3>
            <p className="text-body-sm text-siaga-on-surface-variant">
              Aktivitas penanganan krisis & pengajuan logistik Anda
            </p>
          </div>
          <button
            onClick={() => setActiveTab('formulir')}
            className="w-9 h-9 rounded-full bg-siaga-primary text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
            aria-label="Buat pengajuan baru"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              filter === 'all'
                ? 'bg-siaga-primary text-white'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Semua Aktivitas ({requests.length})
          </button>
          <button
            onClick={() => setFilter('logistik')}
            className={`px-3.5 py-1.5 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              filter === 'logistik'
                ? 'bg-siaga-primary text-white'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Pengajuan Logistik ({requests.length})
          </button>
          <button
            onClick={() => setFilter('warga')}
            className={`px-3.5 py-1.5 rounded-full text-label-md font-bold whitespace-nowrap transition-all shadow-sm ${
              filter === 'warga'
                ? 'bg-siaga-primary text-white'
                : 'bg-siaga-surface-container-low text-siaga-on-surface-variant hover:text-siaga-on-surface'
            }`}
          >
            Laporan Warga (0)
          </button>
        </div>

        {/* Request Activity Cards */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-card text-siaga-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-siaga-outline mb-2">inbox</span>
            <p className="font-semibold text-body-md">Belum ada riwayat aktivitas</p>
            <button
              onClick={() => setActiveTab('formulir')}
              className="mt-3 px-4 py-2 rounded-xl bg-siaga-primary text-white text-label-sm font-bold inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Buat Pengajuan Sekarang
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const badge = getStatusBadge(req.status);
            const dateStr = req.created_at
              ? new Date(req.created_at).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                }) + ' WIB'
              : 'Barusan';

            return (
              <article
                key={req.id}
                className="bg-white rounded-2xl p-4 shadow-card flex flex-col gap-2.5 border border-blue-50 hover:shadow-card-elevated transition-all"
              >
                {/* Top Row: Code & Time */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label-sm font-mono font-bold px-2 py-0.5 rounded bg-siaga-surface-container text-siaga-primary">
                    {req.kode || '#LOG-BARU'}
                  </span>
                  <span className="text-label-sm text-siaga-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {dateStr}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h4 className="text-label-lg font-bold text-siaga-on-surface leading-snug">
                    {req.keterangan}
                  </h4>
                  <div className="flex items-center gap-1 text-body-sm text-siaga-on-surface-variant mt-1">
                    <span className="material-symbols-outlined text-[15px] text-siaga-secondary shrink-0">
                      location_on
                    </span>
                    <span className="truncate">{req.lokasi_nama || 'Posko Belum Ditentukan'}</span>
                  </div>
                </div>

                {/* Status Indicator Pill */}
                <div className="bg-siaga-surface-container-low rounded-xl p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
                      <span className={`text-label-sm font-bold px-2.5 py-0.5 rounded-full ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-label-sm text-siaga-on-surface-variant font-medium capitalize">
                      Kategori: {req.kategori}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-siaga-on-surface text-body-sm">
                    <span className="material-symbols-outlined text-[18px] text-siaga-primary shrink-0">
                      {badge.icon}
                    </span>
                    <span className="text-body-sm font-medium truncate">{badge.subtext}</span>
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
