// app/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

   import { Search, BookOpen, User, LogOut, LogIn, ChevronRight, Users } from 'lucide-react';
export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId) => {
    router.push(`/book/${bookId}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Soft gradient colors for book cards
  const gradients = [
    'from-blue-400 to-cyan-300',
    'from-purple-400 to-pink-300',
    'from-green-400 to-teal-300',
    'from-orange-400 to-yellow-300',
    'from-rose-400 to-pink-300',
    'from-indigo-400 to-blue-300',
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  return (

<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                PlabCoach Library
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-0.5">
                {user ? `Welcome, ${user.username}!` : 'Explore our collection'}
              </p>
            </div>
          </div>
          
          {/* Mobile Auth Button */}
          {!authLoading && (
            user ? (
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="sm:hidden p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )
          )}
        </div>
        
        {/* Desktop Auth Button */}
        {!authLoading && (
          user ? (
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span className="font-medium">{user.email}</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {user.role_name || 'User'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Sign Up</span>
            </button>
          )
        )}
      </div>
    </div>
  </header>

  {/* Search & Stats Section */}
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{books.length}</div>
              <div className="text-sm text-gray-600">Total Books</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-300 transition">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {new Set(books.map(b => b.author_name)).size}
              </div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-lg border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Books Grid */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    {filteredBooks.length === 0 ? (
      <div className="text-center py-12 sm:py-16">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
          {searchQuery ? 'No Books Found' : 'No Books Available'}
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          {searchQuery ? 'Try a different search term' : 'Check back later for new additions'}
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clear Search
          </button>
        )}
      </div>
    ) : (
      <>
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? 'Search Results' : 'All Books'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBooks.map((book, index) => (
            <div
              key={book.id}
              onClick={() => handleBookClick(book.id)}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 overflow-hidden group"
            >
              {/* Book Cover */}
              <div className={`h-48 sm:h-56 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all"></div>
                
                <div className="relative z-10 text-center p-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 transform group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 drop-shadow-lg">
                    {book.title}
                  </h3>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <User className="w-4 h-4" />
                    <span className="line-clamp-1 font-medium">{book.author_name}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookClick(book.id);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 group"
                >
                  <span>Read Book</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </main>

  {/* Footer */}
  <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center text-xs sm:text-sm text-gray-600">
        <p className="font-medium">© 2026 PlabCoach Library. All rights reserved.</p>
        <p className="mt-2 text-gray-500">Discover, Read, and Enjoy</p>
      </div>
    </div>
  </footer>
</div>

  );
}
