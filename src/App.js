import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './screens/HomePage';
import StatsPage from './screens/StatsPage';
import CompCountriesPage from './screens/CompCountriesPage';
import FavoritePage from './screens/FavoritePage';
import Footer from './components/Footer';

function App() {
  return (
 
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compCountries" element={<CompCountriesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/favorite" element={<FavoritePage />} />
        </Routes>
        <Footer />
      </Router>
 
  );
}

export default App;
