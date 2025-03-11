import React from 'react';
import { FadeLoader } from 'react-spinners';
import { useLoading } from './LoadingContext'; // Adjust the import path

export default function GlobalLoader() {
    const { loading } = useLoading();

    if (!loading) return null; // Render nothing if not loading

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000
        }}>
            <FadeLoader color="#dd1f25" size={150} />
        </div>
    );
}
