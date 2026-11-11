'use client';

import { useApp } from '@/context/AppContext';
import { LogisticRequest } from '@/lib/types';
import { useState } from 'react';

export default function ProfilScreen() {
  const { requests, addToast, setActiveTab } = useApp();
  const [isAvailable, setIsAvailable] = useState(true);

  const getStatusBadge = (status: LogisticRequest['status']) => {
    switch (status) {
      case 'pengiriman':
        return {
          label: 'Dalam Pengiriman',
          className: 'bg-amber-50 text-amber-800 border border-amber-200',
        };
      case 'tersalurkan':
        return {
          label: 'Tersalurkan',
          className: 'bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]',
        };
      case 'menunggu':
      default:
        return {
          label: 'Menunggu Verifikasi',
          className: 'bg-blue-50 text-[#1E3A8A] border border-blue-200',
        };
    }
  };

  const toggleStatus = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    addToast('info', next ? 'Status relawan: SIAP TUGAS' : 'Status relawan: ISTIRAHAT');
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 animate-fade-in">
      {/* 1. Volunteer Profile Card (Clean Minimalist White) */}
      <section className="px-5 pt-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#1E3A8A] flex items-center justify-center text-white text-lg font-bold font-heading shadow-sm">
                BS
              </div>
              <div>
                <h2 className="font-heading text-[16px] font-bold text-slate-900 leading-snug">
                  Budi Santoso
                </h2>
                <div className="flex items-center gap-1 text-[#0D9488] font-caption text-[11px] font-bold mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Relawan Terverifikasi</span>
                </div>
                <p className="font-caption text-[11px] text-slate-400 font-mono mt-0.5">
                  ID: REL-2024-88412
                </p>
              </div>
            </div>

            <button
              onClick={toggleStatus}
              className={`px-3 py-1 rounded-full font-heading text-[11px] font-bold transition-all ${
                isAvailable
                  ? 'bg-[#F0FDFA] text-[#0D9488] border border-[#CCFBF1]'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {isAvailable ? 'SIAP TUGAS' : 'ISTIRAHAT'}
            </button>
          </div>

          {/* 3 Metric Stats */}
          <div className="grid grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-3">
              <span className="font-heading text-[18px] font-bold text-[#1E3A8A] block">
                14
              </span>
              <span className="font-caption text-[11px] text-slate-500">
                Misi Selesai
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-3">
              <span className="font-heading text-[18px] font-bold text-[#0D9488] block">
                4
              </span>
              <span className="font-caption text-[11px] text-slate-500">
                Posko Diampu
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-3">
              <span className="font-heading text-[18px] font-bold text-slate-800 block">
                14
              </span>
              <span className="font-caption text-[11px] text-slate-500">
                Hari Bertugas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Riwayat Aktivitas & Pengajuan */}
      <section className="px-5 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-[14px] font-bold text-slate-800 tracking-tight">
              Riwayat Pengajuan Logistik
            </h3>
            <p className="font-body text-[12px] text-slate-500">
              Pelacakan status dropping bantuan Anda
            </p>
          </div>
          <button
            onClick={() => setActiveTab('formulir')}
            className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center hover:bg-[#172554] transition-colors shadow-sm"
            aria-label="Buat pengajuan baru"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
            <p className="font-body text-[13px] text-slate-500">
              Belum ada riwayat pengajuan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((req) => {
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
                  className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {req.kode || '#LOG-BARU'}
                    </span>
                    <span className="font-caption text-[11px] text-slate-400">
                      {dateStr}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading text-[13px] font-semibold text-slate-800 leading-snug">
                      {req.keterangan}
                    </h4>
                    <p className="font-body text-[12px] text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        location_on
                      </span>
                      <span>{req.lokasi_nama || 'Posko Belum Ditentukan'}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between">
                    <span className="font-caption text-[11px] text-slate-400 capitalize">
                      Kategori: {req.kategori}
                    </span>
                    <span className={`font-heading text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
