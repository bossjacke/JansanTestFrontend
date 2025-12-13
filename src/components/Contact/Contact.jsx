import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to your backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions about our products or need help with your order? We're here to help!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">📍</div>
                                    <div>
                                        <div className="font-medium text-gray-900">Address</div>
                                        <div className="text-gray-600 text-sm">123 Eco Street, Green City, GC 12345</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">📞</div>
                                    <div>
                                        <div className="font-medium text-gray-900">Phone</div>
                                        <div className="text-gray-600 text-sm">+1 (555) 123-4567</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">✉️</div>
                                    <div>
                                        <div className="font-medium text-gray-900">Email</div>
                                        <div className="text-gray-600 text-sm">info@jansan-eco.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-medium text-gray-900">9:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-medium text-gray-900">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                            
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">✅</div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h4>
                                    <p className="text-gray-600 mb-6">
                                        Thank you for contacting us. We'll get back to you within 24 hours.
                                    </p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="How can we help you?"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            * Required fields
                                        </p>
                                        <button
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">How long does installation take?</h3>
                            <p className="text-gray-600">
                                Standard biogas unit installation typically takes 1-2 days for residential systems and 3-5 days for commercial installations.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Do you offer warranties?</h3>
                            <p className="text-gray-600">
                                Yes! All our biogas systems come with a 2-5 year warranty, and our fertilizers are guaranteed for quality.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">What areas do you serve?</h3>
                            <p className="text-gray-600">
                                We provide installation and delivery services throughout the region. Contact us to check availability in your area.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Can I get technical support?</h3>
                            <p className="text-gray-600">
                                Absolutely! We offer 24/7 technical support for all our products and provide maintenance services.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
