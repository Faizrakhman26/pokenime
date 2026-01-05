import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from './app/(home)/index';
import AnimeDetail from './app/anime/[id]/index';
import Watch from './app/watch/[episode]/index';
import Search from './app/search/index';
import Genres from './app/genres/index';
import GenreDetail from './app/genres/[genre]/index';
import Schedule from './app/schedule/index';
import Completed from './app/completed/index';
import Ongoing from './app/ongoing/index';
import Batch from './app/batch/[id]/index';
import Directory from './app/directory/index';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/ongoing" element={<Ongoing />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genres/:genre" element={<GenreDetail />} />
            <Route path="/watch/:episode" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/batch/:id" element={<Batch />} />
            <Route path="/directory" element={<Directory />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;