import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Filter, X, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, categories, settings } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchTerm, setSearchTerm] = useState<string>(queryParam);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (queryParam) setSearchTerm(queryParam);
  }, [categoryParam, queryParam]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMaxPrice(500);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && prod.category_id !== cat.id) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = prod.title.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesSku = prod.sku.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSku) return false;
      }

      // Price filter
      if (prod.price > maxPrice) return false;

      // In stock
      if (inStockOnly && prod.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.created_at || '').localeCompare(a.created_at || '');
      // default: featured first, then bestsellers
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  }, [products, categories, selectedCategory, searchTerm, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Breadcrumbs & Title */}
      <div className="border-b border-sand-200 pb-6 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900 mb-2">
          {selectedCategory === 'all'
            ? 'The Complete Collection'
            : categories.find((c) => c.slug === selectedCategory)?.name || 'Curated Department'}
        </h1>
        <p className="text-sm text-sand-700 max-w-2xl font-light">
          {selectedCategory === 'all'
            ? 'Discover our full range of timeless pieces, tested acoustic hardware, and natural fiber outerwear.'
            : categories.find((c) => c.slug === selectedCategory)?.description}
        </p>
      </div>

      {/* Top Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, keyword, or SKU..."
            className="w-full bg-white border border-sand-300 rounded-lg py-2.5 pl-10 pr-4 text-sm text-ink-900 placeholder:text-sand-400 focus:outline-none focus:border-accent-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-3" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-sand-400 hover:text-ink-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorting & Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-sand-300 rounded-lg text-sm text-ink-800 font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-sand-500 font-medium hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-sand-300 rounded-lg py-2 px-3 text-sm text-ink-800 focus:outline-none focus:border-accent-500 cursor-pointer shadow-sm"
            >
              <option value="featured">Featured & Curated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-6 rounded-xl border border-sand-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <SlidersHorizontal className="w-4 h-4 text-accent-600" />
                Refine Selection
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-sand-500 hover:text-accent-600 flex items-center gap-1 cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Department Categories */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-ink-800">
                Departments
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-ink-900 text-sand-50 font-semibold'
                      : 'text-sand-700 hover:bg-sand-50'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-ink-900 text-sand-50 font-semibold'
                          : 'text-sand-700 hover:bg-sand-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3 pt-4 border-t border-sand-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-ink-800">
                  Maximum Price
                </h4>
                <span className="text-xs font-bold text-accent-700">
                  {settings.currency_symbol}{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-ink-900 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-sand-500">
                <span>{settings.currency_symbol}50</span>
                <span>{settings.currency_symbol}500+</span>
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-4 border-t border-sand-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-ink-900 focus:ring-accent-500 h-4 w-4 accent-ink-900"
                />
                In-Stock Items Only
              </label>
            </div>
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
            <div className="w-80 bg-white h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                <h3 className="font-serif text-lg font-bold text-ink-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-ink-600" />
                </button>
              </div>

              {/* Department Categories */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-ink-800">Department</h4>
                <button
                  onClick={() => {
                    handleCategoryChange('all');
                    setMobileFiltersOpen(false);
                  }}
                  className={`block w-full text-left p-2 rounded text-xs ${
                    selectedCategory === 'all' ? 'bg-ink-900 text-white' : 'text-ink-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleCategoryChange(c.slug);
                      setMobileFiltersOpen(false);
                    }}
                    className={`block w-full text-left p-2 rounded text-xs ${
                      selectedCategory === c.slug ? 'bg-ink-900 text-white' : 'text-ink-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Max Price:</span>
                  <span>{settings.currency_symbol}{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-ink-900"
                />
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="h-4 w-4 accent-ink-900"
                  />
                  In-Stock Only
                </label>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-ink-900 text-white rounded text-xs uppercase font-semibold tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-sand-500 font-medium">
              Showing <strong className="text-ink-900">{filteredProducts.length}</strong> items
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-sand-200 text-center space-y-4">
              <h3 className="font-serif text-2xl font-bold text-ink-900">No Matching Pieces Found</h3>
              <p className="text-sm text-sand-600 max-w-md mx-auto">
                No items match your active search and filter combinations. Try loosening the price ceiling or clearing search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-ink-900 text-sand-50 hover:bg-accent-600 text-xs uppercase tracking-wider font-semibold rounded shadow-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
