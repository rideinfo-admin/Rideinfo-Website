import { Building2, FileText, Search, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type NavbarProps = {
  currentPage: 'institutes' | 'drivers' | 'analysis';
  onNavigate: (page: 'institutes' | 'analysis') => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
  searchQuery?: string;
  title?: string;
};

export default function Navbar({
  currentPage,
  onNavigate,
  onSearch,
  showSearch = true,
  searchQuery = '',
  title
}: NavbarProps) {
  const { signOut } = useAuth();

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {title || 'Rideinfo'}
            </h1>

            <nav className="hidden md:flex gap-2">
              <button
                onClick={() => onNavigate('institutes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'institutes' || currentPage === 'drivers'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span>Institutes</span>
              </button>

              <button
                onClick={() => onNavigate('analysis')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 'analysis'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Analysis</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {showSearch && onSearch && (
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <nav className="flex gap-2">
            <button
              onClick={() => onNavigate('institutes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'institutes' || currentPage === 'drivers'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Institutes</span>
            </button>

            <button
              onClick={() => onNavigate('analysis')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'analysis'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Analysis</span>
            </button>
          </nav>

          {showSearch && onSearch && (
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
