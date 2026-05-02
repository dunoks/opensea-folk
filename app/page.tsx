'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion } from 'motion/react';
import { 
  Search, Wallet, TrendingUp, Grid, BarChart3, User, ExternalLink, 
  ArrowUpRight, Palette, Gamepad2, Music, Box, X, Filter, 
  Share2, Link2, ShoppingCart, CheckCircle2
} from 'lucide-react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { ModeToggle } from '@/components/mode-toggle';

// Mock ABI for a generic NFT Purchase
const MARKET_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "purchase",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Placeholder

const FEATURE_NFT = {
  id: '8821',
  name: 'Lumina Prism',
  collection: 'Lumina Collection',
  creator: 'AetherLabs',
  priceValue: 0.05,
  price: '0.05 ETH',
  isFixedPrice: true,
  image: 'https://picsum.photos/seed/nftarthero/800/800',
  rarity: 'Legendary',
  rarityRank: 42,
  totalInCollection: 10000,
  traits: [
    { type: 'Background', value: 'Nebula Purple', rarity: '2%' },
    { type: 'Body', value: 'Crystal Glass', rarity: '5%' },
    { type: 'Gemstone', value: 'Prismatic Diamond', rarity: '0.8%' },
    { type: 'Aura', value: 'Supernova', rarity: '1.2%' }
  ]
};

