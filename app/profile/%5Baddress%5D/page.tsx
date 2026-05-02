'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Wallet, Grid, BarChart3, Clock, 
  ArrowLeft, Share2, ExternalLink, Box,
  LayoutGrid, List, Filter, ShoppingCart,
  ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { ModeToggle } from '@/components/mode-toggle';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

// Mock Data for Profile
const MOCK_NFTS = [
  { id: '1021', name: 'Cyber Neon #1021', collection: 'Neon Runners', image: 'https://picsum.photos/seed/n1/400/400', price: '0.12 ETH' },
  { id: '4432', name: 'Ethereal Flow #4432', collection: 'Ethereal', image: 'https://picsum.photos/seed/n2/400/400', price: '0.08 ETH' },
  { id: '892', name: 'Baserock #892', collection: 'Base Origin', image: 'https://picsum.photos/seed/n3/400/400', price: '0.45 ETH' },
  { id: '5561', name: 'Digital Aura #5561', collection: 'Lumina', image: 'https://picsum.photos/seed/n4/400/400', price: '0.15 ETH' },
];

const MOCK_COLLECTIONS = [
  { name: 'Neon Runners', items: 12, floor: '0.05 ETH', volume: '12.4 ETH' },
  { name: 'Ethereal', items: 5, floor: '0.08 ETH', volume: '2.1 ETH' },
];

const MOCK_ACTIVITY = [
  { type: 'Sale', item: 'Cyber Neon #1021', price: '0.12 ETH', from: '0x...123', to: 'You', date: '2 hours ago' },
  { type: 'Mint', item: 'Digital Aura #5561', price: '0.05 ETH', from: 'Null', to: 'You', date: '1 day ago' },
  { type: 'Transfer', item: 'Lumina Prism #8821', price: '-', from: 'You', to: '0x...ABC', date: '3 days ago' },
];

export default function ProfilePage() {
  const { address: profileAddress } = useParams();
  const { address: connectedAddress } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'nfts' | 'collections' | 'activity'>('nfts');
  const [isScrolled, setIsScrolled] = useState(false);

  const isOwner = connectedAddress?.toLowerCase() === (profileAddress as string).toLowerCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayAddress = profileAddress 
    ? `${(profileAddress as string).slice(0, 6)}...${(profileAddress as string).slice(-4)}`
    : 'Unknown';

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-6 pb-24 flex flex-col gap-8">
      {/* Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 p-2 md:p-4 rounded-3xl -mx-2 md:-mx-4 ${isScrolled ? 'bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl' : ''}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/20 cursor-pointer" onClick={() => router.push('/')}>B</div>
              <span className="text-xl font-black tracking-tighter hidden sm:block">BASEFOLK</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <ConnectWallet className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 py-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform" />
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <section className="max-w-7xl mx-auto w-full">
        <div className="relative rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-64 md:h-80 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-zinc-100 to-white dark:from-indigo-500/10 dark:via-zinc-900 dark:to-zinc-950"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="px-6 md:px-12 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 justify-between">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-2xl p-1 overflow-hidden group">
                <img 
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${profileAddress}`} 
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-[2rem] group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                    {isOwner ? 'Your Profile' : displayAddress}
                  </h1>
                  <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-bold text-zinc-500">
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="font-mono">{displayAddress}</span>
                  </div>
                  <div className="text-xs font-bold text-zinc-400">Joined May 2026</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <button className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                Share Profile
              </button>
              <button className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-zinc-500 active:scale-95">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Content */}
      <section className="max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="flex items-center gap-2 md:gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-0.5 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('nfts')}
            className={`px-6 py-4 relative font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'nfts' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Collected <span className="text-[10px] opacity-60">({MOCK_NFTS.length})</span>
            </div>
            {activeTab === 'nfts' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-4 relative font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'collections' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Creations <span className="text-[10px] opacity-60">({MOCK_COLLECTIONS.length})</span>
            </div>
            {activeTab === 'collections' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-4 relative font-black text-sm uppercase tracking-widest transition-colors ${activeTab === 'activity' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Activity
            </div>
            {activeTab === 'activity' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />}
          </button>
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'nfts' && (
              <motion.div 
                key="nfts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {MOCK_NFTS.map((nft) => (
                  <div key={nft.id} className="group bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl">
                    <div className="aspect-square relative overflow-hidden">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <button className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 mb-1">{nft.collection}</p>
                      <h3 className="font-black text-sm mb-3 truncate">{nft.name}</h3>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-zinc-400 mb-0.5">Price</p>
                          <p className="font-black text-indigo-600 dark:text-indigo-400">{nft.price}</p>
                        </div>
                        <button className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-indigo-500 hover:text-white transition-all">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'collections' && (
              <motion.div 
                key="collections"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {MOCK_COLLECTIONS.map((col) => (
                  <div key={col.name} className="p-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex items-center justify-between hover:border-indigo-500/30 transition-all shadow-xl group">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] shadow-lg group-hover:rotate-3 transition-transform" />
                      <div>
                        <h3 className="text-xl font-black mb-1">{col.name}</h3>
                        <div className="flex gap-4 text-xs font-bold text-zinc-500">
                          <span>{col.items} Items</span>
                          <span>Floor: {col.floor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Volume</p>
                      <p className="font-black text-indigo-600 dark:text-indigo-400">{col.volume}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800">
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">Event</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">Item</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">Price</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">From</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">To</th>
                        <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-zinc-500">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {MOCK_ACTIVITY.map((act, i) => (
                        <tr key={i} className="border-b border-zinc-200/50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-200 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-2">
                             <div className={`p-1.5 rounded-lg ${act.type === 'Sale' ? 'bg-green-500/10 text-green-500' : act.type === 'Mint' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                               <ShoppingCart className="w-3.5 h-3.5" />
                             </div>
                             {act.type}
                          </td>
                          <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100">{act.item}</td>
                          <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400">{act.price}</td>
                          <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{act.from}</td>
                          <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{act.to}</td>
                          <td className="px-6 py-4 text-zinc-400 text-xs">{act.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] gap-4">
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="flex items-center gap-2">ETH : <span className="text-foreground">$2,451.21</span> <span className="text-green-500">▲</span></span>
            <span className="flex items-center gap-2">Status : <span className="text-foreground font-mono">{displayAddress} connected</span> <CheckCircle2 className="w-3 h-3 text-indigo-500" /></span>
          </div>
          <div className="opacity-60 hidden sm:block">POWERED BY BASEFOLK</div>
        </div>
      </footer>
    </div>
  );
}
