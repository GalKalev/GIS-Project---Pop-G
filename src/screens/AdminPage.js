import React, { useEffect, useState } from 'react';
import { getCountriesList } from '../global/consts'; // Import the function to fetch countries
import '../styles/AdminPage.css';

const AdminPage = () => {
    const [countries, setCountries] = useState([]); // State for storing country list
    const [users, setUsers] = useState([]); // State for storing user list
    const [blockedCountries, setBlockedCountries] = useState([]); // State for storing blocked countries
    const [selectedCountry, setSelectedCountry] = useState(null); // State for storing selected country info for modal
    const [userToEdit, setUserToEdit] = useState(null); // State for storing user to edit
    const [newUser, setNewUser] = useState({ name: '', lastName: '', email: '', phone: '' }); // State for new user input
    const [countrySearchQuery, setCountrySearchQuery] = useState(''); // State for country search query
    const [userSearchQuery, setUserSearchQuery] = useState(''); // State for user search query

    // Fetch the country list when the component mounts
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const countries = await getCountriesList();
                const formattedCountries = countries.map(country => ({
                    name: country.properties.NAME_EN,
                    code: country.properties.WB_A3,
                }));
                setCountries(formattedCountries); // Use setCountries here
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCountries();
    }, []);

    // Mock function to fetch users (replace this with actual API call)
    const fetchUsers = async () => {
        // Simulate a delay to fetch users
        return [
            { id: 1, name: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '123-456-7890', isAdmin: 'yes' },
            { id: 2, name: 'Bob', lastName: 'Johnson', email: 'bob@example.com', phone: '098-765-4321', isAdmin: 'no' },
            // Add more mock users
        ];
    };

    // Fetch users when the component mounts
    useEffect(() => {
        const loadUsers = async () => {
            const userList = await fetchUsers();
            setUsers(userList);
        };

        loadUsers();
    }, []);

    // Function to block a country and show its information
    const blockCountry = (country) => {
        setBlockedCountries((prev) => [...prev, country.code]); // Add the country code to the blocked list
        setSelectedCountry(country); // Set the selected country to show in the modal
    };

    // Function to handle the selection from the search bar
    const handleSearchSelection = (countryName) => {
        const country = countries.find(c => c.name === countryName);
        blockCountry(country);
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedCountry(null); // Reset selected country
    };

    // Function to remove a user
    const removeUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    // Function to open the update modal
    const openUpdateModal = (user) => {
        setUserToEdit(user);
        setNewUser({ name: user.name, lastName: user.lastName, email: user.email, phone: user.phone }); // Pre-fill the form with the user's current details
    };

    // Function to update user
    const updateUser = () => {
        setUsers(users.map(user =>
            user.id === userToEdit.id ? { ...user, name: newUser.name, lastName: newUser.lastName, email: newUser.email, phone: newUser.phone } : user
        ));
        closeUpdateModal(); // Close the update modal after updating
    };

    // Function to close the update modal
    const closeUpdateModal = () => {
        setUserToEdit(null); // Reset the user to edit
    };

    // Function to handle country search query change
    const handleCountrySearchChange = (e) => {
        setCountrySearchQuery(e.target.value);
    };

    // Function to handle user search query change
    const handleUserSearchChange = (e) => {
        setUserSearchQuery(e.target.value);
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>

            {/* Users list */}
            <div className="admin-section">
                <h2>List of Users</h2>
                <div className="search-bar-container"> {/* Wrap the input in this div */}
                    <input
                        type="text"
                        className="search-bar" // Add this class for styling
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={handleUserSearchChange} // Call the function on input change
                    />
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>isAdmin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter(user =>
                                user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                            )
                            .map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.isAdmin}</td>
                                    <td>
                                        <button onClick={() => removeUser(user.id)}>Remove</button>
                                        <span style={{ margin: '0 10px' }}></span>
                                        <button onClick={() => openUpdateModal(user)}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Countries list */}
            <div className="admin-section">
                <h2>List of Countries</h2>
                <div className="search-bar-container"> {/* Wrap the input in this div */}
                    <input
                        type="text"
                        className="search-bar" // Add this class for styling
                        placeholder="Search countries..."
                        value={countrySearchQuery}
                        onChange={handleCountrySearchChange} // Call the function on input change
                    />
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ISO Code</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries
                            .filter(country =>
                                !blockedCountries.includes(country.code) &&
                                country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) // Filter based on search query
                            )
                            .map((country, index) => (
                                <tr key={index}>
                                    <td>{country.name}</td>
                                    <td>{country.code}</td>
                                    <td>
                                        <button onClick={() => blockCountry(country)}>Block</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Modal to display blocked country information */}
            {
                selectedCountry && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Blocked Country</h2>
                            <p>Name: {selectedCountry.name}</p>
                            <p>Code: {selectedCountry.code}</p>
                        </div>
                    </div>
                )
            }

            {/* Modal to update user information */}
            {
                userToEdit && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeUpdateModal}>&times;</span>
                            <h2>Update User</h2>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                            <label>Last Name:</label>
                            <input
                                type="text"
                                value={newUser.lastName}
                                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <label>Phone:</label>
                            <input
                                type="tel"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            />
                            <button onClick={updateUser}>Save</button>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AdminPage;
