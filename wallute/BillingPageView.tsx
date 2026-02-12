import React, { useState, useEffect } from 'react';
import { 
  Upload, Landmark, ShieldCheck, AlertCircle, Wallet as WalletIcon, 
  History, MessageSquare, ArrowUpRight, CheckCircle2, Copy, Check, Bell, X 
} from 'lucide-react';

const WORKER_URL = "https://dzd-billing-api.sitewasd2026.workers.dev";

export default function BillingPageView({ user }: any) {
  const [amount, setAmount] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [userBalance, setUserBalance] = useState({ total_balance: "0.00", pending_balance: "0.00" });
  
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
    } catch (error) { console.error("Balance fetch error:", error); }
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
    if (!selectedFile || !user) return showNotification("Please select a receipt.", "error");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("userId", user.uid);
    formData.append("email", user.email || "no-email");
    // Firestore එකෙන් එන username එක මෙතනට වැටෙනවා
    formData.append("username", user.username || "Anonymous"); 
    formData.append("amount", amount);
    formData.append("receipt", selectedFile);

    try {
      const response = await fetch(`${WORKER_URL}/submit-deposit`, { method: "POST", body: formData });
      if (response.ok) {
        showNotification("Deposit submitted successfully!", "success");
        setAmount(''); setSelectedFile(null); fetchBalance(user.uid);
      } else {
        showNotification("Internal Server Error. Please check Worker logs.", "error");
      }
    } catch (error) { 
      showNotification("Network error. Connection failed.", "error");
    } finally { 
      setUploading(false); 
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16 px-4 md:px-0 relative">
      {/* Notifications */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top ${
          toast.type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="text-xs font-black uppercase tracking-widest">{toast.msg}</p>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-4 opacity-70 hover:opacity-100"><X size={18} /></button>
        </div>
      )}

      {/* Header & Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Available Credits</p>
          <h3 className="text-5xl font-black tracking-tighter">LKR {userBalance.total_balance}</h3>
          <WalletIcon size={100} className="absolute -right-4 -bottom-4 opacity-10" />
        </div>
        <div className="rounded-[2.5rem] bg-white dark:bg-white/5 p-8 border border-slate-200 dark:border-white/10">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Clearance</p>
          <h3 className="text-4xl font-black dark:text-white">LKR {userBalance.pending_balance}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bank Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-slate-200 dark:border-white/10">
            <div className="flex justify-between mb-4">
              <Landmark className="text-blue-500" />
              <button onClick={() => copyToClipboard("801012345678")}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            </div>
            <p className="text-[10px] font-black text-slate-500">COMMERCIAL BANK</p>
            <h4 className="font-black dark:text-white">DZD MARKETING</h4>
            <p className="text-blue-500 font-mono font-bold tracking-widest mt-2">8010 1234 5678</p>
          </div>
        </div>

        {/* Form Interface */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/10">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
              <ArrowUpRight className="text-blue-500" /> DEPOSIT INTERFACE
            </h3>
            <form onSubmit={handleUpload} className="space-y-6">
              <input 
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" required
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl py-5 px-6 text-xl font-black outline-none focus:border-blue-500 dark:text-white"
              />
              <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-slate-50 dark:bg-black/10 cursor-pointer">
                {selectedFile ? <span className="text-blue-500 font-bold">{selectedFile.name}</span> : <Upload className="text-slate-400" />}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files![0])} required />
              </label>
              <button disabled={uploading} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all">
                {uploading ? "VERIFYING..." : "SUBMIT TRANSACTION"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
