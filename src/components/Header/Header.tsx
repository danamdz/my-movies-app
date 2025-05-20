'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/popular', label: 'Popular' },
  { href: '/top-rated', label: 'Top Rated' },
  { href: '/now-playing', label: 'Now Playing' },
  { href: '/my-favorites', label: 'My Favorites' },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="w-full z-20 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-md relative">
      <div className="absolute left-[-60px] top-[-40px] w-64 h-32 bg-gradient-to-r from-blue-400/30 to-pink-300/10 rounded-full blur-2xl -z-10" />
      <div className="absolute right-[-60px] top-[-60px] w-60 h-32 bg-gradient-to-l from-yellow-200/40 to-pink-100/20 rounded-full blur-2xl -z-10" />
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow"
        >
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            viewBox="0 0 40 40"
            stroke="currentColor"
          >
            <rect width="40" height="40" rx="10" fill="url(#grad)" />
            <path
              d="M12 28l8-16 8 16"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="0.5" stopColor="#ec4899" />
                <stop offset="1" stopColor="#fde68a" />
              </linearGradient>
            </defs>
          </svg>
          MoviesDB
        </Link>
        <nav className="flex gap-1 sm:gap-3 md:gap-6">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'relative px-4 py-2 rounded-full font-semibold text-sm transition-all duration-150',
                  active
                    ? 'bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-400 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                )}
                style={{
                  boxShadow: active
                    ? '0 2px 16px 0 rgba(60,132,247,0.08)'
                    : undefined,
                }}
              >
                {label}
                {active && (
                  <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-500 rounded-full shadow" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
