import axios from 'axios';
import { getCookie } from './cookies';

// API Configuration
const BASE_URL = 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create( {
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable to receive cookies from backend
    // Note: Backend must set:
    // Access-Control-Allow-Origin: http://localhost:5173 (specific origin, not *)
    // Access-Control-Allow-Credentials: true
} );

// Add request interceptor to include token in headers
apiClient.interceptors.request.use(
    ( config ) => {
        // Get token from cookie or localStorage
        const cookieToken = getCookie( 'token' );
        const localStorageToken = localStorage.getItem( 'token' );
        const token = cookieToken || localStorageToken;

        // Debug cookie reading
        if ( !token ) {
            // Since cookie is HttpOnly, we can't read it from document.cookie
            // But we need to get it from somewhere. Let's check if it was stored during login
            console.warn( '❌ No token found for API request to:', config.url );
            console.warn( 'Cookie token (HttpOnly, cannot read):', cookieToken ? 'exists' : 'null' );
            console.warn( 'LocalStorage token:', localStorageToken ? 'exists' : 'null' );

            // If no token in localStorage, the login didn't store it properly
            // The cookie is being sent automatically by browser, but backend might need Authorization header
            if ( !localStorageToken ) {
                console.error( '⚠️ Token not in localStorage! Login response should have stored it.' );
                console.error( '⚠️ Please log in again and check Network tab → Login request → Response tab' );
                console.error( '⚠️ We need to extract token from login response and store it in localStorage.' );
            }
        } else {
            // Ensure headers object exists
            if ( !config.headers ) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${ token }`;
            console.log( '✅ Adding Authorization header with token for:', config.url );
        }

        // For FormData, don't set Content-Type - axios will set it automatically with boundary
        if ( config.data instanceof FormData ) {
            // Remove Content-Type if it was set, so axios can set it with boundary
            if ( config.headers && config.headers[ 'Content-Type' ] ) {
                delete config.headers[ 'Content-Type' ];
            }
        }

        return config;
    },
    ( error ) => {
        return Promise.reject( error );
    }
);

// Add response interceptor to extract token from login response
apiClient.interceptors.response.use(
    ( response ) => {
        // Extract token from login response and store it
        if ( response.config.url?.includes( '/login' ) && response.status === 200 ) {
            console.log( '🔍🔍🔍 LOGIN RESPONSE INTERCEPTOR 🔍🔍🔍' );
            console.log( 'Response Data:', response.data );
            console.log( 'Response Headers:', response.headers );

            // Try to extract token from response
            let token = response.data?.token
                || response.data?.data?.token
                || response.data?.access_token
                || response.data?.accessToken;

            // Try to extract from Set-Cookie header
            if ( !token ) {
                const setCookie = response.headers?.[ 'set-cookie' ]
                    || response.headers?.[ 'Set-Cookie' ]
                    || response.headers?.[ 'setCookie' ];

                if ( setCookie ) {
                    const cookieArray = Array.isArray( setCookie ) ? setCookie : [ setCookie ];
                    for ( const cookie of cookieArray ) {
                        const match = cookie.match( /token=([^;]+)/ );
                        if ( match && match[ 1 ] ) {
                            token = match[ 1 ];
                            console.log( '✅ Token extracted from Set-Cookie in interceptor' );
                            break;
                        }
                    }
                }
            }

            // Store token in localStorage if found
            if ( token ) {
                localStorage.setItem( 'token', token );
                console.log( '✅✅✅ Token stored in localStorage via response interceptor!' );
            } else {
                console.warn( '⚠️ Token not found in login response interceptor' );
            }
        }
        return response;
    },
    ( error ) => {
        return Promise.reject( error );
    }
);

// API helper function
export const apiRequest = async ( endpoint, options = {} ) => {
    try {
        const response = await apiClient( {
            url: endpoint,
            ...options,
        } );

        // Check if response includes token in headers or data
        // Check various possible header names
        const token = response.data?.token
            || response.data?.data?.token
            || response.headers?.[ 'x-auth-token' ]
            || response.headers?.[ 'X-Auth-Token' ]
            || response.headers?.[ 'authorization' ]?.replace( 'Bearer ', '' )
            || response.headers?.[ 'Authorization' ]?.replace( 'Bearer ', '' )
            || response.headers?.[ 'token' ]
            || response.headers?.[ 'Token' ];

        return { data: response.data, error: null, token, headers: response.headers };
    } catch ( error ) {
        // Handle axios errors
        const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';
        return { data: null, error: errorMessage };
    }
};

// Register API
export const registerUser = async ( userData ) => {
    return apiRequest( '/api/v1/register', {
        method: 'POST',
        data: userData,
    } );
};

// Login API
export const loginUser = async ( credentials ) => {
    console.log( '🔵 loginUser function called with:', { email: credentials.email } );
    try {
        console.log( '🔵 Making axios request to /api/v1/login...' );
        // Make direct axios call to get full response object
        const response = await apiClient( {
            url: '/api/v1/login',
            method: 'POST',
            data: credentials,
        } );

        console.log( '🔵 Axios request completed!' );
        console.log( '🔍 Raw Login Response Object:', response );
        console.log( '🔍 Response Status:', response.status );
        console.log( '🔍 Response Data:', JSON.stringify( response.data, null, 2 ) );
        console.log( '🔍 Response Headers:', response.headers );
        console.log( '🔍 Set-Cookie Header:', response.headers?.[ 'set-cookie' ] );
        console.log( '🔍 All Header Keys:', Object.keys( response.headers || {} ) );

        // Extract token from multiple possible locations
        // Priority: response body first (most common), then headers
        let token = response.data?.token                    // { token: "..." }
            || response.data?.data?.token                   // { data: { token: "..." } }
            || response.data?.access_token                  // { access_token: "..." }
            || response.data?.accessToken                   // { accessToken: "..." }
            || response.data?.auth?.token                   // { auth: { token: "..." } }
            || response.data?.user?.token                   // { user: { token: "..." } }
            || response.headers?.[ 'x-auth-token' ]         // Header: x-auth-token
            || response.headers?.[ 'X-Auth-Token' ]         // Header: X-Auth-Token
            || response.headers?.[ 'authorization' ]?.replace( 'Bearer ', '' )  // Header: authorization
            || response.headers?.[ 'Authorization' ]?.replace( 'Bearer ', '' )   // Header: Authorization
            || response.headers?.[ 'token' ]                // Header: token
            || response.headers?.[ 'Token' ];               // Header: Token

        // Try to extract from Set-Cookie header (if cookie is being set)
        // Note: Set-Cookie headers might not be accessible due to CORS, but we'll try
        if ( !token ) {
            // Try different header name variations
            const setCookieHeaders = response.headers?.[ 'set-cookie' ]
                || response.headers?.[ 'Set-Cookie' ]
                || response.headers?.[ 'setCookie' ];

            if ( setCookieHeaders ) {
                const cookieArray = Array.isArray( setCookieHeaders )
                    ? setCookieHeaders
                    : [ setCookieHeaders ];

                console.log( '🔍 Trying to extract from Set-Cookie headers:', cookieArray );

                for ( const cookieString of cookieArray ) {
                    // Look for token=... in Set-Cookie header
                    const tokenMatch = cookieString.match( /token=([^;]+)/ );
                    if ( tokenMatch && tokenMatch[ 1 ] ) {
                        token = tokenMatch[ 1 ];
                        console.log( '✅ Token extracted from Set-Cookie header' );
                        break;
                    }
                }
            }
        }

        console.log( '🔍 Extracted Token:', token ? token.substring( 0, 20 ) + '...' : 'null' );

        // If token found, store it in localStorage immediately
        if ( token ) {
            localStorage.setItem( 'token', token );
            console.log( '✅✅✅ Token stored in localStorage from login response!' );
            console.log( 'Token value:', token.substring( 0, 30 ) + '...' );
            console.log( 'Token length:', token.length );

            // Verify storage
            const verify = localStorage.getItem( 'token' );
            if ( verify === token ) {
                console.log( '✅ Token storage verified successfully!' );
            } else {
                console.error( '❌ Token storage verification failed!' );
            }
        } else {
            console.error( '❌❌❌ CRITICAL: No token found in login response!' );
            console.error( 'Response data keys:', Object.keys( response.data || {} ) );
            console.error( 'Response headers keys:', Object.keys( response.headers || {} ) );
            console.warn( '⚠️ Cookie is HttpOnly, so we cannot read it with JavaScript.' );
            console.warn( '⚠️ The backend sets token in HttpOnly cookie, but we need it in localStorage for Authorization header.' );
            console.warn( '⚠️ SOLUTION: Check Network tab → Login request → Response tab' );
            console.warn( '⚠️ If token is in response body, we will extract it. If not, backend needs to return it in response body.' );

            // Last resort: Check if response.data has any field that might contain the token
            const responseDataStr = JSON.stringify( response.data );
            if ( responseDataStr.includes( 'token' ) || responseDataStr.includes( 'Token' ) ) {
                console.warn( '⚠️ Response data contains "token" keyword. Checking all fields...' );
                // Try to find token in any nested field
                const findTokenInObject = ( obj, depth = 0 ) => {
                    if ( depth > 5 ) return null; // Prevent infinite recursion
                    if ( !obj || typeof obj !== 'object' ) return null;

                    for ( const key in obj ) {
                        if ( key.toLowerCase().includes( 'token' ) && typeof obj[ key ] === 'string' && obj[ key ].length > 20 ) {
                            return obj[ key ];
                        }
                        if ( typeof obj[ key ] === 'object' ) {
                            const found = findTokenInObject( obj[ key ], depth + 1 );
                            if ( found ) return found;
                        }
                    }
                    return null;
                };

                const foundToken = findTokenInObject( response.data );
                if ( foundToken ) {
                    token = foundToken;
                    localStorage.setItem( 'token', token );
                    console.log( '✅✅✅ Token found and stored using deep search!' );
                }
            }
        }

        return {
            data: response.data,
            error: null,
            token: token,
            headers: response.headers,
        };
    } catch ( error ) {
        console.error( '🔍 Login Error:', error );
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        return { data: null, error: errorMessage, token: null, headers: null };
    }
};

// Category APIs
export const getCategories = async () => {
    return apiRequest( '/api/v1/categories', {
        method: 'GET',
    } );
};

export const createCategory = async ( categoryData ) => {
    return apiRequest( '/api/v1/categories', {
        method: 'POST',
        data: categoryData,
    } );
};

export const updateCategory = async ( categoryId, categoryData ) => {
    return apiRequest( `/api/v1/categories/${ categoryId }`, {
        method: 'PUT',
        data: categoryData,
    } );
};

export const deleteCategory = async ( categoryId ) => {
    return apiRequest( `/api/v1/categories/${ categoryId }`, {
        method: 'DELETE',
    } );
};

// Product APIs
export const getProducts = async () => {
    return apiRequest( '/api/v1/products', {
        method: 'GET',
    } );
};

export const createProduct = async ( productData ) => {
    // Create FormData for multipart/form-data (needed for file upload)
    const formData = new FormData();
    formData.append( 'name', productData.name );
    formData.append( 'description', productData.description || '' );
    formData.append( 'price', productData.price.toString() );
    formData.append( 'category_id', productData.category_id.toString() );
    formData.append( 'stock', ( productData.stock || 0 ).toString() );

    if ( productData.image ) {
        formData.append( 'image', productData.image );
    }

    // Use axios directly for FormData - axios will set Content-Type automatically with boundary
    try {
        // Get token - check both cookie and localStorage
        const token = getCookie( 'token' ) || localStorage.getItem( 'token' );

        if ( !token ) {
            console.error( 'No authentication token found. Please login again.' );
            return { data: null, error: 'Authentication required. Please login again.' };
        }

        const response = await apiClient( {
            url: '/api/v1/products',
            method: 'POST',
            data: formData,
            // Don't set Content-Type - axios will set it automatically with boundary for FormData
            // The interceptor will add the Authorization header
        } );

        return { data: response.data, error: null };
    } catch ( error ) {
        console.error( 'Error creating product:', error );
        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || error.message
            || 'Failed to create product';
        return { data: null, error: errorMessage };
    }
};

export const updateProduct = async ( productId, productData ) => {
    // Create FormData for multipart/form-data (needed for file upload)
    const formData = new FormData();

    // Add _method: PUT for Laravel-style method spoofing (required by backend)
    formData.append( '_method', 'PUT' );

    // Add product fields
    formData.append( 'name', productData.name );
    formData.append( 'description', productData.description || '' );
    formData.append( 'price', productData.price.toString() );
    formData.append( 'category_id', productData.category_id.toString() );
    formData.append( 'stock', ( productData.stock || 0 ).toString() );

    // Add image if provided (optional for updates)
    if ( productData.image ) {
        formData.append( 'image', productData.image );
    }

    // Use axios directly for FormData - axios will set Content-Type automatically with boundary
    try {
        // Get token - check both cookie and localStorage
        const token = getCookie( 'token' ) || localStorage.getItem( 'token' );

        if ( !token ) {
            console.error( 'No authentication token found. Please login again.' );
            return { data: null, error: 'Authentication required. Please login again.' };
        }

        // Use POST method with _method: PUT in form-data (Laravel-style method spoofing)
        const response = await apiClient( {
            url: `/api/v1/products/${ productId }`,
            method: 'POST', // POST method with _method: PUT in form-data
            data: formData,
            // Don't set Content-Type - axios will set it automatically with boundary for FormData
            // The interceptor will add the Authorization header
        } );

        return { data: response.data, error: null };
    } catch ( error ) {
        console.error( 'Error updating product:', error );
        const errorMessage = error.response?.data?.message
            || error.response?.data?.error
            || error.message
            || 'Failed to update product';
        return { data: null, error: errorMessage };
    }
};

export const deleteProduct = async ( productId ) => {
    return apiRequest( `/api/v1/products/${ productId }`, {
        method: 'DELETE',
    } );
};

