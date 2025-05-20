"use client";

import { useEffect, useState } from "react";
import { getNowPlayingMovies } from "@/services/movies/getNowPlayingMovies";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const shimmer =
  "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [now, pop, top] = await Promise.all([
          getNowPlayingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);
        setNowPlaying(now.results.slice(0, 4));
        setPopular(pop.results.slice(0, 4));
        setTopRated(top.results.slice(0, 4));
      } catch (e) {
        // Manejo de error opcional
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#10141f] via-[#182237] to-[#070a13]">
        <div className={`${shimmer} w-72 h-12 rounded-lg mb-10`} />
        <div className="flex gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${shimmer} w-40 h-64 rounded-2xl`} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10141f] via-[#182237] to-[#070a13] pb-20 relative">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-black mb-10 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.1)] tracking-tight text-center">
          🎬 My Movies App
        </h1>

        <Section
          title="🎟️ Now Playing"
          movies={nowPlaying}
          href="/now-playing"
          color="from-indigo-500 via-blue-500 to-cyan-400"
        />
        <Section
          title="🔥 Popular"
          movies={popular}
          href="/popular"
          color="from-pink-500 via-red-400 to-orange-300"
        />
        <Section
          title="⭐ Top Rated"
          movies={topRated}
          href="/movie/top-rated"
          color="from-yellow-400 via-amber-300 to-orange-200"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  movies,
  href,
  color,
}: {
  title: string;
  movies: any[];
  href: string;
  color: string;
}) {
  return (
    <div className="mb-14">
      <div className="flex justify-between items-end mb-5">
        <h2
          className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${color} drop-shadow`}
        >
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm font-bold uppercase tracking-widest bg-gradient-to-br from-blue-400 via-indigo-400 to-pink-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
        >
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-7">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group"
            style={{ textDecoration: "none" }}
          >
            <div className="relative">
              <MovieCard
                title={movie.title}
                voteAverage={movie.vote_average}
                posterPath={movie.poster_path}
                releaseYear={parseInt(movie.release_date?.substring(0, 4) || "0")}
                description={movie.overview}
              />
              <div className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 shadow text-xs font-bold text-blue-700 group-hover:scale-110 transition">
                ⭐ {movie.vote_average?.toFixed(1)}
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                {movie.release_date?.substring(0, 4)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}