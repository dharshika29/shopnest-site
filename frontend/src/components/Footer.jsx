import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center text-white mb-6">
              <div className="bg-indigo-500 text-white p-2 rounded-xl mr-3 shadow-lg shadow-indigo-500/20">
                <ShoppingBag size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">ShopNest</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Discover the finest collection of premium products carefully curated for your lifestyle. Experience shopping like never before.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold">
                IG
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Home</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>My Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Customer Service</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Contact Us</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>Returns & Exchanges</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 text-indigo-400 mt-0.5" />
                <span>123 Commerce St, Tech City<br />TC 10010, Country</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-indigo-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-indigo-400" />
                <span>support@shopnest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
