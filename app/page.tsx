'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion } from 'motion/react';
import { Search, Wallet, TrendingUp, Grid, BarChart3, User, ExternalLink, ArrowUpRight, Palette, Gamepad2, Music, Box, X, Filter } from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

const FEATURED_NFT = {
  id: '8821',
  name: 'Lumina Prism',
  collection: 'Lumina Collection',
  creator: 'AetherLabs',
  bid: '12.45 ETH',
  image: 'https://picsum.photos/seed/nftarthero/800/800',
};

const TRENDING_COLLECTIONS = [
  { id: 1, name: 'Bored Ape Yacht Club', floor: '24.2 ETH', change: '+12.4%', color: 'from-orange-400 to-red-500' },
  { id: 2, name: 'Pudgy Penguins', floor: '11.8 ETH', change: '+8.2%', color: 'from-blue-400 to-cyan-500' },
  { id: 3, name: 'Azuki Elementals', floor: '5.4 ETH', change: '-2.1%', color: 'from-purple-400 to-pink-500' },
  { id: 4, name: 'Doodles', floor: '2.1 ETH', change: '+4.5%', color: 'from-green-400 to-emerald-500' },
];

const CATEGORIES = [
  { name: 'Art', emoji: '🎨' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Virtual', emoji: '🏗️' },
];

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      setIsReady(true);
    };
    init();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-6 pb-24 flex flex-col gap-6">
      {/* Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 p-2 md:p-4 rounded-3xl -mx-2 md:-mx-4 ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 shadow-2xl' : ''}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/20">B</div>
              <span className="text-xl font-bold tracking-tight">BASEFOLK</span>
            </div>
            <div className="lg:hidden flex items-center gap-2">
               <ConnectWallet className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-4 py-2 scale-90" />
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl lg:px-8">
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items, collections..." 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-all ${showFilters ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800'}`}
              >
                {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                <span className="hidden sm:inline">{showFilters ? 'Close' : 'Filters'}</span>
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                className="mt-4 p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Category</label>
                      {selectedCategory !== 'All' && (
                        <button onClick={() => setSelectedCategory('All')} className="text-[10px] text-indigo-400 hover:underline">Clear</button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['All', ...CATEGORIES.map(c => c.name)].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">Price Range (ETH)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-full bg-zinc-800 border border-transparent rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-indigo-500 focus:bg-zinc-700 transition-all font-mono"
                        />
                      </div>
                      <span className="text-zinc-700 font-bold">/</span>
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full bg-zinc-800 border border-transparent rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-indigo-500 focus:bg-zinc-700 transition-all font-mono"
                        />
                      </div>
                    </div>
                    {(priceRange.min || priceRange.max) && (
                      <button 
                        onClick={() => setPriceRange({ min: '', max: '' })}
                        className="mt-3 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Reset prices
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-indigo-400 transition-colors relative group">
              Stats
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
            </a>
             <ConnectWallet className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 py-2.5 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform" />
          </nav>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-1">
        
        {/* Featured Hero NFT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-12 lg:col-span-7 md:row-span-4 bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-900 rounded-[2.5rem] border border-zinc-800/50 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
        >
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider font-bold text-indigo-300 mb-6">Featured Collection</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">{FEATURE_NFT.name}<br/><span className="text-zinc-600">#{FEATURE_NFT.id}</span></h1>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Creator</p>
                <p className="font-semibold text-sm">{FEATURE_NFT.creator}</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between mt-12">
            <div>
              <p className="text-zinc-500 text-xs font-semibold mb-2 uppercase tracking-widest">Current Bid</p>
              <p className="text-3xl font-bold tracking-tighter text-white">{FEATURE_NFT.bid}</p>
            </div>
            <button className="bg-white text-black px-8 py-4 rounded-3xl font-bold hover:bg-zinc-200 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2">
              Place Bid <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-full h-full lg:w-3/4 pointer-events-none opacity-30 group-hover:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-from)_0%,_transparent_70%)] from-indigo-500/20">
            <img 
              src={FEATURED_NFT.image} 
              alt={FEATURED_NFT.name}
              className="w-full h-full object-cover mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
        </motion.div>

        {/* Trending Collections */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-12 lg:col-span-5 md:row-span-4 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                 <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              Trending
            </h2>
            <button className="text-xs text-indigo-400 font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">Rankings</button>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {TRENDING_COLLECTIONS.map((item, index) => (
              <motion.div 
                key={item.id} 
                whileHover={{ x: 5 }}
                className="group flex items-center justify-between p-4 bg-zinc-800/30 rounded-3xl border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-zinc-600 text-xs font-black w-4 text-center">{index + 1}</span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ring-1 ring-white/5`}></div>
                  <div>
                    <p className="font-bold text-sm truncate max-w-[150px]">{item.name}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Floor: {item.floor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="text-xs font-black">{item.change}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-indigo-400 transition-colors ml-auto mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-6 lg:col-span-3 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-lg hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-zinc-800 rounded-lg">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
             </div>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] leading-none">24h Volume</p>
          </div>
          <p className="text-4xl font-bold tracking-tighter mb-4">$42,852,109</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '75%' }}
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
              ></motion.div>
            </div>
            <span className="text-[10px] font-black text-zinc-500 uppercase">75%</span>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-6 lg:col-span-6 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold flex items-center gap-3">
              <div className="p-1.5 bg-zinc-800 rounded-lg">
                <Grid className="w-4 h-4 text-indigo-400" />
              </div>
              Browse Categories
            </h3>
            <button className="text-[10px] font-bold text-zinc-600 uppercase hover:text-zinc-400 transition-colors">See all</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {CATEGORIES.map((cat) => (
              <motion.div 
                key={cat.name} 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-zinc-800/40 rounded-3xl flex flex-col items-center justify-center p-4 hover:bg-zinc-800 border border-zinc-800 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                <span className="text-3xl mb-2 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all">{cat.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-200">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-12 lg:col-span-3 md:row-span-2 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
               <Wallet className="w-6 h-6 text-white" />
            </div>
            <button className="bg-black/20 p-2.5 rounded-2xl hover:bg-black/30 transition-colors backdrop-blur-md">
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="relative z-10 mb-2">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">Connected Wallet</p>
            <p className="text-sm font-bold text-white tracking-tight break-all font-mono leading-relaxed">
              {isConnected ? address : 'Wallet Disconnected'}
            </p>
            {isConnected && (
              <div className="flex items-center gap-2 mt-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-300 animate-pulse"></div>
                 <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Base Mainnet</p>
              </div>
            )}
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        </motion.div>

      </main>

      {/* Footer Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] gap-4">
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="flex items-center gap-2">ETH/USD: <span className="text-white">$2,451.21</span> <span className="text-green-500">▲</span></span>
            <span className="flex items-center gap-2">Base Gas: <span className="text-white">18 Gwei</span> <ArrowUpRight className="w-3 h-3 text-indigo-500" /></span>
            <span className="flex items-center gap-2">Market Cap: <span className="text-white">$2.4T</span></span>
          </div>
          <div className="opacity-60 hidden sm:block">© 2026 BASEFOLK • SECURE & FAST</div>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        input[type='number']::-webkit-inner-spin-button, 
        input[type='number']::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
}
