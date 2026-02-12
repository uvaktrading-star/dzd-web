import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  LayoutGrid, 
  Award, 
  ShieldCheck, 
  Globe, 
  Rocket, 
  Database, 
  Layers, 
  Users, 
  RefreshCw, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Navigation සඳහා එක් කළා
import Footer from './Footer';

const RevealSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${isActive ? 'active' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default function LandingPage({ onSignupClick }: { onSignupClick?: () => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const navigate = useNavigate(); // Navigation function එක create කිරීම

  const platforms = {
    all: { 
      title: "Omnichannel Market Domination", 
      desc: "Our high-frequency API connects you to the world's most stable social growth networks. Scale your presence across the entire digital ecosystem from a single dashboard.", 
      points: ["Full API Documentation", "Reseller Child Panels", "Multi-Currency Deposits"] 
    },
    tiktok: { 
      title: "Viral Velocity Protocol", 
      desc: "Hit the For You Page with precision. Our TikTok services are tuned for high-retention and organic algorithm triggers.", 
      points: ["Instant Video Shares", "Live Stream Engagement", "Retention-Optimized Views"] 
    },
    instagram: { 
      title: "Premium Influence Scaling", 
      desc: "Establish your brand's authority with high-quality profiles. Perfect for influencers and agencies requiring real-look social proof.", 
      points: ["Reels Viral Boosts", "Targeted Country Growth", "Automated Story Views"] 
    },
    facebook: { 
      title: "Business Authority Engine", 
      desc: "Build the trust needed to convert. Our Facebook services focus on permanent page growth and high-conversion group engagement.", 
      points: ["Non-Drop Page Likes", "Post Engagement Packs", "Verified-look Reviews"] 
    }
  };

  const current = platforms[selectedPlatform as keyof typeof platforms];

  return (
    <div className="bg-slate-50 dark:bg-[#020617] min-h-screen selection:bg-blue-600/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-48 overflow-hidden">
        <div className="mesh-bg opacity-40">
          <div className="blob -top-20 -left-20 animate-pulse-slow bg-blue-600/20"></div>
          <div className="blob top-1/2 -right-20 animate-float bg-indigo-600/10" style={{ animationDelay: '2s' }}></div>
          <div className="blob -bottom-40 left-1/4 animate-pulse-slow bg-cyan-600/10" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="text-left">
              <RevealSection>
                <div className="inline-flex items-center gap-2 bg-blue-600/5 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/30 px-5 py-2 rounded-2xl mb-8 group cursor-default">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                  <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Reseller Ready API v4.2</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.95] mb-8 tracking-tighter">
                  The World's <br />
                  <span className="text-gradient">Fastest</span> Panel.
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-lg mb-12 font-medium leading-relaxed">
                  Bulk social media services for agencies and resellers. Instant delivery, 99.9% success rate, and 24/7 dedicated support protocol.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button 
                    onClick={() => navigate('/billing')} // මෙතනින් Wallet පේජ් එකට යනවා
                    className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95"
                  >
                    Launch Empire <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-white dark:hover:bg-slate-800 transition-all">
                    View Pricing
                  </button>
                </div>
              </RevealSection>
            </div>

            <div className="relative">
              <RevealSection className="lg:pl-10">
                <div className="relative group">
                  <div className="glass p-3 rounded-[3.5rem] shadow-[0_50px_100px_-15px_rgba(0,0,0,0.6)] animate-float border-white/10 relative overflow-hidden group-hover:rotate-1 transition-transform duration-700">
                    <div className="bg-[#050b1a] rounded-[3rem] overflow-hidden aspect-[4/3] relative border border-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.2),transparent)] z-10 pointer-events-none"></div>
                      
                      <img 
                        src="https://res.cloudinary.com/dbn1nlna6/image/upload/v1770881139/hero-img_mmnvnn.jpg" 
                        alt="SMM Dashboard Interface"
                        className="w-full h-full object-cover opacity-90 transition-transform duration-[20s] group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 z-20 pointer-events-none">
                         <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-blue-500/20 rounded-full animate-pulse"></div>
                         <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-indigo-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -left-6 bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-3xl border border-blue-600/20 animate-float flex items-center gap-5 z-30" style={{ animationDelay: '0.5s' }}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40">
                       <TrendingUp size={24} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Growth Index</p>
                       <p className="text-sm font-black text-slate-900 dark:text-white">+420% Volume Surge</p>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 bg-white dark:bg-[#0f172a] p-5 rounded-[2.2rem] shadow-3xl border border-white/10 animate-float flex items-center gap-4 z-30" style={{ animationDelay: '1.5s' }}>
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                       <CheckCircle2 size={20} />
                    </div>
                    <div className="text-left">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success Node</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white">API Request Authenticated</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <RevealSection className="py-10 border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between gap-8 items-center">
            {[
              { label: "Orders Processed", value: "8.4M+", icon: <Layers /> },
              { label: "Global Resellers", value: "12K+", icon: <Users /> },
              { label: "Delivery Speed", value: "Instant", icon: <Clock /> },
              { label: "Server Uptime", value: "99.98%", icon: <Database /> },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">
                  {React.cloneElement(s.icon as React.ReactElement<any>, { size: 18 })}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{s.value}</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* Strategic Selection Section */}
      <section className="py-24 lg:py-40 relative overflow-hidden bg-white dark:bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
             <RevealSection>
               <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Service Command Center</p>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">Scale Every Channel <br />From One Node.</h2>
             </RevealSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <RevealSection>
                <div className="bg-[#050b1a] p-10 rounded-[3.5rem] border border-white/5 shadow-3xl">
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight leading-tight">{current.title}</h3>
                  <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">{current.desc}</p>
                  <div className="space-y-4 mb-10">
                    {current.points.map((text, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-slate-300 font-bold text-sm tracking-wide">{text}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/billing')} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    Start Protocol <Rocket size={20} />
                  </button>
                </div>
              </RevealSection>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <RevealSection className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { id: 'tiktok', icon: <Smartphone />, name: 'TikTok', count: '142 Services' },
                  { id: 'instagram', icon: <Smartphone />, name: 'Instagram', count: '208 Services' },
                  { id: 'facebook', icon: <Smartphone />, name: 'Facebook', count: '94 Services' },
                  { id: 'all', icon: <LayoutGrid />, name: 'All Networks', count: '1,500+ Total' }
                ].map((p) => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelectedPlatform(p.id)} 
                    className={`p-10 rounded-[3rem] flex flex-col items-center justify-center text-center transition-all border-2 relative overflow-hidden group ${selectedPlatform === p.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-3xl shadow-blue-600/30 -translate-y-2' 
                      : 'bg-white dark:bg-[#050b1a] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:border-blue-600/30'}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${selectedPlatform === p.id ? 'bg-white/20' : 'bg-blue-500/10 text-blue-500'}`}>
                      {React.cloneElement(p.icon as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <span className="font-black text-xl mb-1 tracking-tight">{p.name}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPlatform === p.id ? 'text-white/60' : 'text-slate-500'}`}>{p.count}</span>
                  </button>
                ))}
              </RevealSection>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 lg:py-40 bg-slate-50 dark:bg-[#050b1a] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
             <RevealSection>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Your Roadmap to <br /><span className="text-blue-500">Global Visibility</span></h2>
               <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em]">Zero Friction Onboarding</p>
             </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Join Node", desc: "Create your secure account in seconds. Identity verification is instant and encrypted.", icon: <Users />, action: onSignupClick },
              { step: "02", title: "Fund Credit", desc: "Add balance via global gateways. Support for CC, Crypto, and local transfer protocols.", icon: <CreditCard />, action: () => navigate('/billing') },
              { step: "03", title: "Execute Order", desc: "Select service, input link, and watch as our delivery protocols trigger instantly.", icon: <Zap />, action: () => navigate('/') }
            ].map((s, i) => (
              <RevealSection key={i} className="relative p-12 bg-white dark:bg-[#020617] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm group hover:border-blue-500 transition-colors cursor-pointer" 
                 onClick={s.action}>
                <div className="absolute top-8 right-10 text-5xl font-black text-slate-100 dark:text-white/5 group-hover:text-blue-500/10 transition-colors">{s.step}</div>
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-transform">
                   {React.cloneElement(s.icon as React.ReactElement<any>, { size: 28 })}
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{s.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-24 lg:py-40 bg-white dark:bg-[#020617] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 lg:auto-rows-[160px]">
            {/* Main Feature */}
            <RevealSection className="md:col-span-6 lg:col-span-8 lg:row-span-3 bg-blue-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden group">
               <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">Algorithm-Synced <br />Growth Intelligence</h3>
                  <p className="text-white/80 text-xl font-medium max-w-lg mb-8">We don't just provide numbers. We provide algorithm-compliant growth that survives platform updates and manual reviews.</p>
                  <button onClick={() => navigate('/billing')} className="self-start bg-white text-blue-600 px-10 py-5 rounded-[1.5rem] font-black hover:scale-105 transition-all shadow-2xl">Manage Wallet</button>
               </div>
               <div className="absolute top-10 right-10 opacity-10 animate-pulse-slow">
                 <Globe size={300} />
               </div>
            </RevealSection>

            <RevealSection className="md:col-span-3 lg:col-span-4 lg:row-span-2 bg-slate-900 dark:bg-[#050b1a] rounded-[3.5rem] p-10 border border-white/5 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Database size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 tracking-[0.3em] uppercase">API v4.2</span>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-white mb-2 tracking-tight">API Command Center</h4>
                  <p className="text-slate-500 text-sm font-medium">Native integration with SMM panels and custom software. 150ms latency.</p>
               </div>
            </RevealSection>

            <RevealSection className="md:col-span-3 lg:col-span-4 lg:row-span-2 bg-slate-50 dark:bg-[#050b1a] rounded-[3.5rem] p-10 border border-slate-200 dark:border-white/5 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Users size={24} />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
               </div>
               <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">24/7 VIP Liaison</h4>
                  <p className="text-slate-500 text-sm font-medium">Professional account managers available around the clock via Ticket, WhatsApp, and Telegram.</p>
               </div>
            </RevealSection>

            <RevealSection className="md:col-span-6 lg:col-span-4 lg:row-span-1 bg-white dark:bg-[#050b1a] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 flex items-center gap-6 group">
               <div className="w-12 h-12 bg-blue-600/5 dark:bg-white/5 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                 <ShieldCheck size={24} />
               </div>
               <div>
                  <h4 className="font-black text-slate-900 dark:text-white tracking-tight">Enterprise Shield</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Safe & Secured Payments</p>
               </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <RevealSection>
          <div className="max-w-6xl mx-auto bg-blue-600 rounded-[4rem] p-12 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(37,99,235,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>
            
            <div className="relative z-10 text-white">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">Secure Your Spot in <br />the Global Elite.</h2>
              <p className="text-white/80 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Join 12,000+ professional resellers who have switched to DzD for stability, speed, and margin growth.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <button 
                  onClick={() => navigate('/billing')}
                  className="bg-white text-blue-600 px-12 py-6 rounded-[1.5rem] font-black text-xl hover:scale-105 hover:shadow-2xl transition-all active:scale-95"
                >
                  Go to My Wallet
                </button>
                <button className="bg-blue-800/40 backdrop-blur-md text-white px-12 py-6 rounded-[1.5rem] font-black text-xl border border-white/20 hover:bg-blue-800/60 transition-all">
                  Contact Support
                </button>
              </div>
            </div>

            <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 border-[40px] border-white/5 rounded-full pointer-events-none"></div>
          </div>
        </RevealSection>
      </section>

      <Footer />
    </div>
  );
}

const CreditCard = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
);
