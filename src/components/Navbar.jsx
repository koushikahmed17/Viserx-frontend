import { useState, useEffect, useRef } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { getCookie, deleteCookie } from '../utils/cookies';

const Navbar = () => {
    const [ pagesDropdown, setPagesDropdown ] = useState( false );
    const [ isScrolled, setIsScrolled ] = useState( false );
    const [ isLoginModalOpen, setIsLoginModalOpen ] = useState( false );
    const [ isRegisterModalOpen, setIsRegisterModalOpen ] = useState( false );
    const [ isLoggedIn, setIsLoggedIn ] = useState( () => {
        // Check both cookie and localStorage on initial render
        if (typeof document !== 'undefined') {
            const cookieToken = getCookie( 'token' );
            const isLoggedInStorage = localStorage.getItem( 'isLoggedIn' );
            const user = localStorage.getItem( 'user' );
            const hasLogin = !!cookieToken || (isLoggedInStorage === 'true' && !!user);
            console.log( 'Initial state check - Cookie token:', cookieToken ? 'exists' : 'null', 'LocalStorage login:', isLoggedInStorage, 'User:', user ? 'exists' : 'null' );
            return hasLogin;
        }
        return false;
    } );
    const pagesRef = useRef( null );

    // Check if user is logged in - runs on mount and when dependencies change
    useEffect( () => {
        const checkLoginStatus = () => {
            const cookieToken = getCookie( 'token' );
            const isLoggedInStorage = localStorage.getItem( 'isLoggedIn' );
            const user = localStorage.getItem( 'user' );
            const hasLogin = !!cookieToken || (isLoggedInStorage === 'true' && !!user);
            console.log( 'useEffect check - Cookie:', cookieToken ? 'exists' : 'null', 'LocalStorage login:', isLoggedInStorage, 'User:', user ? 'exists' : 'null', 'HasLogin:', hasLogin, 'All cookies:', document.cookie );
            setIsLoggedIn( hasLogin );
        };

        // Check immediately
        checkLoginStatus();

        // Check again after component mounts (in case of timing issues)
        const timeout1 = setTimeout( checkLoginStatus, 50 );
        const timeout2 = setTimeout( checkLoginStatus, 200 );
        const timeout3 = setTimeout( checkLoginStatus, 500 );

        // Check periodically
        const interval = setInterval( checkLoginStatus, 1000 );

        // Check on window focus
        window.addEventListener( 'focus', checkLoginStatus );
        
        return () => {
            clearTimeout( timeout1 );
            clearTimeout( timeout2 );
            clearTimeout( timeout3 );
            clearInterval( interval );
            window.removeEventListener( 'focus', checkLoginStatus );
        };
    }, [] );

    const handleSwitchToRegister = () => {
        setIsLoginModalOpen( false );
        setIsRegisterModalOpen( true );
    };

    const handleSwitchToLogin = () => {
        setIsRegisterModalOpen( false );
        setIsLoginModalOpen( true );
    };

    const handleCloseModals = () => {
        setIsLoginModalOpen( false );
        setIsRegisterModalOpen( false );
    };

    const handleLoginSuccess = () => {
        // Update login status immediately
        setIsLoggedIn( true );
    };

    const handleLogout = () => {
        deleteCookie( 'token' );
        localStorage.removeItem( 'isLoggedIn' );
        localStorage.removeItem( 'user' );
        setIsLoggedIn( false );
        window.location.href = '/';
    };

    // Handle scroll event
    useEffect( () => {
        const handleScroll = () => {
            if ( window.scrollY > 0 ) {
                setIsScrolled( true );
            } else {
                setIsScrolled( false );
            }
        };

        window.addEventListener( 'scroll', handleScroll );
        return () => {
            window.removeEventListener( 'scroll', handleScroll );
        };
    }, [] );

    // Close dropdowns when clicking outside
    useEffect( () => {
        const handleClickOutside = ( event ) => {
            if ( pagesRef.current && !pagesRef.current.contains( event.target ) ) {
                setPagesDropdown( false );
            }
        };

        document.addEventListener( 'mousedown', handleClickOutside );
        return () => {
            document.removeEventListener( 'mousedown', handleClickOutside );
        };
    }, [] );

    return (
        <nav
            className={ `fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${ isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
                }` }
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Left side: Logo */ }
                    <div className="flex items-center flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            <svg
                                className="w-8 h-8 text-teal-600"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                {/* Stylized P/Leaf shape */ }
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-1 2v8h4v-2h-2V6h-2z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-900">PickBazar</span>
                        </div>
                    </div>

                    {/* Center: Navigation Links */ }
                    <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
                        <a
                            href="#"
                            className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                        >
                            Shops
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                        >
                            Offers
                        </a>
                        <a
                            href="#"
                            className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                        >
                            Contact
                        </a>
                        <div className="relative" ref={ pagesRef }>
                            <button
                                onClick={ () => setPagesDropdown( !pagesDropdown ) }
                                className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                            >
                                <span>Pages</span>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={ 2 }
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            { pagesDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        About Us
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        FAQ
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        Terms & Conditions
                                    </a>
                                </div>
                            ) }
                        </div>
                    </div>

                    {/* Right side: Cart and Buttons */ }
                    <div className="flex items-center space-x-4 flex-shrink-0">
                        {/* Cart Icon */ }
                        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <FiShoppingCart className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Action Buttons */ }
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Modal */ }
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseModals}
                onSwitchToRegister={handleSwitchToRegister}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* Register Modal */ }
            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={handleCloseModals}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </nav>
    );
};

export default Navbar;

