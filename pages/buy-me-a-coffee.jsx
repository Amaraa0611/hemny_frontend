import React from 'react';

const BuyMeACoffeePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-4 text-5xl">☕</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Buy Me a Coffee</h1>
        <p className="text-gray-600 mb-6">
          If you've found this platform helpful, you can support its development and maintenance by buying me a coffee. Your support is greatly appreciated and helps keep this project running!
        </p>
        <a
          href="https://www.buymeacoffee.com/your-username" // Replace with your actual Buy Me a Coffee link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-400 text-gray-800 font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Support the Project
        </a>
      </div>
    </div>
  );
};

export default BuyMeACoffeePage; 