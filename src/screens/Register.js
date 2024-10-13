import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/user/userSlice';
import { useDispatch } from 'react-redux';
import { openModal, closeModal, successful, unsuccessful, setMessage } from '../features/modal/modalSlice';
import { Autocomplete } from '@mui/material';
import { getCountriesList } from '../global/consts';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const RegisterContainer = styled(Stack)(({ theme }) => ({
    padding: 20,
    marginTop: '10vh',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

const FieldWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
});

export default function Register() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [lastnameError, setLastnameError] = React.useState(false);
    const [lastnameErrorMessage, setLastnameErrorMessage] = React.useState('');
    const [originCountry, setOriginCountry] = React.useState(null);
    const [originCountryError, setOriginCountryError] = React.useState(false);
    const [originCountryErrorMessage, setOriginCountryErrorMessage] = React.useState('');
    const [telephoneError, setTelephoneError] = React.useState(false);
    const [telephoneErrorMessage, setTelephoneErrorMessage] = React.useState('');

    const [countries, setCountries] = React.useState([])

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const getCountries = async () => {
        try {
            const countriesList = await getCountriesList()
            const countriesName = countriesList.map(country => country.properties.NAME_EN);
            setCountries(countriesName.sort());
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }

    React.useEffect(() => {
        getCountries()
    }, [])


    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

    };

    const validateInputs = async () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const name = document.getElementById('name');
        const lastname = document.getElementById('lastname');
        // const originCountry = document.getElementById('originCountry');
        const telephone = document.getElementById('telephone');

        let isValid = true;

        // Email validation
        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // Password validation
        if (!password.value ||
            password.value.length < 8 ||
            password.value.length > 20 ||
            !/[a-z]/.test(password.value) || // Must contain at least one lowercase letter
            !/[A-Z]/.test(password.value) || // Must contain at least one uppercase letter
            !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be between 8-20 characters long, contain at least one uppercase letter, one lowercase letter, and one special symbol.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        // Confirm password validation
        if (password.value !== confirmPassword.value) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        // Name validation
        if (!name.value) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        // Lastname validation
        if (!lastname.value) {
            setLastnameError(true);
            setLastnameErrorMessage('Last name is required.');
            isValid = false;
        } else {
            setLastnameError(false);
            setLastnameErrorMessage('');
        }

        // Origin country validation
        if (!originCountry) {
            setOriginCountryError(true);
            setOriginCountryErrorMessage('Origin country is required.');
            isValid = false;
        } else {
            setOriginCountryError(false);
            setOriginCountryErrorMessage('');
        }

        // Telephone validation
        if (!telephone.value || !/^\+?\d{10,15}$/.test(telephone.value)) {
            setTelephoneError(true);
            setTelephoneErrorMessage('Please enter a valid telephone number.');
            isValid = false;
        } else {
            setTelephoneError(false);
            setTelephoneErrorMessage('');
        }

        if (isValid) {
            try {
                const newUser = {
                    password: password.value,
                    firstName: name.value,
                    lastName: lastname.value,
                    phone: telephone.value,
                    email: email.value,
                    isAdmin: false,
                    originCountry: originCountry
                }
                const res = await dispatch(registerUser(newUser));

                if (res.type === "/register/fulfilled") {
                    dispatch(successful());
                    dispatch(setMessage('Register successful, redirecting to login screen'));
                    dispatch(openModal());
                    setTimeout(() => {
                        dispatch(closeModal());
                        navigate(-1) // Go back to login
                    }, 2000)

                } else {
                    // If rejected, handle the error
                    dispatch(unsuccessful());
                    dispatch(setMessage(res.payload || 'Register failed. Please try again.'));
                    dispatch(openModal());
                    console.error('error registering user: ')

                }


            } catch (e) {
                console.error('error registering user: ' + e.message)
                dispatch(unsuccessful());
                dispatch(setMessage('An error occurred, please try again later'));
                dispatch(openModal());
            } finally {

            }


        }
    };

    return (
        <React.Fragment>
            <RegisterContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Register
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    error={emailError}
                                    helperText={emailErrorMessage}
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    variant="outlined"
                                    color={emailError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    required
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                <TextField
                                    error={confirmPasswordError}
                                    helperText={confirmPasswordErrorMessage}
                                    name="confirmPassword"
                                    placeholder="••••••"
                                    type="password"
                                    id="confirmPassword"
                                    required
                                    variant="outlined"
                                    color={confirmPasswordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <TextField
                                    error={nameError}
                                    helperText={nameErrorMessage}
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="John"
                                    autoComplete="name"
                                    required
                                    variant="outlined"
                                    color={nameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="lastname">Last Name</FormLabel>
                                <TextField
                                    error={lastnameError}
                                    helperText={lastnameErrorMessage}
                                    id="lastname"
                                    type="text"
                                    name="lastname"
                                    placeholder="Doe"
                                    autoComplete="lastname"
                                    required
                                    variant="outlined"
                                    color={lastnameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        {/* <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="originCountry">Origin Country</FormLabel>
                                <TextField
                                    error={originCountryError}
                                    helperText={originCountryErrorMessage}
                                    id="originCountry"
                                    type="text"
                                    name="originCountry"
                                    placeholder="Country"
                                    autoComplete="originCountry"
                                    required
                                    variant="outlined"
                                    color={originCountryError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper> */}
                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="originCountry">Origin Country</FormLabel>
                                <Autocomplete
                                    options={countries}
                                    value={originCountry}
                                    onChange={(event, newValue) => {
                                        setOriginCountry(newValue);
                                        if (!newValue) {
                                            setOriginCountryError(true);
                                            setOriginCountryErrorMessage('Origin country is required.');
                                        } else {
                                            setOriginCountryError(false);
                                            setOriginCountryErrorMessage('');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={originCountryError}
                                            helperText={originCountryErrorMessage}
                                            placeholder="Select your country"
                                            variant="outlined"
                                            color={originCountryError ? 'error' : 'primary'}
                                            required
                                        />
                                    )}
                                    freeSolo
                                />
                            </FormControl>
                        </FieldWrapper>


                        <FieldWrapper>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="telephone">Telephone</FormLabel>
                                <TextField
                                    error={telephoneError}
                                    helperText={telephoneErrorMessage}
                                    id="telephone"
                                    type="tel"
                                    name="telephone"
                                    placeholder="+1234567890"
                                    autoComplete="telephone"
                                    required
                                    variant="outlined"
                                    color={telephoneError ? 'error' : 'primary'}
                                />
                            </FormControl>
                        </FieldWrapper>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Register
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <span>
                                <Link
                                    to="/login"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Login
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                </Card>
            </RegisterContainer>
            {/* {showModal && <ServerResModal show={showModal} setShow={setShowModal} isSuccessful={isSuccessful} message={modalMessage} />} */}
        </React.Fragment>
    );
}
