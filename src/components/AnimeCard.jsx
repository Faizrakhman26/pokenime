import React from 'react';
import { Link } from 'react-router-dom';

const AnimeCard = ({ anime, type }) => {
  return (
    <Link to={`/anime/${anime.animeId}`} className="group relative block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={anime.poster} 
          alt={anime.title} 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
          ⭐ {anime.score || 'N/A'}
        </div>
        
        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded shadow-md">
           {type === 'ongoing' ? `Ep ${anime.episodes}` : `${anime.episodes} Eps`}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-primary transition-colors" title={anime.title}>
          {anime.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {type === 'ongoing' ? anime.releaseDay : anime.lastReleaseDate}
        </p>
      </div>
    </Link>
  );
};

export default AnimeCard;