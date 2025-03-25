  // components/Footer.jsx

  const Footer = () => {
    return (
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            <div>
              <h3 className="font-bold text-lg mb-3 text-white">About Us</h3>
              <p className="text-gray-300 text-sm">
                Your trusted source for aggregated content and information.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Quick Links</h3>
              <ul className="space-y-1.5">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About</a></li>
                <li><a href="/services" className="text-gray-300 hover:text-white transition-colors text-sm">Services</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Contact Info</h3>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li>Email: info@aggregator.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Main St, City</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p className="text-sm">&copy; 2025 Aggregator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
    