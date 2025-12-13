import React from 'react';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Jansan Eco Solutions</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your trusted partner for sustainable agricultural solutions and renewable energy systems
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                At Jansan Eco Solutions, we are committed to promoting sustainable agriculture and renewable energy solutions that benefit both the environment and our customers' bottom line. We believe in creating a greener future through innovative biogas systems and organic fertilizers.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our mission is to make sustainable farming and energy solutions accessible to everyone, from small households to large agricultural operations, while maintaining the highest standards of quality and environmental responsibility.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-8 text-center">
                            <div className="text-6xl mb-4">🌱</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Sustainability First</h3>
                            <p className="text-gray-600">Every product we offer is designed with environmental impact in mind</p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-4">🔥</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Products</h3>
                        <p className="text-gray-600">
                            Premium biogas systems with excellent warranty and reliable performance
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-4">🌿</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Organic Solutions</h3>
                        <p className="text-gray-600">
                            100% organic fertilizers certified for sustainable farming practices
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Support</h3>
                        <p className="text-gray-600">
                            Professional installation, maintenance, and consultation services
                        </p>
                    </div>
                </div>

                {/* Products Section */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Product Range</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-3xl">🔥</div>
                                <h3 className="text-xl font-bold text-gray-900">Biogas Systems</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Household biogas units (1-5 cubic meters)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Commercial biogas plants (10-100 cubic meters)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Complete installation and piping</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>2-5 year warranty on all systems</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-3xl">🌱</div>
                                <h3 className="text-xl font-bold text-gray-900">Organic Fertilizers</h3>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>NPK enriched organic fertilizers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Bio-fertilizers from biogas byproducts</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Soil conditioning products</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>Crop-specific nutrient solutions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                            <div className="text-gray-600">Happy Customers</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                            <div className="text-gray-600">Biogas Installations</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                            <div className="text-gray-600">Tons of Fertilizers Sold</div>
                        </div>
                        <div className="p-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                            <div className="text-gray-600">Customer Satisfaction</div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Go Green?</h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of satisfied customers who have switched to sustainable solutions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/products" 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Browse Products
                        </a>
                        <a 
                            href="/contact" 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
