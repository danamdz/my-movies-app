"use client";

import React, { useEffect, useState } from "react";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const shimmer =
  "bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-200 animate-pulse";

const TopRatedMoviesPage = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // UX: breve delay
      try {
        const data = await getTopRatedMovies();
        setMovies(data.results);
      } catch (err) {
        console.error("Error loading top rated movies: ", err);
      }
      setLoading(false);
    };

    fetchTopRatedMovies();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#181811] via-[#2b2a18] to-[#4f3f14] pb-20 overflow-hidden">
      {/* Blobs de fondo dorados */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-yellow-300/25 to-amber-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/25 to-orange-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 drop-shadow text-center tracking-tight">
          ⭐ Top Rated Movies
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
                  query: { from: "top-rated" },
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
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 shadow text-xs font-bold text-yellow-600 group-hover:scale-110 transition">
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
            No hay películas top rated para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedMoviesPage;