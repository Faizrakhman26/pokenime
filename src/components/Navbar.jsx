import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { animeService } from '../services/api';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    // Klik di luar dropdown search untuk menutupnya
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce Search Handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        try {
          const response = await animeService.searchAnime(searchQuery);
          if (response.data.ok) {
             setSearchResults(response.data.data.animeList.slice(0, 5)); // Ambil 5 hasil teratas
             setShowDropdown(true);
          }
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500); // Tunggu 500ms setelah mengetik

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        setShowDropdown(false);
        navigate(`/search?q=${searchQuery}`);
    }
  };

  const navLinks = [
    { name: 'Home', to: '/', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { 
          name: 'Ongoing', 
          to: '/ongoing', 
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
        },
        { 
          name: 'Genres', 
          to: '/genres', 
          icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> 
        },
        { 
          name: 'Completed', 
          to: '/completed', 
     icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { name: 'Jadwal', to: '/schedule', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { name: 'List', to: '/directory', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black text-primary tracking-tighter italic whitespace-nowrap">
              POKE<span className="text-white">NIME</span>
            </Link>
          </div>

          {/* GLOBAL SEARCH BAR */}
          <div className="flex-grow max-w-xl relative hidden md:block" ref={searchRef}>
             <form onSubmit={handleSubmitSearch} className="relative">
                <input 
                   type="text" 
                   placeholder="Cari anime..." 
                   className="w-full bg-white/10 border border-transparent focus:border-primary/50 focus:bg-black/80 text-sm rounded-full py-2 px-5 text-white placeholder-gray-400 outline-none transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                />
                <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                </button>
             </form>

             {/* Dropdown Results */}
             {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                   {isSearching ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Mencari...</div>
                   ) : searchResults.length > 0 ? (
                      <>
                        <div className="py-2">
                           {searchResults.map((anime) => (
                              <Link 
                                 key={anime.animeId} 
                                 to={`/anime/${anime.animeId}`} 
                                 className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
                                 onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                              >
                                 <img src={anime.poster} alt="" className="w-8 h-10 object-cover rounded shadow" />
                                 <div className="flex-grow min-w-0">
                                    <p className="text-sm font-bold text-gray-200 group-hover:text-primary truncate">{anime.title}</p>
                                    <p className="text-[10px] text-gray-500">{anime.status} • {anime.score}</p>
                                 </div>
                              </Link>
                           ))}
                        </div>
                        <div className="border-t border-white/5 p-2 text-center bg-black/20">
                           <button 
                             onClick={handleSubmitSearch}
                             className="text-xs font-bold text-primary hover:underline"
                           >
                              Lihat Semua Hasil
                           </button>
                        </div>
                      </>
                   ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">Tidak ditemukan.</div>
                   )}
                </div>
             )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  location.pathname === link.to 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
             {/* Search Toggle Mobile */}
             <button 
                onClick={() => navigate('/search')}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </button>
             
             {/* Mobile Menu Button */}
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
               className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
               </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100 border-t border-white/5' : 'max-h-0 opacity-0'
      } bg-dark/98 backdrop-blur-xl`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                location.pathname === link.to 
                ? 'bg-primary/10 text-primary' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={location.pathname === link.to ? 'text-primary' : 'text-gray-400'}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
