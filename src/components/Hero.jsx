import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const Hero = () => {
    const [ searchQuery, setSearchQuery ] = useState( '' );

    const backgroundImageUrl = 'https://pickbazar-react-rest.vercel.app/_next/image?url=https%3A%2F%2Fpickbazarlaravel.s3.ap-southeast-1.amazonaws.com%2F904%2Fgrocery.png&w=3840&q=75';

    return (
        <section
            className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
            style={ {
                backgroundImage: `url(${ backgroundImageUrl })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            } }
        >
            {/* Overlay for better text readability */ }
            <div className="absolute inset-0 bg-white/70"></div>

            {/* Main Content */ }
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                {/* Main Heading */ }
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                    Groceries Delivered in 90 Minute
                </h1>

                {/* Sub-heading */ }
                <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                    Get your healthy foods & snacks delivered at your doorsteps all day everyday
                </p>

                {/* Search Bar */ }
                <div className="flex items-center justify-center max-w-2xl mx-auto">
                    <div className="flex w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search your products from here"
                            value={ searchQuery }
                            onChange={ ( e ) => setSearchQuery( e.target.value ) }
                            className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                        <button className="px-8 py-4 bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center space-x-2">
                            <HiSearch className="w-5 h-5" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

