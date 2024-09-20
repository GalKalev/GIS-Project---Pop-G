import React from 'react'

const Footer = () => {
  return (
    <div style={{display:'flex',backgroundColor:'black', alignItems:'center', justifyContent:'center', flexDirection:'column', marginTop:'10px', padding:'10px'}}>
        <p style={{color:'white'}}>@2024</p>
        <a style={{color:'white'}} href='https://github.com/GalKalev/GIS-Project---Pop-G'>about</a>
        <a style={{color:'white'}} href='https://github.com/GalKalev/GIS-Project---Pop-G'>contact us</a>
    </div>
  )
}

export default Footer