'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion } from 'motion/react';
import { Search, Wallet, TrendingUp, Grid, BarChart3, User, ExternalLink, ArrowUpRight, Palette, Gamepad2, Music, Box } from 'lucide-react';
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
  { name: 'Art', icon: <Palette className="w-5 h-5" />, emoji: '🎨' },
  { name: 'Gaming', icon: <Gamepad2 className="w-5 h-5" />, emoji: '🎮' },
  { name: 'Music', icon: <Music className="w-5 h-5" />, emoji: '🎵' },
  { name: 'Virtual', icon: <Box className="w-5 h-5" />, emoji: '🏗️' },
];

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-6 flex flex-col gap-6">
      {/* Navigation */}
      <header className="flex items-center justify-between h-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">B</div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">BASEFOLK</span>
        </div>
        
        <div className="flex-1 max-w-md px-4 md:px-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search items, collections..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium">
          <div className="hidden lg:flex items-center gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Explore</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Stats</a>
          </div>
          <ConnectWallet className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-4" />
        </nav>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-1">
        
        {/* Featured Hero NFT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-7 md:row-span-4 bg-gradient-to-br from-indigo-900/40 to-zinc-900 rounded-3xl border border-zinc-800 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-4">Featured Collection</span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{FEATURED_NFT.name}<br/>#{FEATURED_NFT.id}</h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-700/50 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-zinc-400 text-sm">by</span>
              <span className="font-medium text-sm">{FEATURED_NFT.creator}</span>
            </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between mt-8">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Current Bid</p>
              <p className="text-2xl font-bold italic">{FEATURED_NFT.bid}</p>
            </div>
            <button className="bg-white text-black px-6 md:px-8 py-3 rounded-2xl font-bold hover:bg-zinc-200 transition-all transform active:scale-95">
              Place Bid
            </button>
          </div>

          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-50 group-hover:opacity-70 transition-opacity">
            <img 
              src={FEATURED_NFT.image} 
              alt={FEATURED_NFT.name}
              className="w-full h-full object-cover rounded-l-3xl"
            />
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Trending Collections */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-5 md:row-span-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Trending
            </h2>
            <button className="text-xs text-indigo-400 font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {TRENDING_COLLECTIONS.map((item, index) => (
              <div key={item.id} className="group flex items-center justify-between p-3 bg-zinc-800/40 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-sm font-bold w-4 text-center">{index + 1}</span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} shadow-lg`}></div>
                  <div>
                    <p className="font-bold text-sm truncate max-w-[120px]">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">Floor: {item.floor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} text-xs font-semibold`}>
                    {item.change}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-indigo-400 transition-colors ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-3 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-zinc-500" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest leading-none">24h Volume</p>
          </div>
          <p className="text-3xl font-bold mb-4">$42.8M</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-indigo-500"></div>
            </div>
            <span className="text-[10px] text-zinc-400 whitespace-nowrap">75% of Peak</span>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-6 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Grid className="w-4 h-4 text-indigo-400" />
              Categories
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="bg-zinc-800/50 rounded-2xl flex flex-col items-center justify-center p-3 hover:bg-zinc-800 hover:border-indigo-500/50 border border-transparent transition-all cursor-pointer group">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-zinc-200">{cat.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-3 md:row-span-2 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center">
               <Wallet className="w-5 h-5 text-white" />
            </div>
            <button className="bg-black/20 p-2 rounded-xl hover:bg-black/30 transition-colors">
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="relative z-10">
            <p className="text-white/70 text-xs mb-1">Your Wallet</p>
            <p className="text-xl font-bold text-white tracking-tight break-all">
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
            </p>
            {isConnected && (
              <p className="text-white/50 text-[10px] mt-1">Base Network</p>
            )}
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="mt-auto h-6 flex flex-wrap items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-6 pb-2 gap-4">
        <div className="flex gap-4 md:gap-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">
          <span className="flex items-center gap-1">ETH/USD: $2,451.21 <span className="text-green-500">▲</span></span>
          <span className="flex items-center gap-1">Gas: 18 Gwei <Box className="w-3 h-3" /></span>
          <span>Assets: 1.2M+</span>
        </div>
        <div className="opacity-50">© 2026 BASEFOLK MARKETPLACE</div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
