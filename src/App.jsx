import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import SplashScreen from './screens/SplashScreen'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ExploreScreen from './screens/ExploreScreen'
import { ArtworksScreen, ArtistsScreen, FavoritesScreen } from './screens/GalleryScreens'
import ArtworkDetailScreen from './screens/ArtworkDetailScreen'
import CommunityScreen from './screens/CommunityScreen'
import AdminScreen from './admin/AdminScreen'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route element={<AppShell />}>
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/explore" element={<ExploreScreen />} />
            <Route path="/artworks" element={<ArtworksScreen />} />
            <Route path="/artwork/:id" element={<ArtworkDetailScreen />} />
            <Route path="/artists" element={<ArtistsScreen />} />
            <Route path="/favorites" element={<FavoritesScreen />} />
            <Route path="/community" element={<CommunityScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
