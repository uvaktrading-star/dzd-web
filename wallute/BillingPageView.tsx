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
  
  // --- NEW STATES FOR NOTIFICATION PANEL ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({
    show: false, msg: '', type: 'success'
  });

  const showNotification = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
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

  const clearOne = (id: any) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

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
        showNotification("Deposit submitted for verification successfully!", "success");
        setAmount(''); setSelectedFile(null); 
        fetchBalance(user.uid);
        fetchHistory(user.uid);
      } else {
        showNotification("Submission failed. Please try again.", "error");
      }
    } catch (error) { 
      showNotification("A network error occurred!", "error");
    } finally { 
      setUploading(false); 
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16 px-4 md:px-0 relative">
      
      {/* --- TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top duration-300 w-[90%] max-w-md ${
          toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest">{toast.type === 'success' ? 'Success' : 'Transaction Alert'}</p>
            <p className="text-[11px] font-bold opacity-90">{toast.msg}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="p-1 hover:bg-black/10 rounded-lg transition-all">
            <X size={18} />
          </button>
        </div>
      )}

      {/* --- NOTIFICATION DROPDOWN --- */}
      {showNotifications && (
        <div className="fixed inset-0 z-[120] flex items-start justify-end p-4 pointer-events-none">
            <div className="mt-20 w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-2xl pointer-events-auto overflow-hidden animate-in slide-in-from-right-4 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                    <h4 className="text-[11px] font-black uppercase tracking-widest dark:text-white">Alert_Center</h4>
                    <button onClick={clearAll} className="text-[9px] font-black uppercase text-red-500 hover:opacity-70 flex items-center gap-1">
                        <Trash2 size={12}/> Clear All
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">No New Alerts</div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 relative group">
                                <button onClick={() => clearOne(n.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={14} className="text-slate-400" />
                                </button>
                                <div className="flex gap-3">
                                    {n.status === 'approved' ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <AlertCircle size={16} className="text-red-500 shrink-0" />}
                                    <div>
                                        <p className="text-[10px] font-black dark:text-white uppercase tracking-tight">Deposit {n.status}</p>
                                        <p className="text-[11px] font-bold text-slate-500 mt-1">LKR {parseFloat(n.amount).toFixed(2)} - {n.status === 'rejected' ? (n.reason || 'Verification Failed') : 'Credits Added'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button onClick={() => setShowNotifications(false)} className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Close</button>
            </div>
        </div>
      )}

      {/* --- HISTORY MODAL --- */}
      {showHistory && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-3 font-mono">
                <History className="text-blue-500" /> TRANSACTION_LOG
              </h3>
              <button onClick={() => setShowHistory(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl hover:scale-110 transition-transform">
                <X size={20} className="dark:text-white" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {history.length === 0 ? (
                <div className="py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">No records found</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                        item.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {item.status === 'approved' ? <CheckCircle2 size={20} /> : item.status === 'rejected' ? <X size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white italic tracking-tight">LKR {parseFloat(item.amount).toFixed(2)}</p>
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{item.status === 'rejected' ? (item.reason || 'Verification Failed') : item.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-400">ID: #{item.id.toString().slice(-5)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RE-DESIGNED HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 font-mono">
            <div className="w-2 h-8 bg-blue-600 rounded-full hidden md:block"></div>
            FINANCIAL_TERMINAL
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Secure Protocol: {user?.uid?.substring(0, 12)}
          </p>
        </div>
        
        {/* Button Container - Ensures visibility on all devices */}
        <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <button 
              onClick={() => setShowHistory(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 md:px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 whitespace-nowrap min-w-fit"
            >
              <History size={16} /> <span className="inline">History</span>
            </button>

            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all whitespace-nowrap min-w-fit">
              <MessageSquare size={16} /> <span className="inline">Support</span>
            </button>
            
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-3.5 rounded-2xl transition-all border shrink-0 min-w-[48px] flex items-center justify-center ${
                showNotifications ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent hover:border-blue-500/20'
              }`}
            >
               <Bell size={20} />
               {notifications.length > 0 && (
                 <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-pulse"></span>
               )}
            </button>
        </div>
      </div>

      {/* --- BALANCE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-2xl shadow-blue-600/30">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Available Credits</p>
            <h3 className="text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-2">
              <span className="text-xl opacity-60">LKR</span> {userBalance.total_balance}
            </h3>
            <div className="mt-8">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">System Status: Optimal</span>
            </div>
          </div>
          <WalletIcon size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-[#0f172a]/40 p-8 border border-slate-200 dark:border-white/5 flex flex-col justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Clearance</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                LKR {userBalance.pending_balance}
              </h3>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-2 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full bg-amber-500 transition-all duration-1000 ${parseFloat(userBalance.pending_balance) > 0 ? 'w-1/3 animate-pulse' : 'w-0'}`}></div>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">
                {parseFloat(userBalance.pending_balance) > 0 ? 'Verifying' : 'Clear'}
              </span>
            </div>
        </div>
      </div>

      {/* --- GATEWAYS AND FORM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2 font-mono">AUTHORIZED_GATEWAYS</h3>
           
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 relative">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <Landmark size={24} />
                 </div>
                 <button onClick={() => copyToClipboard("801012345678")} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400" />}
                 </button>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">BOC Bank</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">DZD MARKETING</h4>
              <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                 <p className="text-xs font-mono font-black text-blue-500 tracking-widest">71782008</p>
              </div>
           </div>

           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 font-black italic text-xs">ez</div>
              <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Wallet</p>
                 <p className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">0766247995</p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[3rem] p-6 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-3 font-mono uppercase">
                 <ArrowUpRight className="text-blue-500" /> Deposit_Interface
              </h3>

              <form onSubmit={handleUpload} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Amount (LKR)</label>
                    <div className="relative">
                       <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl py-5 px-6 text-xl font-black text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all pl-16"
                          placeholder="0.00"
                          required
                       />
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-xs border-r border-slate-200 dark:border-white/10 pr-3 font-mono">LKR</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest font-mono">Upload_Receipt</label>
                    <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50 dark:bg-black/10 cursor-pointer hover:bg-slate-100 transition-all p-4 text-center">
                       {selectedFile ? (
                          <div className="text-blue-500 font-black text-xs uppercase italic flex items-center gap-2">
                             <CheckCircle2 size={20} /> {selectedFile.name.substring(0, 25)}
                          </div>
                       ) : (
                          <>
                             <Upload size={24} className="text-slate-400 mb-2" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image File</span>
                          </>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} required />
                    </label>
                 </div>

                 <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">
                      Verification takes 15-30 mins. False uploads lead to account termination.
                    </p>
                 </div>

                 <button 
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.5em] shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center min-h-[70px]"
                 >
                    {uploading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-mono">UPLOADING...</span>
                      </div>
                    ) : (
                      "SUBMIT_DEPOSIT"
                    )}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
