import React from 'react';
import { Toaster } from 'sonner';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: 'var(--color-surface)',
                    color: 'var(--color-text-0)',
                    border: '1px solid var(--color-border-0)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                },
                className: 'glass-dark',
            }}
            theme="dark"
        />
    );
};

export default ToastProvider;
