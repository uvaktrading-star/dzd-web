import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Upload, Landmark, Smartphone, ShieldCheck, 
  AlertCircle, Wallet as WalletIcon, History, MessageSquare, 
  ArrowUpRight, Clock, CheckCircle2 
} from 'lucide-react';

// ඔයාගේ Cloudflare Worker URL එක මෙතනට දාන්න
const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";

export default function BillingPageView({ user }: any) {
  const [amount, setAmount] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });

  // 1. Cloudflare D1 එකෙන් ඇත්තම බැලන්ස් එක ගන්නා ආකාරය
  const fetchBalance = async (uid: string) => {
    try {
      const response = await fetch(`${WORKER_URL}/get-balance?userId=${uid}`);
      const data = await response.json();
      setUserBalance({
        total_balance: parseFloat(data.total_balance || 0).toFixed(2),
        pending_balance: parseFloat(data.pending_balance || 0).toFixed(2)
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchBalance(user.uid);
      // සෑම විනාඩි 5කට වරක් බැලන්ස් එක Refresh කරන්න (Optional)
      const interval = setInterval(() => fetchBalance(user.uid), 300000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // 2. රිසිට් එක Cloudflare Worker (R2 + D1) වෙත යවන ආකාරය
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) {
      alert("කරුණාකර රිසිට් පත තෝරන්න.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("userId", user.uid);
    formData.append("email", user.email || "no-email");
    formData.append("amount", amount);
    formData.append("receipt", selectedFile);

    try {
      const response = await fetch(`${WORKER_URL}/submit-deposit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert(`ID: ${user.uid} සඳහා තැන්පතු ඉල්ලීම සාර්ථකව යොමු කළා!`);
        setAmount('');
        setSelectedFile(null);
        // බැලන්ස් එක වහාම Refresh කරන්න
        fetchBalance(user.uid);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("යම් දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">
            Financial <span className="text-blue-600 tracking-normal text-3xl lg:text-4xl not-italic">Node</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" /> Authorized UID: {user?.uid?.substring(0, 8)}...
          </p>
        </div>
        
        <button className="flex items-center gap-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group">
          <MessageSquare size={18} className="text-blue-500 group-hover:text-white" />
          <span className="text-[11px] font-black uppercase tracking-widest">Customer Support</span>
        </button>
      </div>

      {/* --- BALANCE CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80 italic">Available Credits</p>
            <h3 className="text-5xl font-black italic tracking-tighter tabular-nums">LKR {userBalance.total_balance}</h3>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase bg-white/10 w-fit px-3 py-1 rounded-full">
              <CheckCircle2 size={12} /> Active Wallet
            </div>
          </div>
          <WalletIcon size={120} className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div className="bg-white dark:bg-[#050b1a] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-500 italic">Pending Clearance</p>
          <h3 className="text-5xl font-black italic tracking-tighter tabular-nums text-slate-900 dark:text-white">LKR {userBalance.pending_balance}</h3>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase text-amber-500 bg-amber-500/10 w-fit px-3 py-1 rounded-full">
            <Clock size={12} /> Verifying Proofs
          </div>
        </div>

        <div className="hidden lg:flex bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-8 items-center justify-center border border-white/5 relative overflow-hidden">
             <div className="text-center">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Matrix Level</p>
                <p className="text-2xl font-black text-white uppercase italic tracking-widest italic">Standard User</p>
             </div>
             <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- PAYMENT METHODS --- */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Authorized Gateways</h3>
          
          <div className="bg-white dark:bg-[#050b1a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all cursor-default group">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Landmark size={20} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Bank Transfer</span>
            </div>
            <div className="space-y-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <p>Bank: <span className="text-slate-900 dark:text-white">Commercial Bank</span></p>
              <p>Acc: <span className="text-slate-900 dark:text-white font-mono">8010 1234 5678</span></p>
              <p>Name: <span className="text-slate-900 dark:text-white italic">DZD MARKETING</span></p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#050b1a] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 hover:border-orange-500/50 transition-all cursor-default">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                  <Smartphone size={20} />
               </div>
               <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">EzCash / mCash</span>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <p>Phone: <span className="text-slate-900 dark:text-white font-mono tracking-widest">071 234 5678</span></p>
            </div>
          </div>
        </div>

        {/* --- UPLOAD FORM --- */}
        <div className="lg:col-span-2 bg-white dark:bg-[#050b1a] border border-slate-200 dark:border-white/5 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-black/20">
          <div className="relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <ArrowUpRight className="text-blue-500" /> Initialize Deposit Request
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Amount (LKR)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Minimum 100.00"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-lg font-black focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 italic">Receipt Image</label>
                  <label className="flex items-center gap-4 w-full bg-slate-50 dark:bg-white/5 p-4 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10">
                    <Upload className="text-blue-500" size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 truncate">
                      {selectedFile ? selectedFile.name : 'Select File'}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      required 
                    />
                  </label>
                </div>
              </div>

              <div className="p-6 bg-blue-600/5 rounded-[2rem] border border-blue-600/10 flex items-start gap-4 italic">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                  රිසිට් පත අප්ලෝඩ් කළ පසු අපගේ පද්ධතිය මගින් එය තහවුරු කිරීමට විනාඩි 15-30ක් අතර කාලයක් ගතවේ. කරුණාකර නිවැරදි රිසිට් පතක් පමණක් යොමු කරන්න.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-xs"
              >
                {uploading ? 'Processing Transaction...' : 'Execute Transaction Proof'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FOOTER SECTION --- */}
      <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/5 text-center">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">
           DZD Financial Node v4.0.2 • Verified by Firebase Auth & Cloudflare D1
         </p>
      </div>

    </div>
  );
}
