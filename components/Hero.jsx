    // components/Hero.jsx

    const Hero = () => {
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
                <span className="inline-block">Таны дуртай байгууллагуудын зарласан</span>{' '}
                <span className="font-semibold text-gray-900 inline-block">хямдрал, лояалти,</span>{' '}
                <span className="font-semibold text-gray-900 inline-block">cashback, хөнглөлтийн</span>{' '}
                <span className="inline-block">мэдээллийг бүгдийг нэг доороос.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-6 sm:pt-8">
                <div className="flex items-center px-4 sm:px-5 py-2.5 bg-[#5856d6] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium whitespace-nowrap">Зөв мэдээлэл</span>
                </div>
                <div className="flex items-center px-4 sm:px-5 py-2.5 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow">
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
    };

    export default Hero;
    