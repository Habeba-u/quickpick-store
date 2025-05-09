import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/CategorySection.css';
import ProductCard from '../components/ProductCard';

function CategorySection() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    organic: false,
    fresh: false,
    seasonal: false,
    locallyGrown: false,
    discounted: false,
    clearance: false,
    priceRange: [0, 1000],
  });
  const [sortOption, setSortOption] = useState('relevancy');

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const token = localStorage.getItem('token');
        const categoriesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/categories`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoriesData = await categoriesResponse.json();
        const visibleCategories = categoriesData.filter(category => category.visibility);
        setCategories(visibleCategories);

        // Fetch products
        const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: token ? undefined : 'include',
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find the current category based on the id
  const currentCategory = categories.find((cat) => cat.id === parseInt(id));
  const categoryName = currentCategory ? currentCategory.name : 'Category';

  // Filter products by category
  useEffect(() => {
    if (categories.length === 0 || !currentCategory) return;

    const categoryProducts = products.filter(
      (product) => product.category && product.category.name === categoryName
    );
    setFilteredProducts(categoryProducts);

    // Calculate price range
    const prices = categoryProducts.map((product) => parseFloat(product.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

    setFilters((prev) => ({
      ...prev,
      priceRange: [minPrice, maxPrice],
    }));
  }, [categories, currentCategory, products, categoryName]);

  const handleFilterToggle = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  const applyFilters = () => {
    let filtered = [...products].filter(
      (product) => product.category && product.category.name === categoryName
    );

    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    if (filters.organic) {
      filtered = filtered.filter((product) => product.organic === true);
    }
    if (filters.fresh) {
      // Placeholder for future implementation
    }
    if (filters.seasonal) {
      // Placeholder
    }
    if (filters.locallyGrown) {
      // Placeholder
    }
    if (filters.discounted) {
      // Placeholder
    }
    if (filters.clearance) {
      // Placeholder
    }

    if (sortOption === 'priceLowToHigh') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === 'priceHighToLow') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOption === 'newest') {
      // Placeholder
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    applyFilters();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p>Error loading data: {error}</p>
      </Container>
    );
  }

  return (
    <div className="category-page">
      <Container className="py-5">
        <div className="breadcrumb mb-2">
          <Link to="/categories" className="breadcrumb-link">
            Categories
          </Link>
          <span className="breadcrumb-separator"> / </span>
          <span>{categoryName}</span>
        </div>

        <Row>
          <Col md={3} className="mb-4">
            <h3 className="filter-title">Filter By</h3>
            <div className="filter-buttons mb-3">
              <Button
                variant={filters.organic ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('organic')}
              >
                Organic
              </Button>
              <Button
                variant={filters.fresh ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('fresh')}
              >
                Fresh
              </Button>
              <Button
                variant={filters.seasonal ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('seasonal')}
              >
                Seasonal
              </Button>
              <Button
                variant={filters.locallyGrown ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('locallyGrown')}
              >
                Locally Grown
              </Button>
              <Button
                variant={filters.discounted ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('discounted')}
              >
                Discounted
              </Button>
              <Button
                variant={filters.clearance ? 'success' : 'outline-dark'}
                className="filter-btn me-2 mb-2"
                onClick={() => handleFilterToggle('clearance')}
              >
                Clearance
              </Button>
            </div>

            <div className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <div className="d-flex justify-content-between mb-2">
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handlePriceRangeChange([parseFloat(e.target.value), filters.priceRange[1]])
                  }
                  min={filters.priceRange[0]}
                  max={filters.priceRange[1]}
                  className="price-input"
                />
                <span className="mx-2">-</span>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange([filters.priceRange[0], parseFloat(e.target.value)])
                  }
                  min={filters.priceRange[0]}
                  max={filters.priceRange[1]}
                  className="price-input"
                />
              </div>
              <Slider
                range
                min={filters.priceRange[0]}
                max={filters.priceRange[1]}
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#28a745' }]}
                handleStyle={[
                  { backgroundColor: '#28a745', borderColor: '#28a745' },
                  { backgroundColor: '#28a745', borderColor: '#28a745' },
                ]}
                railStyle={{ backgroundColor: '#dee2e6' }}
              />
            </div>

            <Button variant="success" onClick={applyFilters} className="apply-filters-btn">
              Apply Filters
            </Button>
          </Col>

          <Col md={9}>
            <h2 className="category-title mb-3">{categoryName}</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="sort-label">Sort by:</div>
              <Form.Select
                value={sortOption}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="relevancy">Relevancy</option>
                <option value="newest">Newest</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
              </Form.Select>
            </div>

            <Row>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col md={4} key={product.id} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No products found for this category.</p>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CategorySection;
