import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { animeService } from '../../services/api';
import AnimeCard from '../../components/AnimeCard';

const Ongoing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOption, setSortOption] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { id: 'default', label: 'Terbaru', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { id: 'az', label: 'Judul A-Z', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg> },
    { id: 'za', label: 'Judul Z-A', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-1l4 4m0 0l4-4m-4 4V4"></path></svg> },
  ];

  const currentSort = sortOptions.find(opt => opt.id === sortOption);

  // Sort anime list based on selected option
  const sortedAnimeList = [...animeList].sort((a, b) => {
    if (sortOption === 'az') return a.title.localeCompare(b.title);
    if (sortOption === 'za') return b.title.localeCompare(a.title);
    return 0;
  });

  useEffect(() => {
    const fetchOngoing = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const response = await animeService.getOngoingAnime(page);
        if (response.data.ok) {
          setAnimeList(response.data.data.animeList);
          setPagination(response.data.pagination);
        } else {
          setError('Gagal memuat daftar anime ongoing');
        }
      } catch (err) {
        setError('Gagal mengambil data dari server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOngoing();
  }, [page]);

  const handleNextPage = () => {
    setSearchParams({ page: page + 1 });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setSearchParams({ page: page - 1 });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-20 px-4">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white border-l-4 border-primary pl-4 uppercase tracking-tighter italic">
            Sedang <span className="text-primary">Tayang</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1 pl-5 hidden md:block font-medium">
            Update anime terbaru setiap harinya
          </p>
        </div>

        {/* Modern Sort Dropdown */}
        <div className="relative w-full md:w-56" ref={sortRef}>
           <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full flex items-center justify-between gap-3 bg-white/5 backdrop-blur-md text-white text-sm rounded-xl px-4 py-3 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 shadow-lg group"
           >
              <div className="flex items-center gap-2">
                 <span className="text-primary group-hover:scale-110 transition-transform">{currentSort.icon}</span>
                 <span className="font-bold tracking-tight">Urutkan: {currentSort.label}</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
              </svg>
           </button>

           {/* Dropdown Menu */}
           {isSortOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#141414]/95 backdrop-blur-2xl rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in origin-top">
                 {sortOptions.map((opt) => (
                    <button
                       key={opt.id}
                       onClick={() => {
                          setSortOption(opt.id);
                          setIsSortOpen(false);
                       }}
                       className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-all duration-200 ${
                          sortOption === opt.id 
                          ? 'bg-primary text-white font-black' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                       }`}
                    >
                       <span className={sortOption === opt.id ? 'text-white' : 'text-primary'}>
                          {opt.icon}
                       </span>
                       {opt.label}
                    </button>
                 ))}
              </div>
           )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {sortedAnimeList.map((anime) => (
          <AnimeCard key={anime.animeId} anime={anime} type="ongoing" />
        ))}
      </div>

      {/* Pagination Controls (Responsive) */}
      <div className="mt-12 flex justify-center items-center gap-6">
        <button 
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`h-10 w-10 md:w-auto md:px-6 flex items-center justify-center rounded-full font-bold transition-all ${
            page === 1 
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
            : 'bg-gray-800 text-white hover:bg-primary hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]'
          }`}
          aria-label="Halaman Sebelumnya"
        >
          <span className="hidden md:inline">Sebelumnya</span>
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-white/5 shadow-inner">
           <span className="text-white font-black text-sm md:text-base">
             {page}
           </span>
           <span className="text-gray-500 font-bold">/</span>
           <span className="text-gray-400 font-bold text-sm md:text-base">
             {pagination?.totalPages || '?'}
           </span>
        </div>

        <button 
          onClick={handleNextPage}
          disabled={pagination?.hasNextPage === false}
          className={`h-10 w-10 md:w-auto md:px-6 flex items-center justify-center rounded-full font-bold transition-all ${
             pagination?.hasNextPage === false
             ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
             : 'bg-gray-800 text-white hover:bg-primary hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]'
          }`}
           aria-label="Halaman Selanjutnya"
        >
          <span className="hidden md:inline">Selanjutnya</span>
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Ongoing;
