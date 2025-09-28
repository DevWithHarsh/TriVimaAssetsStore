import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1d24] text-white border-t border-gray-700">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#3dd68c] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xl">3D</span>
              </div>
              <span className="text-xl font-bold">3D Assets Store</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your premier destination for high-quality 3D assets, models, and game-ready content. 
              Join over 50,000+ creators building amazing projects.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { icon: 'discord', href: '#' },
                { icon: 'twitter', href: '#' },
                { icon: 'facebook', href: '#' },
                { icon: 'youtube', href: '#' },
                { icon: 'instagram', href: '#' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className="w-10 h-10 bg-[#2a2d35] hover:bg-[#3dd68c] hover:text-black rounded-lg flex items-center justify-center transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#3dd68c]">Products</h3>
            <ul className="space-y-3">
              {[
                'Unity Assets',
                'Unreal Engine',
                'Blender Models', 
                '3D Characters',
                'Environments',
                'Animations'
              ].map((item) => (
                <li key={item}>
                  <Link to="/categories" className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#3dd68c]">Community</h3>
            <ul className="space-y-3">
              {[
                'Discord Server',
                'Forum',
                'Blog',
                'Tutorials',
                'Asset Requests',
                'Creator Program'
              ].map((item) => (
                <li key={item}>
                  <Link to="/community" className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#3dd68c]">Resources</h3>
            <ul className="space-y-3">
              {[
                { text: 'Help Center', link: '/help' },
                { text: 'Contact Support', link: '/contact' },
                { text: 'API Documentation', link: '/api-docs' },
                { text: 'Asset Guidelines', link: '/guidelines' },
                { text: 'License Terms', link: '/license' },
                { text: 'Refund Policy', link: '/refunds' }
              ].map((item) => (
                <li key={item.text}>
                  <Link to={item.link} className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '50,000+', label: 'Active Creators' },
              { number: '10,000+', label: '3D Assets' },
              { number: '500+', label: 'Asset Packs' },
              { number: '1M+', label: 'Downloads' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#3dd68c] mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-[#151820]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-6">
              <p className="text-gray-400 text-sm">
                © 2025 3D Assets Store. All rights reserved.
              </p>
              
              {/* Legal Links */}
              <div className="flex items-center gap-4 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="text-gray-400 hover:text-[#3dd68c] transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Get weekly updates:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-[#2a2d35] border border-gray-600 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3dd68c] w-40"
                />
                <button className="bg-[#3dd68c] text-black px-4 py-2 rounded-r-lg font-semibold text-sm hover:bg-[#2bc77a] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <div className="w-64 h-64 bg-gradient-to-tl from-[#3dd68c] to-transparent rounded-full"></div>
      </div>
    </footer>
  );
};

export default Footer;