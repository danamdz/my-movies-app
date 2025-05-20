"use client";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";
import { getMovieById } from "@/services/movies/getMovieById";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const shimmer =
  "bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-100 animate-pulse";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 900)); // pequeño delay UX
      const results = await Promise.all(favorites.map((id) => getMovieById(id)));
      setMovies(results);
      setLoading(false);
    };
    if (favorites.length > 0) fetchFavorites();
    else setMovies([]);
  }, [favorites]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-orange-100 pb-20 overflow-hidden">
      {/* Blobs decorativos */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-pink-300/25 to-yellow-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-yellow-400/20 to-pink-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-5xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-500 drop-shadow text-center tracking-tight">
          ❤️ My Favorites
        </h2>

        {loading && (
          <div className="mb-8 flex flex-wrap gap-8 justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${shimmer} w-44 md:w-48 h-72 rounded-2xl`}
              />
            ))}
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center text-gray-400 py-24 text-lg">
            No tienes favoritos aún.<br />
            Empieza a agregar películas que te encanten ⭐
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {!loading &&
            movies?.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
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
                  <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 shadow text-xs font-bold text-pink-600 group-hover:scale-110 transition">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-pink-500/80 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="inline-block"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656-5.656l.172.172.172-.172a4 4 0 115.656 5.656L10 15.243l-6.828-10.07z" />
                    </svg>
                    {movie.release_date?.substring(0, 4)}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}