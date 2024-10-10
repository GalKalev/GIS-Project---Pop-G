import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/ProfileForm.css';
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import AdminPage from '../screens/AdminPage'; // Adjust the path based on your folder structure
import { AdminIcon } from '../global/icons';

const ProfileForm = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Simulate user authentication
  const initialUser = {
    email: 'john.doe@example.com',
    name: 'John',
    surname: 'Doe',
    originCountry: 'United States',
    phone: '050-5555555',
  };

  const [user, setUser] = useState(initialUser);
  const [editField, setEditField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleEditClick = (field) => {
    setEditField(field);
    setEditedValue(user[field]);
  };

  const handleSaveClick = () => {
    setUser({ ...user, [editField]: editedValue });
    setEditField(null);
  };

  const handleCancelClick = () => {
    setEditField(null);
  };

  const handleChange = (e) => {
    setEditedValue(e.target.value);
  };

  const handleLogoutClick = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      console.log('User logged out.');
      setUser(null); // Clear user data
      localStorage.removeItem('authToken'); // Example: Clear authentication token
      navigate('/', { replace: true }); // Redirect to home page
    } else {
      console.log('Logout canceled.');
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    navigate('/favorite'); // Navigate to Favorites screen
  };

  const handleAdminClick = () => {
    navigate('/admin'); // Navigate to the Admin screen
  };

  // If user data is null (user is logged out), show a message or redirect
  if (!user) {
    return <h2>No user information available. Please log in.</h2>;
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <h2 className="greeting">Hello, {user.name}!</h2> {/* Personalized greeting */}
      {['email', 'name', 'surname', 'originCountry', 'phone'].map((field) => (
        <div className="profile-info" key={field}>
          <strong>{capitalizeFirstLetter(field)}:</strong>
          {editField === field ? (
            <>
              <input type="text" value={editedValue} onChange={handleChange} />
              <button className="save-button" onClick={handleSaveClick}>Save</button>
              <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
            </>
          ) : (
            <>
              <p>{user[field]}</p>
              <button onClick={() => handleEditClick(field)}>
                <EditIcon /> Edit
              </button>
            </>
          )}
        </div>
      ))}
      <div className="action-container">
        <button
          className={`go-favorite-button ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Go to Favorites"
        >
          Go to Favorites
          <ArrowRightSharpIcon />
        </button>

        <button
          className="admin-button"
          onClick={handleAdminClick}
          aria-label="Admin"
        >
          Admin
          <AdminIcon />
        </button>

        <button className="logout-button" onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>
    </div>
  );
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ProfileForm;
