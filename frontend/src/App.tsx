import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// Pages
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

// Components
import Layout from './components/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/my-properties" element={<MyPropertiesPage />} />
              <Route path="/create-property" element={<CreatePropertyPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/booking/:propertyId" element={<BookingDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chat/:userId" element={<ChatPage />} />
            </Routes>
          </Layout>
        </Router>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
