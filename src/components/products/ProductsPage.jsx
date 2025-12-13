import React, { useState, useEffect } from 'react';
import { getAllProducts, addToCart as addToCartApi } from '../../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from './ProductCard.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import ProductSummary from './ProductSummary.jsx';

function ProductsPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🛍️ ProductsPage: Starting to fetch products...');
      const response = await getAllProducts();
      console.log('🛍️ ProductsPage: API response:', response);
      console.log('🛍️ ProductsPage: Response data:', response.data);
      
      // Backend returns { success: true, data: products }
      const products = response.data || [];
      console.log('🛍️ ProductsPage: Products to display:', products);
      console.log('🛍️ ProductsPage: Number of products:', products.length);
      
      setProducts(products);
      setError(null);
    } catch (err) {
      console.error('🛍️ ProductsPage: Error fetching products:', err);
      console.error('🛍️ ProductsPage: Error details:', err.response?.data || err.message);
      setError('Failed to load products from backend. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user || !token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      console.log('🛒 Adding to cart:', product._id);
      const result = await addToCartApi(product._id, 1);
      console.log('✅ Add to cart result:', result);
      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error('❌ Add to cart error:', err);
      const errorMsg = err?.message || err?.response?.data?.message || 'Could not add to cart';
      alert(errorMsg);
    }
  };

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.type === selectedCategory
  );

  if (loading) return <LoadingState />;

  if (error) return <ErrorState error={error} onRetry={fetchProducts} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-quality biogas systems and organic fertilizers for sustainable agriculture
          </p>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          products={products}
        />

        {filteredProducts.length === 0 ? (
          <EmptyState
            selectedCategory={selectedCategory}
            onViewAll={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}

        {products.length > 0 && <ProductSummary products={products} />}
      </div>
    </div>
  );
}

export default ProductsPage;
