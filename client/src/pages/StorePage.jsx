import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCloudDrizzle } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './StorePage.css';

const CATEGORY_MAP = {
  'Women': ['Tops', 'Dresses', 'Tshirts', 'Jeans', 'Shirts', 'Skirts', 'Sarees', 'Kurtas', 'Lehanga Choli', 'Gopi Dresses'],
  'Men': ['Tshirts', 'Shirts', 'Trousers', 'Jeans', 'Sweatshirts', 'Shorts', 'Jackets', 'Dhoti Kurta Sets', 'Blazers', 'Suits', 'Sherwani'],
  'Girls': ['Dresses', 'Tshirts', 'Kurta Sets', 'Tops', 'Lehanga Choli', 'Gopi Dresses', 'Jeans', 'Co-Ords'],
  'Boys': ['Tshirts', 'Shirts', 'Jeans', 'Sweatshirts', 'Shorts', 'Jackets', 'Dhoti Kurta Sets']
};
const ALL_CATEGORIES = Array.from(new Set(Object.values(CATEGORY_MAP).flat()));

const GENDERS = ['Men', 'Women', 'Boys', 'Girls'];
const AGE_GROUPS = ['Kids (2-12)', 'Teens (13-19)', 'Adults (20+)'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true, gender: true, age: false, size: true, price: true, rating: false,
  });

  // Filter state from URL params
  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    ageGroup: searchParams.get('ageGroup') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: searchParams.get('page') || '1',
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });
      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    if (key !== 'page') {
      newParams.set('page', '1'); // Reset to page 1 for other filter changes
    }
    
    setSearchParams(newParams);
  };

  const toggleFilterValue = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const idx = current.indexOf(value);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(value);
    }
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, current.filter(Boolean).join(','));

    // Smart auto-selection/deselection for age groups based on gender context
    if (key === 'gender') {
      if (idx === -1) {
        if (value === 'Women' || value === 'Men') {
          const ages = filters.ageGroup ? filters.ageGroup.split(',') : [];
          if (!ages.includes('Adults (20+)')) newParams.set('ageGroup', [...ages, 'Adults (20+)'].filter(Boolean).join(','));
        } else if (value === 'Boys' || value === 'Girls') {
          const ages = filters.ageGroup ? filters.ageGroup.split(',') : [];
          if (!ages.includes('Kids (2-12)')) newParams.set('ageGroup', [...ages, 'Kids (2-12)'].filter(Boolean).join(','));
        }
      } else {
        const remaining = current.filter(Boolean);
        const ages = filters.ageGroup ? filters.ageGroup.split(',') : [];
        if (value === 'Women' || value === 'Men') {
          if (!remaining.includes('Women') && !remaining.includes('Men') && ages.includes('Adults (20+)')) {
            const newAges = ages.filter(a => a !== 'Adults (20+)');
            if (newAges.length > 0) newParams.set('ageGroup', newAges.join(','));
            else newParams.delete('ageGroup');
          }
        } else if (value === 'Boys' || value === 'Girls') {
          if (!remaining.includes('Boys') && !remaining.includes('Girls') && ages.includes('Kids (2-12)')) {
            const newAges = ages.filter(a => a !== 'Kids (2-12)');
            if (newAges.length > 0) newParams.set('ageGroup', newAges.join(','));
            else newParams.delete('ageGroup');
          }
        }
      }
    }

    if (current.length === 0) newParams.delete(key);
    newParams.set('page', '1'); // Reset to page 1
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({ sort: filters.sort });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = filters.category || filters.gender || filters.ageGroup || filters.size || filters.minPrice || filters.maxPrice || filters.minRating || filters.search;

  const isChecked = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    return current.includes(value);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="filter-section">
      <button className="filter-section__header" onClick={() => toggleSection(sectionKey)}>
        <span>{title}</span>
        {expandedSections[sectionKey] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
      </button>
      {expandedSections[sectionKey] && (
        <div className="filter-section__body">{children}</div>
      )}
    </div>
  );

  return (
    <div className="store page-container">
      <div className="container">
        {/* Header */}
        <div className="store__header">
          <div>
            <h1 className="section-title">
              {filters.search ? `Results for "${filters.search}"` : 'Our Collection'}
            </h1>
            <p className="section-subtitle">{pagination.total} products found</p>
          </div>
          <div className="store__header-actions">
            <select
              className="input-field store__sort"
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button className="btn btn-secondary store__filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
              <FiFilter size={18} /> Filters
            </button>
          </div>
        </div>

        <div className="store__layout">
          {/* Sidebar Filters */}
          <aside className={`store__filters ${mobileFiltersOpen ? 'store__filters--open' : ''}`}>
            <div className="store__filters-header">
              <h3>Filters</h3>
              <div className="store__filters-header-actions">
                {hasActiveFilters && (
                  <button className="btn btn-ghost btn-sm" onClick={clearAllFilters}>Clear All</button>
                )}
                <button className="store__filters-close" onClick={() => setMobileFiltersOpen(false)}>
                  <FiX size={22} />
                </button>
              </div>
            </div>

            {/* Category */}
            <FilterSection title="Category" sectionKey="category">
              {(filters.gender ? Array.from(new Set(filters.gender.split(',').flatMap(g => CATEGORY_MAP[g] || []))) : ALL_CATEGORIES).map((cat) => (
                <label key={cat} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('category', cat)}
                    onChange={() => toggleFilterValue('category', cat)}
                  />
                  <span className="filter-checkbox__custom" />
                  <span>{cat}</span>
                </label>
              ))}
            </FilterSection>

            {/* Gender */}
            <FilterSection title="Gender" sectionKey="gender">
              {GENDERS.map((g) => (
                <label key={g} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('gender', g)}
                    onChange={() => toggleFilterValue('gender', g)}
                  />
                  <span className="filter-checkbox__custom" />
                  <span>{g}</span>
                </label>
              ))}
            </FilterSection>

            {/* Age */}
            <FilterSection title="Age Group" sectionKey="age">
              {AGE_GROUPS.map((age) => (
                <label key={age} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={isChecked('ageGroup', age)}
                    onChange={() => toggleFilterValue('ageGroup', age)}
                  />
                  <span className="filter-checkbox__custom" />
                  <span>{age}</span>
                </label>
              ))}
            </FilterSection>

            {/* Size */}
            <FilterSection title="Size" sectionKey="size">
              <div className="filter-sizes">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`filter-size-btn ${isChecked('size', s) ? 'filter-size-btn--active' : ''}`}
                    onClick={() => toggleFilterValue('size', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Price */}
            <FilterSection title="Price Range" sectionKey="price">
              <div className="filter-price">
                <input
                  type="number"
                  placeholder="Min ₹"
                  className="input-field filter-price__input"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  className="input-field filter-price__input"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimum Rating" sectionKey="rating">
              <div className="filter-rating-btns">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    className={`filter-rating-btn ${filters.minRating === String(r) ? 'filter-rating-btn--active' : ''}`}
                    onClick={() => updateFilter('minRating', filters.minRating === String(r) ? '' : String(r))}
                  >
                    {r}★ & above
                  </button>
                ))}
              </div>
            </FilterSection>
          </aside>

          {/* Mobile overlay */}
          {mobileFiltersOpen && <div className="store__filters-overlay" onClick={() => setMobileFiltersOpen(false)} />}

          {/* Products Grid */}
          <main className="store__products">
            {loading ? (
              <Loader size="lg" text="Finding beautiful clothes..." />
            ) : products.length === 0 ? (
              <div className="store__empty">
                <FiCloudDrizzle className="store__empty-icon" />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearAllFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="store__pagination">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`store__page-btn ${pagination.page === pageNum ? 'store__page-btn--active' : ''}`}
                        onClick={() => updateFilter('page', String(pageNum))}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
