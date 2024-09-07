import React from 'react'
import logo from '../assets/pop-g-logo.png'
import { Box } from '@mui/material'

function Logo({ style }) {
    return (
        <Box
            component="img"
            sx={style}
            src={logo}
            alt="Logo"
        />
    )
}

export default Logo