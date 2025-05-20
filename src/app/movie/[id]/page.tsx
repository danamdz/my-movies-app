"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getMovieById } from "@/services/movies/getMovieById";
import { useFavorites } from "@/hooks/useFavorites";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";

const shimmer =
  "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse";

const MovieDetailPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [movie, setMovie] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = id && typeof id === "string" ? isFavorite(id) : false;
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchTopRatedMovies = async () => {
      try {
        const data = await getTopRatedMovies();
        setTopRated(data.results);
      } catch (err) {
        setError("Could not load top rated movies.");
      }
    };
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    fetchTopRatedMovies();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 min-h-[70vh]">
        <div className={`${shimmer} w-64 h-96 rounded-xl mb-6`} />
        <div className="flex flex-col gap-4 w-72">
          <div className={`${shimmer} h-8 rounded-md`} />
          <div className={`${shimmer} h-4 rounded-md w-2/3`} />
          <div className={`${shimmer} h-4 rounded-md w-1/2`} />
          <div className={`${shimmer} h-14 rounded-md`} />
        </div>
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!movie) return <div className="text-center">No movie found.</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#10141f] via-[#182237] to-[#070a13] pb-24">
      {/* Decorative background blob */}
      <div className="absolute left-[-100px] top-[-100px] z-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-pink-400/10 rounded-full blur-3xl" />
      {/* Movie Card */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-0 md:p-8 mt-12 flex flex-col md:flex-row gap-12 border border-white/30 relative overflow-hidden">
        {/* Poster */}
        <div className="relative z-10">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-60 sm:w-72 h-auto rounded-2xl shadow-xl border-4 border-white/40 object-cover"
            style={{ boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)" }}
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500/70 to-purple-500/60 px-4 py-1 rounded-full shadow-lg text-white font-bold text-xs tracking-widest uppercase">
            {movie.original_language && movie.original_language.toUpperCase()}
          </div>
        </div>
        {/* Details */}
        <div className="flex-1 flex flex-col gap-6 z-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3 leading-tight drop-shadow-[0_1.5px_0_rgba(0,0,0,0.09)]">
              {movie.title}
            </h1>
            <div className="flex items-center gap-5 text-gray-500 text-lg font-medium mb-4">
              <span className="bg-black/90 text-white px-2 rounded shadow-sm tracking-wide">
                {movie.release_date?.substring(0, 4)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.755 4.635 1.122 6.545z"/>
                </svg>
                <span>{movie.vote_average?.toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none"><path d="M12 8v4l3 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
                <span>{movie.runtime} min</span>
              </span>
            </div>
            <p className="text-gray-700 text-base font-medium mb-2 leading-relaxed drop-shadow-[0_1px_0_rgba(0,0,0,0.08)]">
              {movie.overview}
            </p>
            {movie.genres && (
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-blue-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            {from && (
              <div className="mt-4">
                <span className="text-xs text-gray-400">
                  Navegaste desde: <b>{from}</b>
                </span>
              </div>
            )}
          </div>
          <button
            className={`shadow-lg px-7 py-3 rounded-full font-extrabold text-lg uppercase tracking-widest transition-all duration-200 
            ${isFav
                ? "bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white hover:scale-105"
                : "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 hover:bg-gray-300 hover:scale-105"
              }`}
            onClick={() => {
              if (!id || typeof id !== "string") return;
              isFav ? removeFavorite(id) : addFavorite(id);
            }}
          >
            {isFav ? "★ Quitar de Favoritos" : "☆ Agregar a Favoritos"}
          </button>
        </div>
      </div>
      {/* Top Rated Movies Gallery */}
      {topRated.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 mt-12 flex flex-col gap-4 border border-white/30">
          <h2 className="text-2xl font-black text-gray-800 mb-5 tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-yellow-400 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.755 4.635 1.122 6.545z"/>
            </svg>
            Top Rated Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-5">
            {topRated.slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                className="bg-gradient-to-br from-pink-100 via-blue-50 to-indigo-100 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer border border-blue-200 group"
              >
                <a href={`/movie/${movie.id}`} className="block relative overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-200"
                  />
                  <div className="absolute top-2 right-2 bg-white/70 backdrop-blur px-2 py-0.5 rounded-full shadow text-xs font-bold text-blue-800">
                    ⭐ {movie.vote_average?.toFixed(1)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-2 bg-gradient-to-t from-white/90 to-transparent">
                    <h4 className="text-sm font-extrabold truncate text-gray-800">
                      {movie.title}
                    </h4>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Decorative background blobs bottom */}
      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 z-0 bg-gradient-to-br from-pink-400/20 to-violet-400/10 rounded-full blur-3xl" />
    </div>
  );
};

export default MovieDetailPage;