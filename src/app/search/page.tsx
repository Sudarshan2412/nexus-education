"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Search as SearchIcon, Users, BookOpen, Loader2 } from 'lucide-react';
import axios from 'axios';
import { CourseCard } from '@/components/courses/CourseCard';
import Link from 'next/link';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'courses' | 'people'>('courses');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (value.length >= 2) {
            handleSearch(value);
        } else {
            setResults([]);
        }
    };

    return (
        <main className="min-h-screen bg-grain bg-brand-dark">
            <Header />

            <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-brand-blue/10 rounded-xl">
                            <SearchIcon className="w-8 h-8 text-brand-blue" />
                        </div>
                        <div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold uppercase tracking-tighter text-white text-glow">
                                Search
                            </h1>
                            <p className="text-gray-400 uppercase tracking-wider text-xs mt-2">
                                Find courses and people
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Box */}
                <div className="glass-card p-8 mb-12">
                    {/* Search Type Tabs */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setSearchType('courses')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${searchType === 'courses'
                                    ? 'bg-brand-blue text-white button-glow'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Courses
                        </button>
                        <button
                            onClick={() => setSearchType('people')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${searchType === 'people'
                                    ? 'bg-brand-blue text-white button-glow'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            People
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder={`Search for ${searchType}...`}
                            className="w-full h-14 pl-14 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
                            autoFocus
                        />
                        {loading && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue animate-spin" />
                        )}
                    </div>
                </div>

                {/* Results */}
                <div>
                    {query.length >= 2 && (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-400 text-sm uppercase tracking-wider">
                                    {loading ? (
                                        'Searching...'
                                    ) : (
                                        <>
                                            <span className="text-white font-bold">{results.length}</span> {searchType} found
                                        </>
                                    )}
                                </p>
                            </div>

                            {searchType === 'courses' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((course: any) => (
                                        <CourseCard key={course.id} {...course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((user: any) => (
                                        <div key={user.id} className="glass-card p-6 hover:border-brand-blue/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue flex items-center justify-center text-2xl font-bold uppercase">
                                                    {user.name?.[0] || user.email[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white mb-1">{user.name}</h3>
                                                    <p className="text-xs text-gray-400 mb-2">{user.email}</p>
                                                    <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!loading && results.length === 0 && (
                                <div className="glass-card p-16 text-center">
                                    <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                                        No Results Found
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {query.length < 2 && (
                        <div className="glass-card p-16 text-center">
                            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                                Start Searching
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Enter at least 2 characters to search
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
