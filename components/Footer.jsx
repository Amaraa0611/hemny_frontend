  // components/Footer.jsx

  const Footer = () => {
    return (
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Quick Links</h3>
              <ul className="space-y-1.5">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors text-sm">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 text-white">Follow Us</h3>
              <div className="flex flex-col space-y-2">
                <a href="https://www.facebook.com/profile.php?id=61577620083880" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm">Facebook</a>
                <a href="/buy-me-a-coffee" className="text-gray-300 hover:text-white transition-colors text-sm">Buy Me a Coffee</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
            <p className="text-sm">&copy; 2025 Aggregator. Бүх эрх хуулиар хамгаалагдсан</p>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;
    