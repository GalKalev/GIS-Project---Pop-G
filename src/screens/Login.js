import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { loginUser, setEmail, setOriginCountry, setIsAdmin } from '../features/user/userSlice';
import { openModal, closeModal, successful, unsuccessful, setMessage } from '../features/modal/modalSlice';
import { setBasic, setComp, setId } from '../features/favorites/favoritesSlice'

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

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function Login() {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    const validateInputs = async () => {

        const email = document.getElementById('email');
        const password = document.getElementById('password');
        if (email || password) {

            let isValid = true;

            if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
                setEmailError(true);
                setEmailErrorMessage('Please enter a valid email address.');
                isValid = false;
            } else {
                setEmailError(false);
                setEmailErrorMessage('');
            }

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

            if (isValid) {
                try {
                    const user = { email: email.value, password: password.value };

                    // Dispatch loginUser and wait for the result
                    const res = await dispatch(loginUser(user));
                    console.log(res.payload)

                    // Check if the action was successful
                    if (res.type === "/login/fulfilled") {
                        console.log(2)

                        dispatch(successful());
                        dispatch(setMessage('Login successful, redirecting to home page'));
                        dispatch(openModal());
                        console.log(3)

                        // Set other user info
                        dispatch(setEmail(user.email));
                        dispatch(setIsAdmin(res.payload.isAdmin));
                        dispatch(setOriginCountry(res.payload.originCountry));
                        // dispatch(setId(res.payload.favorites.id))
                        dispatch(setBasic(res.payload.basicFavorites))
                        dispatch(setComp(res.payload.compareFavorites))

                        setTimeout(() => {
                            dispatch(closeModal());
                            navigate("/"); // Go to Home page
                            navigate(0);
                        }, 2000);
                    } else {
                        dispatch(unsuccessful());
                        dispatch(setMessage(res.payload || 'Login failed. Please try again.'));
                        dispatch(openModal());
                    }
                } catch (e) {
                    dispatch(unsuccessful());
                    dispatch(setMessage('An error occurred, please try again later'));
                    dispatch(openModal());
                }

            }
        } else {
            const confirmed = window.confirm('empty');
        }

    };

  
    return (
        <React.Fragment>
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Login
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
                        <FormControl>
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
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                sx={{ ariaLabel: 'email' }}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <FormLabel htmlFor="password">Password</FormLabel>
                            </Box>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Login
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don't have an account?
                            <span>
                                <Link

                                    variant="body2"
                                    onClick={() => navigate('/register')}
                                    sx={{ alignSelf: 'center' }}
                                >
                                    register
                                </Link>
                            </span>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </React.Fragment>
    );
}
