import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import StatsPage from './screens/StatsPage';
import CompCountriesPage from './screens/CompCountriesPage';
import FavoritePage from './screens/FavoritePage';

import ProfilePage from './screens/ProfilePage';
import Login from './screens/Login';
import Register from './screens/Register';
import Footer from './components/Footer';
import AdminPage from './screens/AdminPage'; // Adjust the path based on your folder structure



function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compCountries" element={<CompCountriesPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
