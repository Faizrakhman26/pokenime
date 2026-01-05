import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { animeService } from '../../../services/api';
import AnimeCard from '../../../components/AnimeCard';

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

  return (
    <div className="pt-20 pb-20 min-h-screen">
      {/* Background Banner Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={data.poster} 
          alt="" 
          className="w-full h-full object-cover opacity-10 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-dark/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Info & Poster */}
        <div className="flex flex-row gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Poster */}
          <div className="flex-shrink-0 w-32 sm:w-64 md:w-72">
             <div className="relative rounded-lg overflow-hidden shadow-2xl border-2 border-white/10 aspect-[3/4]">
                <img 
                  src={data.poster} 
                  alt={data.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-yellow-500 text-black font-bold text-[10px] md:text-sm px-1.5 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg">
                  ⭐ {data.score || '-'}
                </div>
             </div>
             {data.batch && (
                <Link to={`/batch/${data.batch.batchId}`} className="hidden md:block mt-4 w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Download Batch
                </Link>
             )}
          </div>

          {/* Details */}
          <div className="flex-grow min-w-0">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1 md:mb-4 leading-tight line-clamp-3 md:line-clamp-none">{data.title}</h1>
            <h2 className="text-sm md:text-xl text-gray-400 mb-4 md:mb-6 italic line-clamp-1">{data.japanese}</h2>

            {/* Desktop Details Grid (Tersembunyi di mobile sangat kecil, atau muncul di bawah judul) */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-300 mb-8 bg-gray-800/50 p-6 rounded-xl border border-white/5">
              <p><span className="text-primary font-semibold w-24 inline-block">Status:</span> {data.status}</p>
              <p><span className="text-primary font-semibold w-24 inline-block">Studio:</span> {data.studios}</p>
              <p><span className="text-primary font-semibold w-24 inline-block">Rilis:</span> {data.aired}</p>
              <p><span className="text-primary font-semibold w-24 inline-block">Durasi:</span> {data.duration}</p>
              <p><span className="text-primary font-semibold w-24 inline-block">Tipe:</span> {data.type}</p>
              <p><span className="text-primary font-semibold w-24 inline-block">Produser:</span> {data.producers}</p>
            </div>

            {/* Mobile-only info (tampilan ringkas) */}
            <div className="flex sm:hidden flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 mb-4">
               <p><span className="text-primary font-bold">Status:</span> {data.status}</p>
               <p><span className="text-primary font-bold">Studio:</span> {data.studios}</p>
               <p><span className="text-primary font-bold">Tipe:</span> {data.type}</p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-8">
              {data.genreList.map((genre) => (
                <Link 
                  key={genre.genreId} 
                  to={`/genres/${genre.genreId}`}
                  className="px-2 py-0.5 md:px-3 md:py-1 bg-white/10 hover:bg-primary text-[10px] md:text-sm rounded-full transition-colors"
                >
                  {genre.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Button Mobile Only */}
        {data.batch && (
           <Link to={`/batch/${data.batch.batchId}`} className="md:hidden block mb-8 w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
               Download Batch Anime
           </Link>
        )}

        {/* Synopsis */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-primary pl-3">Sinopsis</h3>
          <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-4">
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
            <h3 className="text-xl font-bold text-white border-l-4 border-primary pl-4">Daftar Episode</h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              {data.episodeList?.length || 0} Episode
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
             {data.episodeList && data.episodeList.length > 0 ? (
                data.episodeList.map((ep) => (
                   <Link 
                      key={ep.episodeId}
                      to={`/watch/${ep.episodeId}`}
                      className="group flex items-center gap-3 p-2 bg-gray-800/40 hover:bg-primary/10 rounded-md transition-all border border-white/5 hover:border-primary/30"
                   >
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                         {ep.eps}
                      </div>
                      <div className="flex-grow min-w-0">
                         <span className="text-xs font-medium text-gray-200 group-hover:text-white line-clamp-1 uppercase tracking-tight">
                            Episode {ep.eps}
                         </span>
                         <span className="block text-[10px] text-gray-500">{ep.date}</span>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                         </svg>
                      </div>
                   </Link>
                ))
             ) : (
                <div className="col-span-full text-center py-10 text-gray-500 bg-gray-800/30 rounded-lg">
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
