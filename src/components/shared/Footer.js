'use client'
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center">
                        <Link href="/">
                            <img
                                src="https://newhome.qodeinteractive.com/wp-content/uploads/2023/03/logo-main.png"
                                alt="New Home Logo"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              A contemporary theme we designed specifically for real estate and property showcase websites, equipped with every option, element and feature your site may need.
            </p>
            <button className="text-gray-900 text-sm font-medium hover:text-gray-700 transition-colors border-b border-gray-900 hover:border-gray-700 pb-1">
              Read more
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg mb-7 font-semibold text-gray-900">Contact us</h3>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Staten Island, NY 10314, USA
              </p>
              <p className="text-gray-600 text-sm">
                +111 222 369 45
              </p>
              <p className="text-gray-600 text-sm">
                +123 456 789 11
              </p>
              <p className="text-gray-600 text-sm">
                newhome@example.com
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7 text-gray-900">Categories</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                Recent property
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                To Sell
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                To Buy
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                To Rent
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-7 text-gray-900">Links</h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                Latest News
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                About Us
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                FAQ Page
              </a>
              <a href="#" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 ITI Minia, All Rights Reserved
            </p>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-sm">Follow us:</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Instagram
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Facebook
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Youtube
                </Link>
                <Link href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;