const TRENDING_COLLECTIONS = [
  { id: 1, name: 'Bored Ape Yacht Club', floor: '24.2 ETH', change: '+12.4%', color: 'from-orange-400 to-red-500', isFixed: false },
  { id: 2, name: 'Pudgy Penguins', floor: '11.8 ETH', change: '+8.2%', color: 'from-blue-400 to-cyan-500', isFixed: true, price: '11.8' },
  { id: 3, name: 'Azuki Elementals', floor: '5.4 ETH', change: '-2.1%', color: 'from-purple-400 to-pink-500', isFixed: true, price: '5.4' },
  { id: 4, name: 'Doodles', floor: '2.1 ETH', change: '+4.5%', color: 'from-green-400 to-emerald-500', isFixed: false },
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
  const [sortBy, setSortBy] = useState<'rank' | 'floor' | 'change'>('rank');
  const [filterFixed, setFilterFixed] = useState(false);
  const router = useRouter();
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

  const share = useCallback((text: string) => {
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    // Silent success for cleaner UI in miniapp
  }, []);

  const calls = [
    {
      to: CONTRACT_ADDRESS as `0x${string}`,
      abi: MARKET_ABI,
      functionName: 'purchase',
      args: [BigInt(FEATURE_NFT.id)],
      value: BigInt(FEATURE_NFT.priceValue * 1e18),
    },
  ];

  const filteredCollections = TRENDING_COLLECTIONS
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriceMax = priceRange.max ? parseFloat(item.floor) <= parseFloat(priceRange.max) : true;
      const matchesPriceMin = priceRange.min ? parseFloat(item.floor) >= parseFloat(priceRange.min) : true;
      const matchesFixed = filterFixed ? item.isFixed : true;
      return matchesSearch && matchesPriceMax && matchesPriceMin && matchesFixed;
    })
    .sort((a, b) => {
      if (sortBy === 'floor') {
        return parseFloat(b.floor) - parseFloat(a.floor);
      }
      if (sortBy === 'change') {
        const getChange = (s: string) => parseFloat(s.replace('%', ''));
        return getChange(b.change) - getChange(a.change);
      }
      return 0; // Default rank (initial order)
    });

  if (!isReady) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-6 pb-24 flex flex-col gap-6">
      {/* Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 p-2 md:p-4 rounded-3xl -mx-2 md:-mx-4 ${isScrolled ? 'bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl' : ''}`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/20">B</div>
              <span className="text-xl font-black tracking-tighter">BASEFOLK</span>
            </div>
            <div className="lg:hidden flex items-center gap-2">
               <ModeToggle />
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
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-all ${showFilters ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-700'}`}
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
                className="mt-4 p-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl"
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
                          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 border-transparent text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-700'}`}
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
                          className="w-full bg-zinc-200 dark:bg-zinc-800 border border-transparent rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>
                      <span className="text-zinc-600 font-bold">/</span>
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full bg-zinc-200 dark:bg-zinc-800 border border-transparent rounded-xl py-2 px-4 text-xs focus:outline-none focus:border-indigo-500 transition-all font-mono"
                        />
                      </div>
                    </div>
                    {(priceRange.min || priceRange.max) && (
                      <button 
                        onClick={() => setPriceRange({ min: '', max: '' })}
                        className="mt-3 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
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
            <ModeToggle />
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
          className="md:col-span-12 lg:col-span-7 md:row-span-4 bg-gradient-to-br from-indigo-500/10 via-zinc-100 to-white dark:via-zinc-900 dark:to-zinc-950 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800/50 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
        >
          <div className="relative z-10 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-300 font-mono">Premium Asset</span>
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                {FEATURE_NFT.rarity}
              </span>
              <span className="inline-block px-4 py-1.5 bg-zinc-500/10 border border-zinc-500/20 backdrop-blur-md rounded-full text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-widest">
                Rank #{FEATURE_NFT.rarityRank}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 tracking-tighter text-zinc-900 dark:text-white">
              {FEATURE_NFT.name}<br/><span className="text-zinc-300 dark:text-zinc-600">#{FEATURE_NFT.id}</span>
            </h1>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push(`/profile/${CONTRACT_ADDRESS}`)}
                  className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-md hover:border-indigo-500 transition-colors"
                >
                  <User className="w-5 h-5 text-indigo-500" />
                </button>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">Creator</p>
                  <button 
                    onClick={() => router.push(`/profile/${CONTRACT_ADDRESS}`)}
                    className="font-bold text-sm text-zinc-800 dark:text-zinc-200 hover:text-indigo-500 transition-colors"
                  >
                    {FEATURE_NFT.creator}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => share(`Check out ${FEATURE_NFT.name} on Basefolk!`)}
                  className="p-3 rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-300 dark:hover:bg-white/10 transition-colors text-zinc-500 hover:text-indigo-600 dark:hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={copyLink}
                  className="p-3 rounded-2xl bg-zinc-200/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-300 dark:hover:bg-white/10 transition-colors text-zinc-500 hover:text-indigo-600 dark:hover:text-white"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Traits Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {FEATURE_NFT.traits.map((trait) => (
                <div key={trait.type} className="p-3 rounded-2xl bg-white/50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm group/trait hover:border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-800 transition-all">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 leading-none">{trait.type}</p>
                  <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{trait.value}</p>
                  <p className="text-[9px] font-black text-indigo-500 mt-1 uppercase tracking-tighter">{trait.rarity} Rarity</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex items-end justify-between mt-12 gap-4">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 uppercase tracking-widest leading-none">Fixed Price</p>
              <p className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white">{FEATURE_NFT.price}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2 w-full max-w-[200px]">
              {isConnected ? (
                <Transaction
                  calls={calls}
                  onStatus={(status) => console.log('Transaction status:', status)}
                >
                  <TransactionButton 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 group/btn" 
                    text="Buy Now"
                  />
                  <TransactionStatus>
                    <TransactionStatusLabel />
                    <TransactionStatusAction />
                  </TransactionStatus>
                </Transaction>
              ) : (
                <button className="w-full bg-indigo-600/50 cursor-not-allowed text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest opacity-80">
                  Connect to Buy
                </button>
              )}
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider text-center w-full">Verified Contract</p>
            </div>
          </div>

          {/* Background visuals */}
          <div className="absolute top-0 right-0 w-full h-full lg:w-4/5 pointer-events-none opacity-20 dark:opacity-40 transition-opacity duration-700 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-from)_0%,_transparent_60%)] from-indigo-500/30">
            <img 
              src={FEATURE_NFT.image} 
              alt={FEATURE_NFT.name}
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          </div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
        </motion.div>

        {/* Trending Collections */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-12 lg:col-span-5 md:row-span-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden flex flex-col shadow-xl"
        >
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                   <TrendingUp className="w-6 h-6 text-indigo-500" />
                </div>
                Trending
              </h2>
              <button className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest hover:underline">Rankings</button>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="rank">Rank</option>
                <option value="floor">Floor</option>
                <option value="change">Change</option>
              </select>
              
              <button 
                onClick={() => setFilterFixed(!filterFixed)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${filterFixed ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400'}`}
              >
                <ShoppingCart className="w-3 h-3" />
                Buy Now
              </button>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredCollections.length > 0 ? (
              filteredCollections.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ x: 5 }}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-800/30 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-indigo-500/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 dark:text-zinc-600 text-xs font-black w-4 text-center">
                      {sortBy === 'rank' ? TRENDING_COLLECTIONS.indexOf(item) + 1 : '•'}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ring-1 ring-white/5`}></div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Floor: {item.floor}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className={`flex items-center gap-1 ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="text-xs font-black tracking-tighter text-sm">{item.change}</span>
                    </div>
                    <div className="flex gap-2">
                      {item.isFixed && (
                         <button className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ShoppingCart className="w-3.5 h-3.5" />
                         </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); share(`Check this out: ${item.name}!`); }}
                        className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-indigo-500"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-48 opacity-50 grayscale">
                <Box className="w-12 h-12 mb-4 text-zinc-400" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">No matches found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-6 lg:col-span-3 md:row-span-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-lg hover:border-indigo-500/20 transition-all group"
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500 transition-colors">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
             </div>
            <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em] leading-none">24h Volume</p>
          </div>
          <p className="text-4xl font-black tracking-tighter mb-4">$42.8M</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '75%' }}
                className="h-full bg-indigo-600"
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
          className="md:col-span-6 lg:col-span-6 md:row-span-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 flex flex-col shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Grid className="w-4 h-4 text-indigo-500" />
              </div>
              Categories
            </h3>
            <button className="text-[10px] font-black text-zinc-400 uppercase hover:text-indigo-500 transition-colors">Explore</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {CATEGORIES.map((cat) => (
              <motion.div 
                key={cat.name} 
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white dark:bg-zinc-800/40 rounded-3xl flex flex-col items-center justify-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/30 transition-all cursor-pointer group"
              >
                <span className="text-3xl mb-2 transition-all">{cat.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wallet UI (Miniapp Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          onClick={() => address && router.push(`/profile/${address}`)}
          className="md:col-span-12 lg:col-span-3 md:row-span-2 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl cursor-pointer"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
               <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="relative z-10 mb-2">
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">My Address</p>
            <p className="text-sm font-bold text-white tracking-tight break-all font-mono leading-tight">
              {isConnected ? address : 'Disconnected'}
            </p>
            {isConnected && (
              <div className="flex items-center gap-2 mt-4">
                 <div className="w-2 h-2 rounded-full bg-green-300 shadow-[0_0_8px_rgba(134,239,172,0.8)]"></div>
                 <p className="text-indigo-100 text-[10px] font-black uppercase tracking-wider">Live on Base</p>
              </div>
            )}
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
        </motion.div>

      </main>

      {/* Footer Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] gap-4">
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <span className="flex items-center gap-2">ETH : <span className="text-foreground">$2,451.21</span> <span className="text-green-500">▲</span></span>
            <span className="flex items-center gap-2">Base Gas : <span className="text-foreground">18 Gwei</span> <CheckCircle2 className="w-3 h-3 text-indigo-500" /></span>
          </div>
          <div className="opacity-60 hidden sm:block">© 2026 BASEFOLK • POWERED BY BASE</div>
        </div>
      </footer>
    </div>
  );
}
