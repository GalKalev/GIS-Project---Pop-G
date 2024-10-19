import React, { useEffect, useState } from 'react';
import { getCountriesList } from '../global/consts'; // Import the function to fetch countries
import '../styles/AdminPage.css';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BlockIcon from '@mui/icons-material/Block';
import { useDispatch } from 'react-redux';
import { openModal, setMessage, successful, unsuccessful } from '../features/modal/modalSlice';
import { URL } from '../global/consts';
import axios from 'axios';
import { IconButton } from '@mui/material';


const AdminPage = () => {
    const [countries, setCountries] = useState([]);
    const [users, setUsers] = useState([]);
    const [blockedCountries, setBlockedCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('')
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [filteredBlockedCountries, setFilteredBlockedCountries] = useState([]);

    const dispatch = useDispatch();

    const fetchCountries = async () => {
        try {
            const countriesList = await getCountriesList();
            const countriesName = countriesList.map(country => country.properties.NAME_EN);
            // setCountries(countriesName.sort()); 

            const blockedResponse = await axios.get(`${URL}admin/countries`);
            const blockedList = blockedResponse.data;
            console.log(blockedList[0].country);

            setBlockedCountries(blockedList.sort());
            setFilteredBlockedCountries(blockedList.sort())

            const blockedCountryNames = blockedList.map(item => item.country);

            // Filter out blocked countries from the countriesName
            if (blockedList.length > 0) {
                const filtered = countriesName.filter(country => {
                    return (!blockedCountryNames.includes(country))
                } // Compare with country names directly
                );
                setCountries(filtered.sort()); // Set the filtered countries
                setFilteredCountries(filtered.sort()); // Set the filtered countries
            } else {
                setFilteredCountries(countriesName); // If no blocked countries, show all
                setCountries(countriesName); // If no blocked countries, show all
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };


    // Fetch the country list when the component mounts
    useEffect(() => {

        fetchCountries();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await axios.get(`${URL}admin/users`);
            if (res.status === 200) {
                setUsers(res.data);
            } else {
                throw Error('fetching users failed')
            }

        } catch (error) {
            console.error("Failed to fetch users", error);
            dispatch(unsuccessful());
            dispatch(setMessage('Fetching users failed. Please try again.'));
            dispatch(openModal());
        }

    };
    // Fetch users when the component mounts
    useEffect(() => {
        loadUsers();
    }, []);

    // Function to block a country and show its information
    const blockCountry = async (country) => {
        try {
            console.log(country)
            const res = await axios.post(`${URL}admin/countries/add`, { country })

            if (res.status === 200) {
                fetchCountries();
            } else {
                throw Error('Error blocking country')
            }

        } catch (error) {
            console.error("Failed blocking country", error);
            dispatch(unsuccessful());
            dispatch(setMessage('Blocking country failed. Please try again.'));
            dispatch(openModal());
        }

    };

    const unblockCountry = async (country) => {
        try {
            console.log(country)
            const id = country.id
            const res = await axios.delete(`${URL}admin/countries/delete`, { params: { id } })

            if (res.status === 200) {
                fetchCountries();
            } else {
                throw Error('Error unblocking country')
            }

        } catch (error) {
            console.error("Failed unblocking country", error);
            dispatch(unsuccessful());
            dispatch(setMessage('Unblocking country failed. Please try again.'));
            dispatch(openModal());
        }

    };

    // Function to open the update modal
    const updateUserAdmin = async (user) => {
        try {
            let res;
            if (user.isAdmin) {
                res = await axios.post(`${URL}admin/users/update`, { id: user.id, isAdmin: false })
            } else {
                res = await axios.post(`${URL}admin/update`, { id: user.id, isAdmin: true })
            }
            if (res.status === 200) {
                dispatch(successful());
                dispatch(setMessage('User admin status updated successfully'));
                dispatch(openModal())
                loadUsers()

            } else {
                dispatch(unsuccessful());
                dispatch(setMessage('Error updating user admin status. Please try again.'));
                dispatch(openModal());
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }


    };



    // Function to handle country search query change
    const handleCountrySearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setCountrySearchQuery(query);

        // Filter countries based on the search query
        const filtered = countries.filter(country => country.toLowerCase().includes(query));
        setFilteredCountries(filtered);

        // Filter blocked countries based on the search query
        const filteredBlocked = blockedCountries.filter(country => country.country.toLowerCase().includes(query));
        setFilteredBlockedCountries(filteredBlocked);
    };

    // Function to handle user search query change
    const handleUserSearchChange = (e) => {
        setUserSearchQuery(e.target.value);
    };

    return (
        <div className="admin-container">
            <h1 className='admin-panel-header'>Admin Dashboard</h1>

            {/* Users list */}
            <div className="admin-section">
                <h2 className='lists-header'>List of Users</h2>
                <div className="search-bar-container"> {/* Wrap the input in this div */}
                    <input
                        type="text"
                        className="search-bar" // Add this class for styling
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={handleUserSearchChange} // Call the function on input change
                    />
                </div>
                <table className="admin-table user-table-body">
                    <thead>
                        <tr className='user-table'>
                            <th className='user-table'>ID</th>
                            <th className='user-table'>Name</th>
                            <th className='user-table'>Last Name</th>
                            <th className='user-table'>Email</th>
                            <th className='user-table'>Phone</th>
                            <th className='user-table'>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter(user =>
                                user.firstName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                            )
                            .map(user => (
                                <tr key={user.id}>
                                    <td style={{ textAlign: 'center' }}>{user.id}</td>
                                    <td style={{ textAlign: 'center' }}>{user.firstName}</td>
                                    <td style={{ textAlign: 'center' }}>{user.lastName}</td>
                                    <td style={{ textAlign: 'center' }}>{user.email}</td>
                                    <td style={{ textAlign: 'center' }}>{user.phone}</td>
                                    <td style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>{user.isAdmin ? ('Yes') : ("No")}
                                        <IconButton className='btn admin-btn'
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: 60,
                                                textAlign: 'center',
                                                padding: 2,
                                                '& svg': {
                                                    margin: 'auto',
                                                    display: 'block',
                                                },
                                            }}
                                            onClick={() => updateUserAdmin(user)}>
                                            <AdminPanelSettingsIcon
                                                sx={{
                                                    color: user.isAdmin ? 'green' : 'white',
                                                    backgroundColor: 'lightgray',
                                                    borderRadius: 20,
                                                    padding: 1,
                                                    marginRight: 4,
                                                }} />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Countries list */}
            <div className="admin-section">
                <h2 className='lists-header'>List of Countries</h2>
                <div className='add-country-container'>
                    <div className="search-bar-container"> {/* Wrap the input in this div */}
                        <input
                            type="text"
                            className="search-bar" // Add this class for styling
                            placeholder="Search countries..."
                            value={countrySearchQuery}
                            onChange={handleCountrySearchChange} // Call the function on input change
                        />
                    </div>

                </div>

                <table className="admin-table countries-table-body">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Block</th>
                        </tr>
                    </thead>
                    <tbody >
                        {/* Blocked Countries Section */}
                        {blockedCountries.length > 0 && (
                            filteredBlockedCountries.map((country, index) => (
                                <tr key={`blocked-${index}`}>
                                    <td>{country.country}</td>
                                    <td className='block-td'>
                                        <IconButton onClick={() => unblockCountry(country)}>
                                            <BlockIcon sx={{ color: 'red' }} />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))
                        )}
                        {filteredCountries.length > 0 && (
                            filteredCountries.map((country, index) => (
                                <tr key={`filtered-${index}`}>
                                    <td>{country}</td>
                                    <td className='block-td' style={{}}>
                                        <IconButton onClick={() => blockCountry(country)}>
                                            <BlockIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div >
    );
};

export default AdminPage;
