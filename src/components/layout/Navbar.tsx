import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Shield,
  Package,
  LogOut,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../contexts/StoreContext';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { categories, settings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-800 hover:text-ink-950 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Left Nav - Home, Shop, Categories, About Us, Contact */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide">
            <Link
              to="/"
              className={`transition-colors hover:text-accent-600 ${
                location.pathname === '/' ? 'text-accent-600 font-semibold' : 'text-ink-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`transition-colors hover:text-accent-600 ${
                location.pathname === '/shop' ? 'text-accent-600 font-semibold' : 'text-ink-700'
              }`}
            >
              Shop
            </Link>

            {/* Categories dropdown / links */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-ink-700 hover:text-accent-600 transition-colors py-2">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-sand-500" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white border border-sand-200 rounded-lg shadow-lg py-2 hidden group-hover:block animate-fade-in z-50">
                <Link
                  to="/shop"
                  className="block px-4 py-2 text-xs font-semibold text-ink-900 hover:bg-sand-50 uppercase tracking-wider"
                >
                  All Disciplines
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop?category=${cat.slug}`}
                    className="block px-4 py-2 text-xs text-sand-700 hover:bg-sand-50 hover:text-accent-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              className={`transition-colors hover:text-accent-600 ${
                location.pathname === '/about' ? 'text-accent-600 font-semibold' : 'text-ink-700'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`transition-colors hover:text-accent-600 ${
                location.pathname === '/contact' ? 'text-accent-600 font-semibold' : 'text-ink-700'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Brand Logo Centered */}
          <div className="flex-1 lg:flex-initial text-center">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-3xl sm:text-4xl font-bold tracking-widest text-ink-900 group-hover:text-accent-700 transition-colors">
                {settings.store_name}
              </span>
              <span className="block text-[10px] tracking-[0.25em] uppercase text-sand-500 font-semibold -mt-1">
                Luxury Marketplace
              </span>
            </Link>
          </div>

          {/* Right Action Icons: Search, Wishlist, Account, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-ink-700 hover:text-accent-600 transition-colors cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account/wishlist"
              className="p-2 text-ink-700 hover:text-accent-600 transition-colors relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-ink-700 hover:text-accent-600 transition-colors focus:outline-none cursor-pointer"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-3.5 h-3.5 hidden sm:block text-ink-400" />
              </button>

              {accountDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-sand-200 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-sand-100 bg-sand-50/60">
                        <p className="text-xs text-sand-500 uppercase tracking-wider font-semibold">
                          Patron Account
                        </p>
                        <p className="text-sm font-semibold text-ink-900 truncate">
                          {profile?.full_name || user.email}
                        </p>
                        <p className="text-xs text-sand-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-semibold text-accent-700 hover:bg-accent-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-2.5 text-accent-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-sand-400" />
                        My Profile & Account
                      </Link>

                      <Link
                        to="/account/orders"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors"
                      >
                        <Package className="w-4 h-4 mr-2.5 text-sand-400" />
                        Orders & Shipments
                      </Link>

                      <Link
                        to="/claims"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-2.5 text-sand-400" />
                        Returns & Claims
                      </Link>

                      <Link
                        to="/account/wishlist"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-ink-700 hover:bg-sand-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 mr-2.5 text-sand-400" />
                        My Wishlist ({wishlistCount})
                      </Link>

                      <div className="border-t border-sand-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            signOut();
                            setAccountDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-2.5" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-sand-100">
                        <p className="text-xs text-sand-500">Welcome to {settings.store_name}</p>
                        <p className="text-sm font-semibold text-ink-900">Sign in for member orders</p>
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink-800 hover:bg-sand-50 font-medium"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-accent-700 hover:bg-accent-50 font-medium"
                      >
                        Create an Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Button with Live Item Count */}
            <Link
              to="/cart"
              className="p-2 text-ink-700 hover:text-accent-600 transition-colors relative flex items-center"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-ink-900 text-sand-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar Drawer */}
        {searchOpen && (
          <div className="py-4 border-t border-sand-200 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across genuine apparel, acoustic engineering, and home objects..."
                className="w-full bg-white border border-sand-300 rounded-full py-2.5 pl-12 pr-10 text-sm text-ink-900 placeholder:text-sand-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 shadow-sm"
                autoFocus
              />
              <Search className="w-5 h-5 text-sand-400 absolute left-4 top-3" />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-2.5 p-1 text-sand-400 hover:text-ink-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand-200 bg-sand-50 px-6 py-6 space-y-5 animate-fade-in">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-sand-500">Navigation</p>
            <Link to="/" onClick={closeMobile} className="block text-base font-medium text-ink-800 hover:text-accent-600">
              Home
            </Link>
            <Link to="/shop" onClick={closeMobile} className="block text-base font-medium text-ink-800 hover:text-accent-600">
              Shop All
            </Link>
            <Link to="/about" onClick={closeMobile} className="block text-base font-medium text-ink-800 hover:text-accent-600">
              About Us
            </Link>
            <Link to="/contact" onClick={closeMobile} className="block text-base font-medium text-ink-800 hover:text-accent-600">
              Contact Concierge
            </Link>
          </div>

          <div className="pt-4 border-t border-sand-200 space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-sand-500">Department Disciplines</p>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                onClick={closeMobile}
                className="block text-sm font-medium text-ink-800 hover:text-accent-600"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-sand-200 space-y-3">
            <p className="text-xs uppercase tracking-wider font-semibold text-sand-500">Account & Claims</p>
            <Link to="/track-order" onClick={closeMobile} className="block text-sm text-ink-700">
              Track Consignment
            </Link>
            <Link to="/returns-policy" onClick={closeMobile} className="block text-sm text-ink-700">
              Return & Replacement Policy
            </Link>
            <Link to="/claims" onClick={closeMobile} className="block text-sm text-ink-700">
              Damaged / Incorrect Claims
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={closeMobile} className="block text-sm font-semibold text-accent-700">
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
