import React, { createContext, useState, useContext } from 'react';

// Create Context
const LoadingContext = createContext();

// Provide Loading State and Functions
export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom Hook to Access Loading Context
export const useLoading = () => {
    return useContext(LoadingContext);
};
