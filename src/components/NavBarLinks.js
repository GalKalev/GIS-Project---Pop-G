import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import { FavoriteIcon, StatsIcon, CompCountriesIcon } from '../global/icons';
import Logo from './Logo';
import { APP_COLOR } from '../global/consts';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../features/user/userSlice';
import {favoriteLogout} from '../features/favorites/favoritesSlice'
import { persistor } from '../store';


// Pages style
const pagesSX = {
    color: 'black',           // Icon color
    borderWidth: 3,           // Border width
    borderColor: 'black',     // Border color
    borderStyle: 'solid',     // Border style (required to show the border)
    borderRadius: 20,          // Optional: rounded corners
    padding: 1,
    marginRight: 4,


}

const pages = [
    <CompCountriesIcon key={'compCountries'} title={'Compare Countries'} fontSize='large' style={pagesSX} />,
    <StatsIcon key={'stats'} title={'Stats'} fontSize='large' style={pagesSX} />,
    <FavoriteIcon key={'favorite'} title={'Favorite'} fontSize='large' style={pagesSX} />,
]
const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { email, originCountry } = useSelector((store) => store.user)

    const dispatch = useDispatch()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);

    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        if(!email){
            navigate('/login');
        }
        

    };

    //TODO: check user before navigating
    const handleCloseNavMenu = (event) => {
        setAnchorElNav(null);


        // if (email) {
            const page = event.currentTarget.getAttribute('aria-label') || event.currentTarget.querySelector('svg')?.getAttribute('title');
            switch (page) {
                case ('Compare Countries'):
                    navigate('/compCountries');
                    break;
                case ('Stats'):
                    navigate('/stats');
                    break;
                case ('Favorite'):
                    navigate('/favorite');
                    break;
                default:

                    break;
            }
        // }

    };

    const handleCloseUserMenu = (event) => {
        setAnchorElUser(null);
        if (email) {
            const userPage = event.currentTarget.querySelector('.MuiTypography-root.MuiTypography-body1.css-1699v82-MuiTypography-root')?.textContent;
            if (userPage === 'Profile') {
                navigate('/profile')
            } else if (userPage === 'Logout') {
                const confirmed = window.confirm('Are you sure you want to log out?');
                if (confirmed) {
                    console.log('User logged out.');
                    // localStorage.removeItem('authToken'); // Example: Clear authentication token
                    dispatch(userLogout())
                    dispatch(favoriteLogout())
                    persistor.purge()
                    navigate('/', { replace: true }); // Redirect to home page
                }
            }
        }


    };

    return (
        <AppBar position="static" style={{ backgroundColor: APP_COLOR }}>
            <Container maxWidth="xl" >
                <Toolbar disableGutters>
                    <Logo style={{
                        display: { xs: 'none', md: 'flex' },
                        mr: 1,
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        marginRight: 3,
                        marginLeft: 6

                    }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
                            fontSize: '45px'
                        }}
                    >
                        POPG
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="black"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => {
                                return (
                                    <MenuItem key={page.key} onClick={handleCloseNavMenu}  >
                                        {page}{page.props.title}
                                    </MenuItem>)

                            })}
                        </Menu>
                    </Box>
                    <Logo style={{
                        display: { xs: 'flex', md: 'none' },
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        marginRight: 3,

                    }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        POPG
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'end',
                            marginRight: 4,
                        }}
                    >
                        {pages.map((page) => {
                            return (
                                <Tooltip
                                    key={page.key}
                                    title={page.props.title}
                                    arrow
                                    TransitionComponent={Fade}
                                    TransitionProps={{ timeout: 600 }}
                                    PopperProps={{
                                        sx: {
                                            '& .MuiTooltip-tooltip': {
                                                fontSize: '20px', // Adjust font size here
                                                padding: '15px',
                                                borderRadius: 2

                                            },
                                        },
                                    }}
                                >
                                    <IconButton
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minWidth: 48,
                                            textAlign: 'center',
                                            padding: 2,
                                            '& svg': {
                                                margin: 'auto', // Ensure icon takes up available space
                                                display: 'block', // Make sure SVG is displayed as a block-level element
                                            },
                                        }}
                                    >
                                        {page}
                                    </IconButton>
                                </Tooltip>
                            )
                        })}
                    </Box>
                    <Box sx={{ flexGrow: 0, marginRight: 2 }}>
                        <Tooltip
                            title="Open settings"
                            arrow
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            PopperProps={{
                                sx: {
                                    '& .MuiTooltip-tooltip': {
                                        fontSize: '20px', // Adjust font size here
                                        padding: '15px',
                                        borderRadius: 2
                                    },
                                },
                            }}
                        >
                            <IconButton onClick={handleOpenUserMenu} sx={{
                                p: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 48,
                                textAlign: 'center',
                                padding: 2,
                                '& svg': {
                                    margin: 'auto', // Ensure icon takes up available space
                                    display: 'block', // Make sure SVG is displayed as a block-level element
                                },
                            }}>
                                <PermIdentityIcon fontSize='large' sx={[pagesSX]} />
                            </IconButton>
                        </Tooltip>
                        {email &&
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
