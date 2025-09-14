import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  DollarSign
} from 'lucide-react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/lessons', label: 'Lessons', icon: BookOpen },
    { href: '/budget', label: 'Budget', icon: BarChart3 },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Budgetly</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    router.pathname === item.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.first_name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      router.pathname === item.href
                        ? 'text-primary-600 bg-primary-100'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Welcome, {user.first_name}!
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-left text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-base font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

