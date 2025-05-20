"use client";

import React, { useEffect, useState } from "react";
import { getNowPlayingMovies } from "@/services/movies/getNowPlayingMovies";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const shimmer =
  "bg-gradient-to-r from-blue-100 via-indigo-100 to-cyan-100 animate-pulse";

const NowPlayingMovies = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 900)); // Small delay for shimmer
      try {
        const data = await getNowPlayingMovies();
        setMovies(data.results);
      } catch (err) {
        console.error("Error loading now playing movies: ", err);
      }
      setLoading(false);
    };

    fetchNowPlayingMovies();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#111c29] via-[#18365a] to-[#1e254b] pb-20 overflow-hidden">
      {/* Decorative blue blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/25 to-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 drop-shadow text-center tracking-tight">
          🎟️ Now Playing
        </h2>
        {loading && (
          <div className="mb-8 flex flex-wrap gap-8 justify-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`${shimmer} w-44 md:w-48 h-72 rounded-2xl`}
              />
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {!loading &&
            movies?.map((movie) => (
              <Link
                key={movie.id}
                href={{
                  pathname: `/movie/${movie.id}`,
                  query: { from: "now-playing" },
                }}
                className="group hover:scale-[1.045] transition-transform duration-150"
              >
                <div className="relative">
                  <MovieCard
                    title={movie.title}
                    voteAverage={movie.vote_average}
                    posterPath={movie.poster_path}
                    releaseYear={parseInt(
                      movie.release_date?.substring(0, 4) || "0"
                    )}
                    description={movie.overview}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 shadow text-xs font-bold text-blue-600 group-hover:scale-110 transition">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {movie.release_date?.substring(0, 4)}
                  </div>
                </div>
              </Link>
            ))}
        </div>
        {!loading && movies?.length === 0 && (
          <div className="text-center text-gray-400 py-24 text-lg">
            No hay películas en cartelera para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};

export default NowPlayingMovies;