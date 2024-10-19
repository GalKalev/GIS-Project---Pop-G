import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../styles/ProfileForm.css';
import EditIcon from '@mui/icons-material/Edit';
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import AdminPage from '../screens/AdminPage'; // Adjust the path based on your folder structure
import { AdminIcon } from '../global/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setFirstName, setLastName, setOriginCountry, setPhone, userInfo, userLogout } from '../features/user/userSlice';
import { favoriteLogout } from '../features/favorites/favoritesSlice';
import _ from 'lodash';
import { getCountriesList } from '../global/consts';
import { persistor } from '../store';

const ProfileForm = () => {
  const navigate = useNavigate(); // Hook for navigation

  const { id, email, firstName, lastName, phone, originCountry, isAdmin } = useSelector((store) => store.user)

  const [user, setUser] = useState({
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    originCountry: originCountry,
    isAdmin: isAdmin
  });
  const [editUser, setEditUser] = useState(user);
  const [editField, setEditField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const [countries, setCountries] = useState([])

  const dispatch = useDispatch();

  const getCountries = async () => {
    try {
      const countriesList = await getCountriesList()
      const countriesName = countriesList.map(country => country.properties.NAME_EN);
      setCountries(countriesName.sort());
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  useEffect(() => {
    getCountries()
  }, [])

  useEffect(() => {
    setUser({
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      originCountry: originCountry,
      isAdmin: isAdmin
    })
    setEditUser({
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      originCountry: originCountry,
      isAdmin: isAdmin
    })
  }, [email, firstName, lastName, phone, originCountry])

  const handleEditClick = (field) => {
    setEditField(field);
    setEditedValue(editUser[field]);
  };

  const handleConfirmChangeClick = () => {
    const errMessages = []
    switch (editField) {
      case ('email'):
        if (!editedValue || !/\S+@\S+\.\S+/.test(editedValue)) {
          errMessages.push('Email not correct');
        }
        break;
      case ('phone'):
        if (!editedValue || !/^\+?\d{10,15}$/.test(editedValue)) {
          errMessages.push('Phone not correct');
        }
        break;
      default:
        if (!editedValue) {
          errMessages.push('Field cannot be empty');
        }

    }
    if (errMessages.length === 0) {
      setEditUser({ ...editUser, [editField]: editedValue });
      setEditField(null);
    }
    setErrorMessage(errMessages);

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
      dispatch(userLogout())
      dispatch(favoriteLogout())
      persistor.purge()
      navigate('/', { replace: true }); // Redirect to home page
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    navigate('/favorite'); // Navigate to Favorites screen
  };

  const handleAdminClick = () => {
    navigate('/admin'); // Navigate to the Admin screen
  };

  const handleSaveEdits = async () => {

    try {
      const updateUser = { ...editUser, prevEmail: user.email }
      const res = await dispatch(userInfo(updateUser));
      if (res.type === "/info/fulfilled") {
        console.log('user info updated successfully')
        dispatch(setEmail(updateUser.email))
        dispatch(setFirstName(updateUser.firstName))
        dispatch(setLastName(updateUser.lastName))
        dispatch(setPhone(updateUser.phone))
        dispatch(setOriginCountry(updateUser.originCountry))

      }
      console.log(res.payload)
    } catch (error) {
      console.error('error updating user info: ' + error.message)
    }
  }


  return (
    <div className="profile-container">
      <h1 className='profile-header'>User Profile</h1>
      <h2 className="greeting">Hello, {user.firstName}!</h2> {/* Personalized greeting */}
      <button className='btn save-button'
        disabled={_.isEqual(user, editUser)}
        onClick={handleSaveEdits}>
        Save Changes
      </button>
      <p className='error-message' style={{ visibility: errorMessage.length > 0 ? 'visible' : 'hidden' }}>{errorMessage}</p>
      {[
        { key: 'email', title: 'Email' },
        { key: 'firstName', title: 'First Name' },
        { key: 'lastName', title: 'Last Name' },
        { key: 'originCountry', title: 'Origin Country' },
        { key: 'phone', title: 'Phone' }]
        .map((field) => (
          <div className="profile-info" key={field.key}>
            <strong>{capitalizeFirstLetter(field.title)}:</strong>
            {editField === field.key ? (
              <>
                {field.key !== 'originCountry' ? (
                  <input className="user-input" type="text" value={editedValue} onChange={handleChange} />
                ) : (
                  <select
                    className="country-select"
                    value={editUser.originCountry}  // Set selected value
                    onChange={handleChange} // Update selected value
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                )}

                <button className="btn save-button" onClick={handleConfirmChangeClick}>OK</button>
                <button className="btn cancel-button" onClick={handleCancelClick}>Cancel</button>
              </>
            ) : (
              <>
                <p>{editUser[field.key]}</p>
                <button className='btn' onClick={() => handleEditClick(field.key)}>
                  <EditIcon /> Edit
                </button>
              </>
            )}
          </div>
        ))}
      <div className="action-container">
        <button
          className={`btn go-favorite-button ${isFavorite ? 'favorite' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Go to Favorites"
        >
          Go to Favorites
          <ArrowRightSharpIcon />
        </button>

        {isAdmin &&
          <button
            className="btn admin-button"
            onClick={handleAdminClick}
            aria-label="Admin"
          >
            Admin
            <AdminIcon />
          </button>
        }


        <button className="btn logout-button" onClick={handleLogoutClick}>
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
