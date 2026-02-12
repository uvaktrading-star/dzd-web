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
        alert("Deposit submitted successfully!");
        setAmount(''); setSelectedFile(null); fetchBalance(user.uid);
      }
    } catch (error) { alert("Error occurred!"); }
    finally { setUploading(false); }
  };

  return (
    // මුළු පිටුවටම දෙපැත්තෙන් px-4 (Mobile) සහ px-8+ (Desktop) padding එකතු කළා
    <div className="animate-fade-in space-y-8 pb-32 md:pb-12 px-4 md:px-0">
      
      {/* --- HEADER SECTION --- */}
      {/* Mobile වලදී items-start දාලා overlap වීම වැළැක්වූවා */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="w-1.5 h-7 bg-blue-600 rounded-full hidden md:block"></div>
            FINANCIAL NODE
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-500" /> UID: {user?.uid?.substring(0, 12)}
          </p>
        </div>
        
        {/* Buttons: Mobile වලදී full width, Desktop වලදී auto width */}
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             <History size={14} /> History
           </button>
           <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
             <MessageSquare size={14} /> Support
           </button>
        </div>
      </div>

      {/* --- BALANCE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Available Balance */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 p-6 md:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col justify-between h-full min-h-[120px]">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Available Credits</p>
               <h3 className="text-3xl md:text-4xl font-black tracking-tight tabular-nums">
                 <span className="text-lg opacity-60 mr-1">LKR</span>{userBalance.total_balance}
               </h3>
            </div>
            <div className="mt-4">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] font-black uppercase border border-white/10">Matrix Online</span>
            </div>
          </div>
          <WalletIcon size={100} className="absolute -right-6 -bottom-6 opacity-10 rotate-12" />
        </div>

        {/* Pending Balance */}
        <div className="rounded-[2rem] bg-white dark:bg-[#0f172a]/40 p-6 md:p-8 border border-slate-200 dark:border-white/5 flex flex-col justify-between shadow-sm">
           <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Clearance</p>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                <span className="text-lg opacity-40 mr-1 italic text-slate-400">LKR</span>{userBalance.pending_balance}
              </h3>
           </div>
           <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                 <div className="w-1/3 h-full bg-amber-500 animate-pulse"></div>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-500">Verifying</span>
           </div>
        </div>
      </div>

      {/* --- MAIN INTERFACE GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* BANK DETAILS (Left Column) */}
        <div className="lg:col-span-5 space-y-4 md:space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Authorized Gateways</h3>
           
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-white/5 shadow-sm group">
              <div className="flex justify-between items-center mb-6">
                 <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <Landmark size={20} />
                 </div>
                 <button 
                  onClick={() => copyToClipboard("801012345678")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[9px] font-black uppercase transition-all hover:bg-blue-600 hover:text-white"
                 >
                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
                 </button>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Commercial Bank</p>
              <h4 className="text-md font-black text-slate-900 dark:text-white mb-3 tracking-tight">DZD MARKETING</h4>
              <div className="bg-slate-50 dark:bg-black/20 p-3.5 rounded-xl border border-slate-100 dark:border-white/5">
                 <p className="text-sm font-mono font-black text-blue-600 dark:text-blue-400 tracking-[0.1em]">8010 1234 5678</p>
              </div>
           </div>

           <div className="bg-white dark:bg-[#0f172a]/40 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-white/5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 font-black text-xs italic">ez</div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase">Mobile Pay</p>
                    <p className="text-sm font-mono font-black text-slate-900 dark:text-white">071 234 5678</p>
                 </div>
              </div>
           </div>
        </div>

        {/* UPLOAD FORM (Right Column) */}
        <div className="lg:col-span-7">
           <div className="bg-white dark:bg-[#0f172a]/40 rounded-[2.5rem] p-6 md:p-10 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                 <ArrowUpRight className="text-blue-500" size={20} /> DEPOSIT PROOF
              </h3>

              <form onSubmit={handleUpload} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Amount (LKR)</label>
                    <div className="relative">
                       <input 
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl py-4 px-5 text-lg font-black text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all pl-14"
                          placeholder="0.00"
                          required
                       />
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-black text-[10px] border-r border-slate-200 dark:border-white/10 pr-3">LKR</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Upload Receipt</label>
                    <label className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-black/10 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all p-4 text-center">
                       {selectedFile ? (
                          <div className="text-blue-500 font-black text-[10px] uppercase italic flex items-center gap-2">
                             <CheckCircle2 size={16} /> {selectedFile.name}
                          </div>
                       ) : (
                          <>
                             <Upload size={20} className="text-slate-400 mb-2" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Image</span>
                          </>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} required />
                    </label>
                 </div>

                 <div className="bg-blue-600/5 border border-blue-600/10 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="text-blue-500 shrink-0" size={16} />
                    <p className="text-[9px] font-bold text-slate-500 uppercase leading-normal">
                      Approval takes 15-30 mins. Ensure the receipt is clear and matches the amount.
                    </p>
                 </div>

                 <button 
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-4.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {uploading ? "Processing..." : "Submit Transaction"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
