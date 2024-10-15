import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './screens/HomePage';
import StatsPage from './screens/StatsPage';
import CompCountriesPage from './screens/CompCountriesPage';
import FavoritePage from './screens/FavoritePage';

import ProfilePage from './screens/ProfilePage';
import Login from './screens/Login';
import Register from './screens/Register';
import Footer from './components/Footer';
import AdminPage from './screens/AdminPage'; // Adjust the path based on your folder structure
import { useSelector } from 'react-redux';
import ServerResModal from './components/ServerResModal';

const UserRoute = ({ element }) => {
  const { email } = useSelector((store) => store.user)

  return email ? element : <Navigate to="/login" />;
}



function App() {
  const { isLoading } = useSelector((store) => store.user)
  if (isLoading) {
    return (<div>
      Loading...
    </div>)
  }
  return (
    <Router>
      <ServerResModal />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compCountries" element={<UserRoute element={<CompCountriesPage />} />} />
        <Route path="/stats" element={<UserRoute element={<StatsPage />} />} />
        <Route path="/favorite" element={<UserRoute element={<FavoritePage />} />} />
        <Route path="/profile" element={<UserRoute element={<ProfilePage />} />} />
        <Route path="/admin" element={<UserRoute element={<AdminPage />}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
