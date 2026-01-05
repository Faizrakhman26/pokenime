import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { animeService } from '../../../services/api';

const Batch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      setLoading(true);
      try {
        const response = await animeService.getBatchAnime(id);
        if (response.data.ok) {
          setData(response.data.data);
        } else {
          setError('Data batch tidak ditemukan');
        }
      } catch (err) {
        setError('Gagal memuat halaman batch');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
    window.scrollTo(0, 0);
  }, [id]);

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
    <div className="pt-24 pb-20 min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6 overflow-hidden whitespace-nowrap">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        <Link to={`/anime/${data.animeId}`} className="hover:text-primary transition line-clamp-1">Detail Anime</Link>
        <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        <span className="text-gray-300 truncate">Download Batch</span>
      </div>

      <div className="bg-gray-900/50 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        
        {/* Info Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center bg-white/5">
           <div className="flex-shrink-0 w-32 md:w-40 mx-auto md:mx-0 rounded-lg overflow-hidden shadow-lg border border-white/10">
              <img src={data.poster} alt={data.title} className="w-full h-full object-cover" />
           </div>
           <div className="flex-grow text-center md:text-left">
              <h1 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight">{data.title}</h1>
              <p className="text-sm text-gray-400 italic mb-4">{data.japanese}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 text-[10px] md:text-xs text-gray-300">
                 <span className="bg-black/30 px-2 py-1 rounded border border-white/10">{data.type}</span>
                 <span className="bg-black/30 px-2 py-1 rounded border border-white/10">{data.episodes} Episode</span>
                 <span className="bg-black/30 px-2 py-1 rounded border border-white/10">{data.duration}</span>
                 <span className="bg-black/30 px-2 py-1 rounded border border-white/10">⭐ {data.score}</span>
              </div>
           </div>
        </div>

        {/* Download Section */}
        <div className="p-6 md:p-8">
           <h2 className="text-lg font-bold text-white mb-6 border-l-4 border-green-500 pl-4">
              Link Download Batch
           </h2>

           <div className="space-y-6">
              {data.downloadUrl.formats.map((format, idx) => (
                 <div key={idx} className="bg-black/20 rounded-xl overflow-hidden border border-white/5">
                    <div className="p-3 bg-white/5 font-bold text-sm text-center md:text-left text-gray-200 border-b border-white/5">
                       {format.title}
                    </div>
                    <div className="p-4 space-y-4">
                       {format.qualities.map((quality, qIdx) => (
                          <div key={qIdx} className="flex flex-col md:flex-row md:items-center gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                             <div className="w-full md:w-32 flex-shrink-0 flex justify-between md:block">
                                <span className="text-xs font-bold text-primary">{quality.title}</span>
                                <span className="text-[10px] text-gray-500 block">{quality.size}</span>
                             </div>
                             <div className="flex flex-wrap gap-2 flex-grow">
                                {quality.urls.map((dl, uIdx) => (
                                   <a 
                                      key={uIdx} 
                                      href={dl.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-gray-800 hover:bg-green-600/20 hover:text-green-500 text-[10px] font-bold rounded-lg transition-all border border-transparent hover:border-green-500/30 flex-grow md:flex-grow-0 text-center"
                                   >
                                      {dl.title}
                                   </a>
                                ))}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Batch;
