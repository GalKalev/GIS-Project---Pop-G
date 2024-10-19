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
import AdminPage from './screens/AdminPage';
import { useSelector } from 'react-redux';
import ServerResModal from './components/ServerResModal';


// Check if user logged in to access this routes
const UserRoute = ({ element }) => {
  const { id } = useSelector((store) => store.user)

  return id ? element : <Navigate to="/login" />;
}

// Checks if the user is admin to enter this route
const AdminRoute = ({ element }) => {
  const { isAdmin } = useSelector((store) => store.user)

  return isAdmin ? element : <Navigate to="/" />;
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
        <Route path="/admin" element={<AdminRoute element={<AdminPage />}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
