import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Upload, Landmark, Smartphone, ShieldCheck, 
  AlertCircle, Wallet as WalletIcon, History, MessageSquare, 
  ArrowUpRight, Clock, CheckCircle2, Copy, Check
} from 'lucide-react';

const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";

export default function BillingPageView({ user }: any) {
  const [amount, setAmount] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });

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

  useEffect(() => {
    if (user?.uid) fetchBalance(user.uid);
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return alert("Please select a receipt.");
    setUploading(true);
    const formData = new FormData();
    formData.append("userId", user.uid);
    formData.append("email", user.email || "no-email");
    formData.append("amount", amount);
    formData.append("receipt", selectedFile);

    try {
      const response = await fetch(`${WORKER_URL}/submit-deposit`, { method: "POST", body: formData });
      if (response.ok) {
        alert("Deposit submitted for verification!");
        setAmount(''); setSelectedFile(null); fetchBalance(user.uid);
      }
    } catch (error) { alert("Error occurred!"); }
    finally { setUploading(false); }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      
      {/* --- PREMIUM HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full hidden md:block"></div>
            FINANCIAL TERMINAL
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> Secure Protocol: {user?.uid?.substring(0, 12)}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
             <History size={16} /> History
           </button>
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
             <MessageSquare size={16} /> Support
           </button>
        </div>
      </div>

      {/* --- BALANCE GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Balance Card */}
        <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-2xl shadow-blue-600/30">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Available Credits</p>
               <h3 className="text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-2">
                 <span className="text-xl opacity-60">LKR</span> {userBalance.total_balance}
               </h3>
            </div>
            <div className="mt-8 flex items-center justify-between">
               <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
                 System Status: Optimal
               </div>
               <WalletIcon size={32} className="opacity-40" />
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        </div>

        {/* Pending Balance Card */}
        <div className="rounded-[2.5rem] bg-white dark:bg-[#0f172a]/40 p-8 border border-slate-200 dark:border-white/5 flex flex-col justify-between group">
           <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Clearance</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums italic">
                LKR {userBalance.pending_balance}
              </h3>
           </div>
           <div className="mt-8 flex items-center gap-3">
              <div className="flex h-2 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                 <div className="w-1/3 bg-amber-500 animate-pulse"></div>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">Verifying...</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- BANK DETAILS (Desktop: 5 cols) --- */}
        <div className="lg:col-span-5 space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Payment Gateways</h3>
           
           {/* Commercial Bank */}
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 relative group transition-all hover:border-blue-500/30">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <Landmark size={24} />
                 </div>
                 <button 
                  onClick={() => copyToClipboard("801012345678")}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-blue-500"
                 >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                 </button>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Commercial Bank (Main)</p>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">DZD MARKETING</h4>
              <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                 <p className="text-xs font-mono font-black text-blue-500 tracking-widest">8010 1234 5678</p>
              </div>
           </div>

           {/* Mobile Pay */}
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 transition-all hover:border-orange-500/30">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 italic font-black text-xs">ez</div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Mobile Wallets</span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-widest font-mono">071 234 5678</p>
           </div>
        </div>

        {/* --- UPLOAD SECTION (Desktop: 7 cols) --- */}
        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[3rem] p-8 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
              
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8 flex items-center gap-3">
                 <ArrowUpRight className="text-blue-500" /> DEPOSIT INTERFACE
              </h3>

              <form onSubmit={handleUpload} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest italic">Transaction Amount</label>
                    <div className="relative">
                       <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl py-5 px-6 text-xl font-black text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all pl-16"
                          placeholder="0.00"
                          required
                       />
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-xs uppercase tracking-widest border-r border-slate-200 dark:border-white/10 pr-3">LKR</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest italic">Proof of Transaction</label>
                    <label className="flex flex-col items-center justify-center w-full aspect-[4/2] md:aspect-[5/2] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50 dark:bg-black/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all group overflow-hidden">
                       {selectedFile ? (
                          <div className="flex items-center gap-3 text-blue-500 font-black text-xs uppercase italic tracking-widest animate-in zoom-in-95">
                             <CheckCircle2 size={20} /> {selectedFile.name.substring(0, 20)}...
                          </div>
                       ) : (
                          <div className="flex flex-col items-center">
                             <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mb-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                                <Upload size={24} />
                             </div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload receipt</span>
                          </div>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} required />
                    </label>
                 </div>

                 <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wide">
                      Verification takes 15-30 mins. Uploading false documents will result in a permanent ban.
                    </p>
                 </div>

                 <button 
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Execute Deposit Protocol"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
