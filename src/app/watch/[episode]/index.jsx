import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { animeService } from '../../../services/api';
import SEO from '../../../components/SEO';

const Watch = () => {
  const { episode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState('');
  const [activeServer, setActiveServer] = useState(null);
  
  // State untuk melacak kualitas mana yang sedang dibuka dropdown-nya (Server)
  const [openQuality, setOpenQuality] = useState(null);
  // State untuk melacak kualitas download yang terbuka
  const [openDownloadQuality, setOpenDownloadQuality] = useState(null);

  useEffect(() => {
    const fetchEpisodeDetail = async () => {
      setLoading(true);
      try {
        const response = await animeService.getWatchEpisode(episode);
        if (response.data.ok) {
          const episodeData = response.data.data;
          
          // Set default stream URL
          setData(episodeData);
          setCurrentStreamUrl(episodeData.defaultStreamingUrl);
        } else {
          setError('Episode tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat episode');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeDetail();
    window.scrollTo(0, 0);
  }, [episode]);

  const handleServerChange = async (serverId) => {
    setActiveServer(serverId);
    try {
      const response = await animeService.getServerStream(serverId);
      if (response.data.ok) {
        const newUrl = response.data.data.url;
        setCurrentStreamUrl(newUrl);
        // Otomatis tutup dropdown setelah memilih server
        setOpenQuality(null);
      }
    } catch (err) {
      console.error('Error fetching server stream:', err);
      alert('Gagal memuat server ini, silakan coba server lain.');
    }
  };

  const toggleQuality = (qualityTitle) => {
    if (openQuality === qualityTitle) {
        setOpenQuality(null); // Tutup jika diklik lagi
    } else {
        setOpenQuality(qualityTitle); // Buka yang baru
    }
  };
  
  const toggleDownloadQuality = (qualityTitle) => {
    if (openDownloadQuality === qualityTitle) {
        setOpenDownloadQuality(null);
    } else {
        setOpenDownloadQuality(qualityTitle);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-20 px-4">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg max-w-md mx-auto">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p className="text-gray-300 mb-6">{error}</p>
        <button onClick={() => navigate(-1)} className="bg-primary px-6 py-2 rounded-full font-bold">Kembali</button>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-20 min-h-screen bg-dark">
      <SEO 
        title={`Nonton ${data.title} Sub Indo`} 
        description={`Streaming dan download anime ${data.title} subtitle Indonesia gratis resolusi terbaik. Nonton anime sub indo tanpa iklan.`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[10px] md:text-sm text-gray-400 mb-2">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <Link to={`/anime/${data.animeId}`} className="hover:text-primary transition line-clamp-1">Detail Anime</Link>
            <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-gray-200 line-clamp-1">{data.title}</span>
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-white leading-tight">{data.title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-grow lg:max-w-[70%]">
            {/* Player Container */}
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 mb-6">
              {currentStreamUrl ? (
                <iframe
                  src={currentStreamUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  scrolling="no"
                  title="Video Player"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                   <p>Pilih server untuk memulai video...</p>
                </div>
              )}
            </div>

            {/* SERVER & QUALITY SELECTOR (Moved Here) */}
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pilih Kualitas Server:</p>
                
                {/* Quality Tabs (Horizontal) */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {data.server.qualities.map((q) => (
                        <button
                            key={q.title}
                            onClick={() => toggleQuality(q.title)}
                            className={`flex-1 min-w-[80px] py-2 px-4 rounded-lg font-bold text-sm transition-all border flex justify-between items-center ${
                                openQuality === q.title
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                            {q.title}
                            <svg className={`w-4 h-4 transition-transform ${openQuality === q.title ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Server Dropdown Content */}
                {openQuality && (
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 animate-fade-in-down">
                        <p className="text-[10px] text-gray-500 mb-2">Server tersedia untuk <span className="text-primary font-bold">{openQuality}</span>:</p>
                        <div className="flex flex-wrap gap-2">
                            {data.server.qualities.find(q => q.title === openQuality)?.serverList.map((srv) => (
                                <button
                                   key={srv.serverId}
                                   onClick={() => handleServerChange(srv.serverId)}
                                   className={`px-4 py-2 text-xs rounded-lg font-bold transition-all border ${
                                      activeServer === srv.serverId 
                                      ? 'bg-white text-black border-white' 
                                      : 'bg-gray-800 border-white/10 text-gray-300 hover:bg-gray-700 hover:border-white/30'
                                   }`}
                                >
                                   {srv.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons (Prev/Next) */}
            <div className="flex items-center justify-between mb-8 gap-4">
                 <Link 
                    to={data.hasPrevEpisode ? `/watch/${data.prevEpisode.episodeId}` : '#'}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        data.hasPrevEpisode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-800/20 text-gray-600 cursor-not-allowed'
                    }`}
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Prev
                 </Link>
                 
                 <Link 
                    to={data.hasNextEpisode ? `/watch/${data.nextEpisode.episodeId}` : '#'}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                        data.hasNextEpisode ? 'bg-primary hover:bg-red-700 text-white shadow-lg shadow-primary/20' : 'bg-gray-800/20 text-gray-600 cursor-not-allowed'
                    }`}
                 >
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </Link>
            </div>

            {/* Mobile Episode List (Visible on Mobile/Tablet, Above Download) */}
            <div className="lg:hidden bg-gray-900/50 rounded-2xl border border-white/5 overflow-hidden mb-6">
                <div className="p-4 bg-white/5 border-b border-white/5">
                   <h3 className="font-bold text-white">Daftar Episode</h3>
                </div>
                <div className="max-h-[280px] overflow-y-auto custom-scrollbar overscroll-y-contain">
                   {data.info.episodeList.map((ep) => (
                      <Link 
                        key={ep.episodeId}
                        to={`/watch/${ep.episodeId}`}
                        className={`flex items-center gap-3 p-3 hover:bg-white/5 border-b border-white/5 transition-all ${
                           episode === ep.episodeId ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                      >
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            episode === ep.episodeId ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                         }`}>
                            {ep.eps}
                         </div>
                         <p className={`text-sm font-medium line-clamp-1 ${
                            episode === ep.episodeId ? 'text-primary' : 'text-gray-300'
                         }`}>
                            Episode {ep.eps}
                         </p>
                      </Link>
                   ))}
                </div>
            </div>

            {/* Download Links (Accordion) */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-6">Download Episode</h3>
                <div className="space-y-3">
                   {data.downloadUrl.qualities.map((quality) => (
                      <div key={quality.title} className="bg-black/20 rounded-xl overflow-hidden border border-white/5 transition-all">
                         <button 
                            onClick={() => toggleDownloadQuality(quality.title)}
                            className={`w-full flex items-center justify-between p-4 transition-colors ${
                               openDownloadQuality === quality.title ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
                            }`}
                         >
                            <span className="font-bold text-sm text-primary flex items-center gap-2">
                               {quality.title} 
                               <span className="text-gray-500 text-[10px] font-normal px-2 py-0.5 bg-white/5 rounded-full">
                                  {quality.size}
                               </span>
                            </span>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDownloadQuality === quality.title ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                         </button>
                         
                         {/* Dropdown Content */}
                         <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                            openDownloadQuality === quality.title ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                         }`}>
                             <div className="flex flex-wrap gap-2 p-4 border-t border-white/5 bg-black/10">
                                {quality.urls.map((dl) => (
                                   <a 
                                      key={dl.title} 
                                      href={dl.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="px-4 py-2 bg-gray-800 hover:bg-green-600 hover:text-white text-xs font-bold rounded-lg transition-all border border-white/5 hover:border-green-500 shadow-sm hover:shadow-green-500/20"
                                   >
                                      {dl.title}
                                   </a>
                                ))}
                             </div>
                         </div>
                      </div>
                   ))}
                </div>
            </div>
          </div>

          {/* Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-[30%]">
             <div className="sticky top-24 bg-gray-900/50 rounded-2xl border border-white/5 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
                <div className="p-4 bg-white/5 border-b border-white/5 flex-shrink-0">
                   <h3 className="font-bold text-white">Daftar Episode</h3>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-grow overscroll-y-contain">
                   {data.info.episodeList.map((ep) => (
                      <Link 
                        key={ep.episodeId}
                        to={`/watch/${ep.episodeId}`}
                        className={`flex items-center gap-3 p-3 hover:bg-white/5 border-b border-white/5 transition-all ${
                           episode === ep.episodeId ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                      >
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            episode === ep.episodeId ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'
                         }`}>
                            {ep.eps}
                         </div>
                         <p className={`text-sm font-medium line-clamp-1 ${
                            episode === ep.episodeId ? 'text-primary' : 'text-gray-300'
                         }`}>
                            Episode {ep.eps}
                         </p>
                      </Link>
                   ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Watch;