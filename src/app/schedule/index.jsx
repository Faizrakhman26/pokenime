import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animeService } from '../../services/api';

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [activeDay, setActiveDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Random'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await animeService.getSchedule();
        if (response.data.ok || response.data.status === 'success') {
          const data = response.data.data;
          setScheduleData(data);
          
          // Set hari aktif otomatis ke hari ini
          const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());
          // Pastikan hari hari ini ada di data, jika tidak pilih hari pertama
          const dayExists = data.find(d => d.day.toLowerCase() === today.toLowerCase());
          setActiveDay(dayExists ? dayExists.day : data[0].day);
        }
      } catch (err) {
        setError('Gagal memuat jadwal rilis');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

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
      </div>
    </div>
  );

  const currentDayData = scheduleData.find(d => d.day === activeDay);

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Header */}
      <div className="mb-12 text-center">
         <h1 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">
            Jadwal <span className="text-primary">Update</span>
         </h1>
         <p className="text-gray-400 max-w-xl mx-auto">
            Pantau terus jadwal rilis anime favoritmu setiap harinya.
         </p>
      </div>

      {/* Day Selector (Tabs) */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {scheduleData.map((item) => (
          <button
            key={item.day}
            onClick={() => setActiveDay(item.day)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
              activeDay === item.day
              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105'
              : 'bg-gray-800 border-white/5 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {item.day}
          </button>
        ))}
      </div>

      {/* Anime List for Active Day */}
      <div className="animate-fade-in">
        {currentDayData && currentDayData.anime_list.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {currentDayData.anime_list.map((anime) => (
              <Link 
                key={anime.slug} 
                to={`/anime/${anime.slug}`}
                className="group relative block bg-gray-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                   <img 
                      src={anime.poster} 
                      alt={anime.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-3 left-3 right-3 text-center">
                      <span className="inline-block px-3 py-1 bg-primary text-[10px] font-bold rounded-full text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                         Lihat Detail
                      </span>
                   </div>
                </div>
                <div className="p-4 text-center">
                   <h3 className="text-xs font-bold text-gray-200 group-hover:text-primary transition-colors line-clamp-2 min-h-[2rem]">
                      {anime.title}
                   </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-white/10 text-gray-500">
             Tidak ada jadwal rilis untuk hari {activeDay}.
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
