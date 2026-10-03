import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthProvider';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                color: '#171717',
                border: '1px solid #DDD9D0',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#2F5D50', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#C65D3B', secondary: '#FFFFFF' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}