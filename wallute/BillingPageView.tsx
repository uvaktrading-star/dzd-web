import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Upload, Landmark, Smartphone, ShieldCheck, 
  AlertCircle, Wallet as WalletIcon, History, MessageSquare, 
  ArrowUpRight, Clock, CheckCircle2, Copy, Check, Bell, X, Trash2
} from 'lucide-react';

const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";

export default function BillingPageView({ user }: any) {
  const [amount, setAmount] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({
    show: false, msg: '', type: 'success'
  });

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchBalance = async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance({
        total_balance: parseFloat(data.total_balance || 0).toFixed(2),
        pending_balance: parseFloat(data.pending_balance || 0).toFixed(2)
      });
    } catch (error) { console.error(error); }
  };

  const fetchHistory = async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-history?userId=${uid}`);
      const data = await response.json();
      setHistory(data);
      const alerts = data.filter((item: any) => item.status === 'approved' || item.status === 'rejected');
      setNotifications(alerts);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchBalance(user.uid);
      fetchHistory(user.uid);
    }
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearOne = (id: any) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAll = () => { setNotifications([]); setShowNotifications(false); };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return showNotification("Please select a receipt.", "error");
    setUploading(true);
    const formData = new FormData();
    formData.append("userId", user.uid);
    formData.append("email", user.email || "no-email");
    formData.append("username", user.username || user.displayName || "Unknown"); 
    formData.append("amount", amount);
    formData.append("receipt", selectedFile);

    try {
      const response = await fetch(`${WORKER_URL}/submit-deposit`, { method: "POST", body: formData });
      if (response.ok) {
        showNotification("Deposit submitted successfully!", "success");
        setAmount(''); setSelectedFile(null); 
        fetchBalance(user.uid);
        fetchHistory(user.uid);
      } else {
        showNotification("Submission failed.", "error");
      }
    } catch (error) { 
      showNotification("Network error occurred!", "error");
    } finally { setUploading(false); }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* --- TOAST --- */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-top duration-300 w-[90%] max-w-md ${
          toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-tight">System Alert</p>
            <p className="text-[11px] font-bold opacity-90 leading-tight">{toast.msg}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="p-1 hover:bg-black/10 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      {/* --- HISTORY MODAL (අලුතින් එකතු කරා) --- */}
      {showHistory && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h4 className="text-sm font-black uppercase tracking-widest dark:text-white flex items-center gap-2">
                <History size={18} className="text-blue-500" /> TRANSACTION_HISTORY
              </h4>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">No Records Found</div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {item.status === 'approved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-black dark:text-white uppercase tracking-tighter">LKR {parseFloat(item.amount).toFixed(2)}</p>
                        <p className="text-[9px] font-bold text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${item.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS MODAL --- */}
      {showNotifications && (
        <div className="fixed inset-0 z-[150] flex items-start justify-end p-4 bg-black/20 backdrop-blur-[2px]">
            <div className="mt-16 w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-right-4">
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest dark:text-white">Alerts</h4>
                    <button onClick={clearAll} className="text-[9px] font-black uppercase text-red-500 flex items-center gap-1">
                        <Trash2 size={12}/> Clear
                    </button>
                </div>
                <div className="max-h-[350px] overflow-y-auto p-3 space-y-2">
                    {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest">No New Alerts</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 relative group">
                                <div className="flex gap-3">
                                    {n.status === 'approved' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-red-500" />}
                                    <div>
                                        <p className="text-[9px] font-black dark:text-white uppercase">Deposit {n.status}</p>
                                        <p className="text-[10px] font-bold text-slate-500">LKR {parseFloat(n.amount).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button onClick={() => setShowNotifications(false)} className="w-full p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-white/5">Close</button>
            </div>
        </div>
      )}

      {/* --- HEADER (FIXED DESKTOP VIEW) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-b border-white/5 pb-8">
        <div className="space-y-1 w-full md:w-auto text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center justify-center md:justify-start gap-3 font-mono">
            <div className="w-2 h-8 bg-blue-600 rounded-full hidden md:block"></div>
            FINANCIAL_CORE
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Protocol: {user?.uid?.substring(0, 12)}
          </p>
        </div>
        
        {/* Buttons Container - Desktop එකේදී පැහැදිලිව පේනවා */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 whitespace-nowrap"
            >
              <History size={16} /> History
            </button>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap">
              <MessageSquare size={16} /> Support
            </button>
            
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-3 rounded-2xl transition-all border shrink-0 ${
                showNotifications ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent hover:border-blue-500/20'
              }`}
            >
               <Bell size={20} />
               {notifications.length > 0 && (
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-pulse"></span>
               )}
            </button>
        </div>
      </div>

      {/* --- BALANCE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white shadow-2xl shadow-blue-600/30">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Available Credits</p>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-3">
              <span className="text-xl opacity-60 font-mono">LKR</span> {userBalance.total_balance}
            </h3>
          </div>
          <WalletIcon size={140} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-[#0f172a]/40 p-8 border border-slate-200 dark:border-white/5 shadow-inner">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">In Verification</p>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums font-mono">
              LKR {userBalance.pending_balance}
            </h3>
            <div className="mt-6 flex items-center gap-3">
               <div className="h-2 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-amber-500 transition-all duration-1000 ${parseFloat(userBalance.pending_balance) > 0 ? 'w-1/3 animate-pulse' : 'w-0'}`}></div>
               </div>
               <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Processing</span>
            </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gateways */}
        <div className="lg:col-span-5 space-y-5">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 font-mono">AUTHORIZED_GATEWAYS</h3>
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm group hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <Landmark size={24} />
                 </div>
                 <button onClick={() => copyToClipboard("71782008")} className="p-2 hover:bg-blue-500/10 rounded-xl transition-colors">
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-slate-400" />}
                 </button>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">BOC Bank (DZD MARKETING)</p>
              <h4 className="text-2xl font-mono font-black text-blue-500 tracking-widest">71782008</h4>
           </div>

           <div className="bg-white dark:bg-[#0f172a]/40 rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-center gap-5">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 font-black italic text-xs">ez</div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Wallet</p>
                 <p className="text-lg font-mono font-black text-slate-900 dark:text-white">0766247995</p>
              </div>
           </div>
        </div>

        {/* Deposit Interface */}
        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-3 font-mono uppercase">
                 <ArrowUpRight size={22} className="text-blue-500" /> DEPOSIT_NODE
              </h3>

              <form onSubmit={handleUpload} className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">Amount (LKR)</label>
                    <div className="relative">
                       <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl py-5 px-6 text-xl font-black text-slate-900 dark:text-white focus:ring-4 ring-blue-500/10 outline-none pl-16 transition-all"
                          placeholder="0.00"
                          required
                       />
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-xs border-r border-white/10 pr-4">LKR</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em] font-mono">Upload_Slip</label>
                    <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50 dark:bg-black/10 cursor-pointer hover:bg-blue-500/5 hover:border-blue-500/30 transition-all p-6 text-center group">
                       {selectedFile ? (
                          <div className="text-blue-500 font-black text-xs uppercase flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full">
                             <CheckCircle2 size={18} /> {selectedFile.name.substring(0, 25)}...
                          </div>
                       ) : (
                          <>
                             <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Upload size={24} className="text-slate-400" />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Transaction Receipt</span>
                          </>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} required />
                    </label>
                 </div>

                 <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">
                      Verification takes 15-30 mins. Providing fake or doctored receipts will result in permanent account termination.
                    </p>
                 </div>

                 <button 
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center min-h-[64px]"
                 >
                    {uploading ? "SYNCING_WITH_NETWORK..." : "EXECUTE_DEPOSIT_NODE"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
