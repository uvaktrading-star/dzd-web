
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  History, 
  CreditCard, 
  Settings, 
  Zap, 
  Wallet,
  Menu,
  Activity
} from 'lucide-react';
import DashboardHomeView from './DashboardHomeView';
import ServicesPageView from './ServicesPageView';

const API_KEY = "ddaac158a07c133069b875419234d8e3";
const BASE_URL = "https://makemetrend.online/api/v2";

/**
 * Enhanced API Fetcher using corsproxy.io for better reliability
 * Bypass CORS and handle common SMM API parameters
 */
export const fetchSmmApi = async (params: Record<string, string>) => {
  const urlParams = new URLSearchParams({ ...params, key: API_KEY }).toString();
  const targetUrl = `${BASE_URL}?${urlParams}`;
  
  // Using corsproxy.io - much more stable than allorigins for this specific API
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Connection Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Fetch Execution Failed:", error);
    throw error;
  }
};

export default function DashboardPage({ user }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [balance, setBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    const updateBalance = async () => {
      setLoadingBalance(true);
      try {
        const data = await fetchSmmApi({ action: 'balance' });
        if (data && data.balance) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Balance Protocol Sync Failed");
      } finally {
        setLoadingBalance(false);
      }
    };
    
    updateBalance();
    const interval = setInterval(updateBalance, 45000); // Sync every 45s
    return () => clearInterval(interval);
  }, []);

  if (!user) return <Navigate to="/" />;

  const menuItems = [
    { id: 'home', label: 'Command Hub', icon: <LayoutGrid />, color: 'text-blue-500' },
    { id: 'services', label: 'Protocols', icon: <List />, color: 'text-indigo-500' },
    { id: 'orders', label: 'Mission Logs', icon: <History />, color: 'text-pink-500' },
    { id: 'billing', label: 'Financials', icon: <CreditCard />, color: 'text-amber-500' },
    { id: 'settings', label: 'Terminal', icon: <Settings />, color: 'text-slate-500' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark pt-20 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR - Hidden on Mobile */}
      <aside 
        className={`hidden md:flex relative z-40 bg-white dark:bg-[#050b1a] border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out flex-col ${sidebarOpen ? 'w-80' : 'w-24'}`}
      >
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 top-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-50 border-4 border-slate-50 dark:border-dark"
        >
          {sidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 py-10 px-4 space-y-2">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${activeTab === item.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <div className={`shrink-0 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : item.color}`}>
                {React.cloneElement(item.icon as any, { size: 24, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
              </div>
              {sidebarOpen && (
                <span className="font-black uppercase tracking-[0.15em] text-[10px] whitespace-nowrap opacity-100 transition-opacity">
                  {item.label}
                </span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-2xl">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
           <div className={`bg-blue-600/5 dark:bg-blue-600/10 rounded-[1.5rem] p-5 transition-all overflow-hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
             <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
               <Activity size={10} className={loadingBalance ? 'animate-pulse' : ''} /> Status: Online
             </p>
             <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Credit</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">${balance || '0.00'}</p>
                </div>
                <button className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                  <PlusCircle size={18} />
                </button>
             </div>
           </div>
           {!sidebarOpen && (
              <div className="flex justify-center py-4 text-blue-500">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Zap size={20} fill="currentColor" />
                </div>
              </div>
           )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA - SUPER RESPONSIVE */}
      <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12 relative pb-32 md:pb-12 bg-[#fcfdfe] dark:bg-[#020617]">
        {/* Dynamic Background Design */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {activeTab === 'home' && <DashboardHomeView user={user} balance={balance} />}
          {activeTab === 'services' && <ServicesPageView />}
          
          {/* Placeholder for unimplemented tabs */}
          {(!['home', 'services'].includes(activeTab)) && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in bg-white dark:bg-white/5 rounded-[3.5rem] border border-slate-200 dark:border-white/5 p-12">
              <div className="w-24 h-24 bg-blue-600/10 dark:bg-blue-600/20 rounded-[2.5rem] flex items-center justify-center text-blue-600 mb-8 border border-blue-500/20">
                <Activity size={40} className="animate-pulse" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-3">Protocol: {activeTab}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] max-w-sm leading-relaxed">
                The secure link for this operational node is being established in the global empire matrix.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV - Visible only on small screens */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-white/70 dark:bg-[#050b1a]/70 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-2.5 flex items-center justify-around shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] z-[200]">
        {menuItems.slice(0, 4).map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-4 rounded-[1.8rem] transition-all relative flex flex-col items-center justify-center ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 -translate-y-6 scale-110' : 'text-slate-500'}`}
          >
            {React.cloneElement(item.icon as any, { size: 22, strokeWidth: activeTab === item.id ? 2.5 : 2 })}
            {activeTab === item.id && <div className="absolute -bottom-1.5 w-1.5 h-1.5 bg-white rounded-full"></div>}
          </button>
        ))}
        <button className="p-4 rounded-[1.8rem] text-slate-500 active:bg-slate-100 dark:active:bg-white/5">
           <Menu size={22} />
        </button>
      </nav>
    </div>
  );
}
