export interface Posko {
  id: string;
  nama: string;
  jenis: 'umum' | 'medis' | 'dapur';
  status: 'kritis' | 'stok_menipis' | 'aman';
  kapasitas: number;
  terisi: number;
  jarak_km: number;
  lat?: number;
  lng?: number;
  makanan_pct: number;
  obat_pct: number;
  selimut_pct: number;
  relawan_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface LogisticRequest {
  id: string;
  kode?: string;
  pelapor: string;
  posko_id?: string;
  lat?: number;
  lng?: number;
  lokasi_nama?: string;
  kategori: 'pangan' | 'medis' | 'evakuasi' | 'shelter';
  keterangan: string;
  status: 'menunggu' | 'pengiriman' | 'tersalurkan';
  created_at?: string;
  updated_at?: string;
}

export interface MissingPerson {
  id: string;
  nama: string;
  usia?: number;
  terakhir_terlihat?: string;
  deskripsi?: string;
  pelapor: string;
  status: 'dicari' | 'ditemukan';
  ditemukan_di?: string;
  created_at?: string;
}

export type TabId = 'beranda' | 'logistik' | 'formulir' | 'profil';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface AppStats {
  totalPoskoAktif: number;
  persenStokLogistik: number;
  totalRelawan: number;
}
