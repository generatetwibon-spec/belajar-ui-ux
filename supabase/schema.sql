-- ============================================================
--  SIAGA POSKO — Supabase PostgreSQL Schema
--  Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: posko
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posko (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama            TEXT NOT NULL,
  jenis           TEXT NOT NULL CHECK (jenis IN ('umum', 'medis', 'dapur')),
  status          TEXT NOT NULL DEFAULT 'aman' CHECK (status IN ('kritis', 'stok_menipis', 'aman')),
  kapasitas       INTEGER NOT NULL DEFAULT 0,
  terisi          INTEGER NOT NULL DEFAULT 0,
  jarak_km        DECIMAL(5,2) DEFAULT 0,
  lat             DECIMAL(10,6),
  lng             DECIMAL(10,6),
  makanan_pct     INTEGER NOT NULL DEFAULT 100 CHECK (makanan_pct BETWEEN 0 AND 100),
  obat_pct        INTEGER NOT NULL DEFAULT 100 CHECK (obat_pct BETWEEN 0 AND 100),
  selimut_pct     INTEGER NOT NULL DEFAULT 100 CHECK (selimut_pct BETWEEN 0 AND 100),
  relawan_count   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: logistic_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.logistic_requests (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kode            TEXT UNIQUE,
  pelapor         TEXT NOT NULL,
  posko_id        UUID REFERENCES public.posko(id) ON DELETE SET NULL,
  lat             DECIMAL(10,6),
  lng             DECIMAL(10,6),
  lokasi_nama     TEXT,
  kategori        TEXT NOT NULL CHECK (kategori IN ('pangan', 'medis', 'evakuasi', 'shelter')),
  keterangan      TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'pengiriman', 'tersalurkan')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: missing_persons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.missing_persons (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama            TEXT NOT NULL,
  usia            INTEGER,
  terakhir_terlihat TEXT,
  deskripsi       TEXT,
  pelapor         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'dicari' CHECK (status IN ('dicari', 'ditemukan')),
  ditemukan_di    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_posko_updated_at
  BEFORE UPDATE ON public.posko
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_logistic_requests_updated_at
  BEFORE UPDATE ON public.logistic_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_missing_persons_updated_at
  BEFORE UPDATE ON public.missing_persons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FUNCTION: Auto-generate kode for logistic_requests
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_logistic_kode()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.kode IS NULL THEN
    NEW.kode = '#LOG-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_logistic_kode
  BEFORE INSERT ON public.logistic_requests
  FOR EACH ROW EXECUTE FUNCTION public.generate_logistic_kode();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.posko ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logistic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anon key)
CREATE POLICY "Allow public read posko" ON public.posko FOR SELECT USING (true);
CREATE POLICY "Allow public insert posko" ON public.posko FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posko" ON public.posko FOR UPDATE USING (true);

CREATE POLICY "Allow public read logistic_requests" ON public.logistic_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert logistic_requests" ON public.logistic_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update logistic_requests" ON public.logistic_requests FOR UPDATE USING (true);

CREATE POLICY "Allow public read missing_persons" ON public.missing_persons FOR SELECT USING (true);
CREATE POLICY "Allow public insert missing_persons" ON public.missing_persons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update missing_persons" ON public.missing_persons FOR UPDATE USING (true);

-- ============================================================
-- SEED DATA — Posko
-- ============================================================
INSERT INTO public.posko (nama, jenis, status, kapasitas, terisi, jarak_km, lat, lng, makanan_pct, obat_pct, selimut_pct, relawan_count)
VALUES
  ('Posko Induk Balai Desa Sukamaju', 'umum', 'kritis', 420, 380, 0.8, -6.8124, 107.1352, 45, 30, 80, 12),
  ('Posko Lapangan SDN 01 Margaluyu', 'umum', 'stok_menipis', 280, 210, 1.4, -6.8201, 107.1289, 40, 25, 65, 8),
  ('Posko Medis Darurat Lapangan PMI', 'medis', 'aman', 150, 90, 2.1, -6.8087, 107.1401, 90, 50, 95, 15),
  ('Dapur Umum Sukamaju', 'dapur', 'aman', 500, 320, 1.1, -6.8155, 107.1320, 85, 70, 88, 10),
  ('Posko RW 04 Cibeber', 'umum', 'kritis', 200, 198, 3.2, -6.8234, 107.1198, 20, 15, 45, 6),
  ('Posko Medis Puskesmas Cugenang', 'medis', 'stok_menipis', 100, 75, 4.5, -6.8312, 107.1456, 60, 35, 72, 9)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA — Logistic Requests
-- ============================================================
INSERT INTO public.logistic_requests (kode, pelapor, lokasi_nama, lat, lng, kategori, keterangan, status)
VALUES
  ('#LOG-8812', 'Budi Santoso', 'Posko Lapangan Sukamaju', -6.8124, 107.1352, 'pangan', 'Dibutuhkan mendesak: beras 300kg, telur 50 rak, air mineral galon 100 buah untuk 150 KK.', 'pengiriman'),
  ('#LOG-8740', 'Budi Santoso', 'Posko RW 04 Cibeber', -6.8234, 107.1198, 'medis', 'Paket obat-obatan darurat dan 100 selimut hangat untuk pengungsi lanjut usia.', 'tersalurkan'),
  ('#LOG-8699', 'Siti Rahayu', 'Posko Induk Balai Desa', -6.8124, 107.1352, 'shelter', 'Tenda darurat 20 unit dan terpal 50 lembar untuk perluasan area pengungsian.', 'tersalurkan')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA — Missing Persons
-- ============================================================
INSERT INTO public.missing_persons (nama, usia, terakhir_terlihat, deskripsi, pelapor, status, ditemukan_di)
VALUES
  ('Ibu Aminah', 58, 'Pasar Cijedil', 'Wanita lansia, mengenakan kebaya coklat, rambut putih', 'Budi Santoso', 'ditemukan', 'Posko 06'),
  ('Ahmad Fauzi', 12, 'SD Negeri Cijedil 1', 'Anak laki-laki, seragam merah putih, tas ransel biru', 'Hendra Gunawan', 'dicari', NULL)
ON CONFLICT DO NOTHING;
