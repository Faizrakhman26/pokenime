import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { animeService } from '../../../services/api';
import AnimeCard from '../../../components/AnimeCard';
import SEO from '../../../components/SEO';

const AnimeDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      setLoading(true);
      try {
        const response = await animeService.getAnimeDetail(id);
        if (response.data.ok) {
          setData(response.data.data);
        } else {
          setError('Data anime tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal mengambil detail anime');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
    // Scroll ke atas saat pindah halaman
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
        <p className="text-red-500 font-bold mb-2">Error</p>
        <p>{error}</p>
        <Link to="/" className="text-blue-400 mt-4 inline-block hover:underline">Kembali ke Home</Link>
      </div>
    </div>
  );

  // Construct description from synopsis
  const synopsisText = data.synopsis?.paragraphs?.[0] || `Nonton anime ${data.title} subtitle Indonesia gratis.`;
  const seoDescription = `Tonton anime ${data.title} episode terbaru subtitle Indonesia. Sinopsis: ${synopsisText}`.substring(0, 160) + '...';

  // Schema Markup (JSON-LD) for Google Rich Snippets
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": data.title,
    "image": data.poster,
    "description": synopsisText,
    "genre": data.genreList.map(g => g.title),
    "startDate": data.aired, // Pastikan format tanggal sesuai jika memungkinkan, tapi string juga oke
    "numberOfEpisodes": data.episodeList?.length,
    "productionCompany": {
      "@type": "Organization",
      "name": data.studios
    },
    "aggregateRating": data.score ? {
      "@type": "AggregateRating",
      "ratingValue": data.score,
      "bestRating": "10",
      "ratingCount": "100" // Placeholder count karena API tidak menyediakan jumlah vote
    } : undefined
  };

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <SEO 
        title={`Nonton ${data.title} Sub Indo`} 
        description={seoDescription} 
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      {/* Background Banner Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={data.poster} 
          alt={`Background Banner ${data.title}`} 
          className="w-full h-full object-cover opacity-10 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Info & Poster */}
        <div className="grid grid-cols-[120px_1fr] md:grid-cols-[280px_1fr] gap-4 md:gap-12 mb-8 md:mb-12">
          {/* Poster Column */}
          <div className="flex flex-col gap-4">
             <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[3/4]">
                <img 
                  src={data.poster} 
                  alt={`Poster Anime ${data.title}`} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 text-black font-black text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-lg shadow-xl flex items-center gap-1">
                  ⭐ {data.score || '-'}
                </div>
             </div>
             {data.batch && (
                <Link to={`/batch/${data.batch.batchId}`} className="hidden md:flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(22,163,74,0.4)]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Batch
                </Link>
             )}
          </div>

          {/* Content Column */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight tracking-tight">
              Nonton {data.title} Sub Indo
            </h1>
            <p className="text-xs md:text-lg text-gray-400 mb-4 md:mb-6 font-medium italic line-clamp-2 md:line-clamp-none">
              {data.japanese}
            </p>

            {/* Desktop Info Grid */}
            <div className="hidden md:grid grid-cols-2 gap-x-12 gap-y-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 mb-8">
               <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Status</span>
                    <span className="text-gray-200 text-sm font-semibold">{data.status}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Studio</span>
                    <span className="text-gray-200 text-sm font-semibold">{data.studios}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Rilis</span>
                    <span className="text-gray-200 text-sm font-semibold">{data.aired}</span>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Tipe</span>
                    <span className="text-gray-200 text-sm font-semibold">{data.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Durasi</span>
                    <span className="text-gray-200 text-sm font-semibold">{data.duration}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Produser</span>
                    <span className="text-gray-200 text-sm font-semibold truncate ml-4" title={data.producers}>{data.producers}</span>
                  </div>
               </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {data.genreList.map((genre) => (
                <Link 
                  key={genre.genreId} 
                  to={`/genres/${genre.genreId}`}
                  className="px-3 py-1 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-[10px] md:text-xs font-bold rounded-lg transition-all"
                >
                  {genre.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Info Grid (Full Width below Poster & Title) */}
          <div className="md:hidden col-span-2 grid grid-cols-1 gap-y-3 bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 mt-2">
             <div className="flex justify-between items-center text-xs">
                <span className="text-primary font-bold uppercase tracking-wider">Status</span>
                <span className="text-gray-200 font-medium">{data.status}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-primary font-bold uppercase tracking-wider">Studio</span>
                <span className="text-gray-200 font-medium">{data.studios}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-primary font-bold uppercase tracking-wider">Tipe</span>
                <span className="text-gray-200 font-medium">{data.type}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-primary font-bold uppercase tracking-wider">Durasi</span>
                <span className="text-gray-200 font-medium">{data.duration}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-primary font-bold uppercase tracking-wider">Rilis</span>
                <span className="text-gray-200 font-medium">{data.aired}</span>
             </div>
             <div className="flex flex-col gap-1 text-xs pt-2 border-t border-white/5">
                <span className="text-primary font-bold uppercase tracking-wider">Produser</span>
                <span className="text-gray-400 leading-tight italic">{data.producers}</span>
             </div>
          </div>
        </div>

        {/* Batch Button Mobile Only */}
        {data.batch && (
           <Link to={`/batch/${data.batch.batchId}`} className="md:hidden flex items-center justify-center gap-2 mb-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
               Download Batch Anime
           </Link>
        )}

        {/* Synopsis & SEO Content */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-3 border-l-4 border-primary pl-3">
            Sinopsis Anime {data.title}
          </h2>
          <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
             {/* SEO Boilerplate Paragraph */}
             <p className="text-gray-400">
                Sedang mencari link <strong>nonton anime {data.title} sub indo</strong> gratis? Anda berada di tempat yang tepat. 
                Pokenime menyediakan layanan streaming anime <strong>{data.title}</strong> dengan kualitas resolusi lengkap mulai dari HD 1080p, 720p, hingga paket hemat 480p dan 360p.
                Simak sinopsis lengkap, jadwal rilis, dan daftar episode terbaru di bawah ini.
             </p>
             
             {/* Actual API Synopsis */}
             {data.synopsis.paragraphs.length > 0 ? (
                data.synopsis.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                ))
             ) : (
                <p className="italic text-gray-500">Sinopsis tidak tersedia.</p>
             )}
          </div>
        </div>

        {/* Episode List */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white border-l-4 border-primary pl-4">
               Link Nonton {data.title} Sub Indo
            </h2>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              {data.episodeList?.length || 0} Episode
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[320px] sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0 pb-2 custom-scrollbar">
             {data.episodeList && data.episodeList.length > 0 ? (
                data.episodeList.map((ep) => (
                   <Link 
                      key={ep.episodeId}
                      to={`/watch/${ep.episodeId}`}
                      className="group flex items-center gap-3 p-3 bg-gray-800/40 hover:bg-primary/10 rounded-xl transition-all border border-white/5 hover:border-primary/30"
                   >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-black group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                         {ep.eps}
                      </div>
                      <div className="flex-grow min-w-0">
                         <span className="text-xs font-bold text-gray-200 group-hover:text-white line-clamp-1 uppercase tracking-tight">
                            Episode {ep.eps}
                         </span>
                         <span className="block text-[10px] text-gray-500 font-medium">{ep.date}</span>
                      </div>
                      <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity pr-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                         </svg>
                      </div>
                   </Link>
                ))
             ) : (
                <div className="col-span-full text-center py-10 text-gray-500 bg-gray-800/30 rounded-2xl border border-dashed border-white/10">
                   Belum ada episode yang tersedia.
                </div>
             )}
          </div>
        </div>

        {/* Recommendations */}
        {data.recommendedAnimeList && data.recommendedAnimeList.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">Rekomendasi Anime</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {data.recommendedAnimeList.map((anime) => (
                 <AnimeCard key={anime.animeId} anime={anime} type="recommendation" />
               ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default AnimeDetail;
