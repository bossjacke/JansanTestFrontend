import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../api.js';
import SmokeDemo from '../smoke/SmokeDemo.jsx';



function Home() {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeaturedProducts = async () => {
			try {
				console.log('🏠 Home: Starting to fetch featured products...');
				const response = await getAllProducts();
				console.log('🏠 Home: API response:', response);
				console.log('🏠 Home: Response data:', response.data);
				
				// Show first 3 products as featured
				const products = response.data || [];
				console.log('🏠 Home: Products to display:', products);
				console.log('🏠 Home: Featured products (first 3):', products.slice(0, 3));
				
				setFeaturedProducts(products.slice(0, 3));
			} catch (error) {
				console.error('🏠 Home: Error fetching featured products:', error);
				console.error('🏠 Home: Error details:', error.response?.data || error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchFeaturedProducts();
	}, []);

	return (

		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
			<div style={{ position: 'relative', minHeight: '100vh' }}>
				<div style={{ position: 'relative', zIndex: 1 }}>
 					<SmokeDemo />
					{/* Hero Section */}
					<div className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 opacity-90"></div>
						<div className="absolute inset-0 bg-black/20"></div>
						<div className="relative px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
							<div className="max-w-7xl mx-auto text-center">
								<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
									Welcome to Adams Fire Eco Solutions
								</h1>
								<p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
									Your trusted partner for sustainable biogas systems and premium organic fertilizers
								</p>
								<div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
									<Link
										to="/products"
										className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300"
									>
										<span className="flex items-center gap-2">
											🛒 Shop Now
											<svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</span>
									</Link>
									<Link
										to="/about"
										className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-white/30"
									>
										<span className="flex items-center gap-2">
											📖 Learn More
											<svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</span>
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Features Section */}
					<div className="py-20 lg:py-24 bg-white">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-16">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
									Why Choose Adams Fire ?
								</h2>
								<p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover what makes us the preferred choice for sustainable solutions <p className='text-green-600'><strong>Green path--global growth</strong></p> </p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
								<div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 border border-green-100">
									<div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
									<div className="relative z-10">
										<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											🌱
										</div>
										<h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-700 transition-colors duration-300">100% Organic</h3>
										<p className="text-gray-600 leading-relaxed">All our fertilizers are certified organic and safe for sustainable farming practices</p>
									</div>
								</div>
								<div className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 border border-orange-100">
									<div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
									<div className="relative z-10">
										<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											🔥
										</div>
										<h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Efficient Biogas</h3>
										<p className="text-gray-600 leading-relaxed">High-quality biogas systems with excellent warranty and comprehensive support</p>
									</div>
								</div>
								<div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 border border-blue-100">
									<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
									<div className="relative z-10">
										<div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300">
											🚚
										</div>
										<h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-700 transition-colors duration-300">Fast Delivery</h3>
										<p className="text-gray-600 leading-relaxed">Quick and reliable delivery service across all regions with real-time tracking</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Featured Products */}
					<div className="py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-16">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
									Featured Products
								</h2>
								<p className="text-xl text-gray-600 max-w-2xl mx-auto">Check out our most popular biogas systems and premium fertilizers</p>
							</div>

							{loading ? (
								<div className="text-center py-16">
									<div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-spin">
										<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
										</svg>
									</div>
									<p className="text-xl text-gray-600 animate-pulse">Loading featured products...</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
									{featuredProducts.map((product, index) => (
										<div key={product._id} className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100">
											<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
											<div className="p-6 lg:p-8">
												<div className="flex justify-between items-start mb-6">
													<h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
														{product.name}
													</h3>
													<span className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${product.type === 'biogas'
															? 'bg-gradient-to-r from-orange-500 to-red-500'
															: 'bg-gradient-to-r from-green-500 to-emerald-500'
														}`}>
														{product.type === 'biogas' ? '🔥 Biogas' : '🌱 Fertilizer'}
													</span>
												</div>

												{product.description && (
													<p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
												)}

												<div className="mb-6 space-y-2">
													{product.capacity && (
														<div className="flex items-center text-sm text-gray-500">
															<svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
															Capacity: {product.capacity}
														</div>
													)}
													{product.warrantyPeriod && (
														<div className="flex items-center text-sm text-gray-500">
															<svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
															Warranty: {product.warrantyPeriod}
														</div>
													)}
												</div>

												<div className="flex justify-between items-center">
													<div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
														₹{product.price.toLocaleString('en-IN')}
													</div>
													<Link
														to="/products"
														className="group/btn relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300"
													>
														<span className="flex items-center gap-2">
															View Details
															<svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
															</svg>
														</span>
													</Link>
												</div>
											</div>
										</div>
									))}
								</div>
							)}

							{!loading && featuredProducts.length === 0 && (
								<div className="text-center py-16">
									<div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
										<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
										</svg>
									</div>
									<p className="text-xl text-gray-600 mb-6">No featured products available at the moment.</p>
									<Link to="/products" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300">
										View All Products
									</Link>
								</div>
							)}

							{featuredProducts.length > 0 && (
								<div className="text-center mt-16">
									<Link to="/products" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300">
										<span className="flex items-center gap-3 text-lg text-gray-600">
											View All Products
											<svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</span>
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* CTA Section */}
					<div className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
						<div className="absolute inset-0 bg-black/10"></div>
						<div className="relative py-20 lg:py-24">
							<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
									Ready to Go Green ?
								</h2>
								<p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
									Join thousands of satisfied customers who have switched to sustainable solutions
								</p>
								<div className="flex flex-col sm:flex-row gap-6 justify-center">
									<Link
										to="/products"
										className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-300"
									>
										<span className="flex items-center gap-2">
											🛒 Browse Products
											<svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
											</svg>
										</span>
									</Link>
									<Link
										to="/register"
										className="group relative inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-white/30"
									>
										<span className="flex items-center gap-2">
											👤 Create Account
											<svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
											</svg>
										</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
