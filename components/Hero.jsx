    // components/Hero.jsx
    import React, { useState, useEffect } from 'react';
    import { FiX } from 'react-icons/fi';

    const Hero = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Show popup if user navigated directly (no referrer or not from hemny.mn)
        const ref = document.referrer;
        const isDirect = !ref || (!ref.includes('hemny.mn') && !ref.includes('localhost'));
        if (isDirect) {
        setShowPopup(true);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    // Current implementation (commented out)
    /*
    return (
        <section className="relative overflow-hidden bg-white min-h-[600px]">
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            <div className="absolute right-10 top-1/2 -translate-y-1/2 w-72 h-72 hidden lg:block">
            <div className="relative w-full h-full">
                <div className="absolute inset-0 animate-spin-slow">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.1)" 
                    strokeWidth="2"
                    />
                    <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2"
                    strokeDasharray="283"
                    strokeDashoffset="100"
                    className="transform origin-center rotate-180"
                    />
                </svg>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-20 h-20">
                    {[0, 1, 2, 3].map((index) => (
                    <div 
                        key={index}
                        className="absolute w-full h-full rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm"
                        style={{
                        animation: `coinFloat 2s ease-in-out ${index * 0.2}s infinite`,
                        top: `${index * -4}px`
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                        ₮
                        </div>
                    </div>
                    ))}
                </div>
                </div>
                <div className="absolute inset-0 animate-pulse">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path 
                    d="M20,80 Q50,20 80,80" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="2"
                    className="animate-draw"
                    />
                </svg>
                </div>
            </div>
            </div>
        </div>

        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
            <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
                <div className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 bg-[#5856d6]/10 rounded-full">
                <span className="text-sm font-medium text-[#5856d6] whitespace-nowrap">
                    Hemny-тэй хамт хэмнэе.
                </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                <span className="inline-block">Та дахиж хэзээ ч</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#5856d6] to-blue-500 text-transparent bg-clip-text inline-block">хямдрал, хөнгөлөлтийн мэдээллийг алдахгүй!</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                <span className="inline-block">Таны дуртай байгууллагуудын зарласан</span>
                <span className="font-semibold text-gray-900 inline-block">хямдрал, лояалти,</span>
                <span className="font-semibold text-gray-900 inline-block">cashback, хөнгөлөлтийн</span>
                <span className="inline-block">мэдээллийг бүгдийг нэг доороос.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-6 sm:pt-8">
                <div className="flex items-center justify-center px-4 sm:px-5 py-2.5 bg-[#5856d6] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium whitespace-nowrap">Зөв мэдээлэл</span>
                </div>
                <div className="flex items-center justify-center px-4 sm:px-5 py-2.5 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <svg className="w-5 h-5 mr-2 text-[#5856d6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                    </svg>
                    <span className="font-medium text-gray-800 whitespace-nowrap">Ухаалаг худалдан авалт</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
    */

    // Popup version
    if (!showPopup) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-2 sm:p-4">
                {/* Popup */}
                <div className="relative bg-[#8529cd] rounded-2xl shadow-2xl w-full max-w-[98vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl max-h-[98vh] overflow-hidden flex flex-col">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        aria-label="Close"
                    >
                        <FiX size={24} className="text-gray-600" />
                    </button>

                    {/* Hero content */}
                    <div className="relative flex-1 overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                            {/* Removed animated SVG circles and coins */}
                        </div>

                        <div className="relative px-3 py-6 sm:px-6 sm:py-10 md:px-10 md:py-14 lg:px-16 lg:py-20 w-full max-w-full overflow-x-hidden">
                            <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
                                <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10">
                                    <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 bg-white/20 rounded-full">
                                        <span className="text-xs sm:text-base font-medium text-white whitespace-nowrap">
                                            Hemny-тэй хамт хэмнэе.
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                                        <span className="inline-block">Та дахиж хэзээ ч</span>
                                        <br className="hidden sm:block" />
                                        <span className="bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text inline-block">хямдрал, хөнгөлөлтийн мэдээллийг алдахгүй!</span>
                                    </h2>
                                    <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed">
                                        <span className="inline-block">Таны дуртай байгууллагуудын зарласан</span>
                                        <span className="font-semibold text-white inline-block ml-1">хямдрал, лояалти,</span>
                                        <span className="font-semibold text-white inline-block ml-1">cashback, хөнгөлөлтийн</span>
                                        <span className="inline-block ml-1">мэдээллийг бүгдийг нэг доороос.</span>
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center lg:justify-start pt-6 sm:pt-8 lg:pt-10 w-full">
                                        <div className="flex items-center justify-center px-6 py-3 bg-[#ffd60a] text-[#7a5c00] font-extrabold rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 w-full sm:w-auto">
                                            <svg className="w-6 h-6 mr-3 text-[#7a5c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="font-extrabold text-lg tracking-wide">Зөв мэдээлэл</span>
                                        </div>
                                        <div className="flex items-center justify-center px-6 py-3 bg-white text-[#7a5c00] font-extrabold rounded-full shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 w-full sm:w-auto mt-2 sm:mt-0">
                                            <svg className="w-6 h-6 mr-3 text-[#7a5c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                                            </svg>
                                            <span className="font-extrabold text-lg tracking-wide">Ухаалаг худалдан авалт</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;
    