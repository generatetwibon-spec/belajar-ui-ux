'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { TabId, ToastMessage, Posko, LogisticRequest, AppStats } from '@/lib/types';
import { MOCK_POSKO, MOCK_REQUESTS } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AppContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  poskoList: Posko[];
  setPoskoList: React.Dispatch<React.SetStateAction<Posko[]>>;
  requests: LogisticRequest[];
  addRequest: (req: LogisticRequest) => void;
  stats: AppStats;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  const [poskoList, setPoskoList] = useState<Posko[]>(MOCK_POSKO);
  const [requests, setRequests] = useState<LogisticRequest[]>(MOCK_REQUESTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Compute stats from poskoList
  const stats: AppStats = React.useMemo(() => {
    const totalRelawan = poskoList.reduce((s, p) => s + p.relawan_count, 0);
    const avgStok = poskoList.length > 0
      ? Math.round(
          poskoList.reduce(
            (s, p) => s + (p.makanan_pct + p.obat_pct + p.selimut_pct) / 3,
            0
          ) / poskoList.length
        )
      : 0;
    return {
      totalPoskoAktif: poskoList.length,
      persenStokLogistik: avgStok,
      totalRelawan,
    };
  }, [poskoList]);

  // Load from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchData = async () => {
      setIsLoading(true);
      const [poskoRes, reqRes] = await Promise.all([
        supabase.from('posko').select('*').order('jarak_km'),
        supabase.from('logistic_requests').select('*').order('created_at', { ascending: false }),
      ]);
      if (poskoRes.data) setPoskoList(poskoRes.data as Posko[]);
      if (reqRes.data) setRequests(reqRes.data as LogisticRequest[]);
      setIsLoading(false);
    };

    fetchData();

    // Realtime subscription for posko changes
    const channel = supabase
      .channel('posko-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posko' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPoskoList((prev) => [...prev, payload.new as Posko]);
          } else if (payload.eventType === 'UPDATE') {
            setPoskoList((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Posko) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setPoskoList((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Realtime subscription for new logistic requests
    const reqChannel = supabase
      .channel('request-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'logistic_requests' },
        (payload) => {
          setRequests((prev) => [payload.new as LogisticRequest, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(reqChannel);
    };
  }, []);

  const addRequest = useCallback((req: LogisticRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        poskoList,
        setPoskoList,
        requests,
        addRequest,
        stats,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
