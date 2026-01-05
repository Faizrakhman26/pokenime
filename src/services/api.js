import axios from 'axios';

// Ganti URL ini dengan URL API backend Anda yang sebenarnya
const BASE_URL = 'https://www.sankavollerei.com/anime'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const animeService = {
  // 1. Home
  getHome: () => api.get('/home'),

  // 2. Jadwal Rilis Anime
  getSchedule: () => api.get('/schedule'),

  // 3. Detail Lengkap Anime
  getAnimeDetail: (id) => api.get(`/anime/${id}`),

  // 4. Anime Tamat (Completed) per halaman
  getCompletedAnime: (page = 1) => api.get(`/complete-anime?page=${page}`),

  // 5. Anime Sedang Tayang (Ongoing)
  getOngoingAnime: (page = 1) => api.get(`/ongoing-anime?page=${page}`),

  // 6. Daftar Semua Genre
  getAllGenres: () => api.get('/genre'),

  // 7. Daftar Anime Berdasarkan Genre
  getAnimeByGenre: (genreId, page = 1) => api.get(`/genre/${genreId}?page=${page}`),

  // 8. Detail Link Nonton per Episode
  getWatchEpisode: (episodeId) => api.get(`/episode/${episodeId}`),

  // 9. Pencarian Anime
  searchAnime: (query) => api.get(`/search/${query}`),

  // 10. Download Batch Anime
  getBatchAnime: (batchId) => api.get(`/batch/${batchId}`),

  // 11. Ambil URL Stream Server (Jika terpisah dari detail episode)
  getServerStream: (serverId) => api.get(`/server/${serverId}`),

  // 12. All Anime (Directory)
  getAllAnimeDirectory: () => api.get('/unlimited'),
};

export default api;
