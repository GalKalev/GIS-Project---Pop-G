import React from 'react'

const Header = ({ title,text }) => {
    return (
        <div style={{textAlign:'center', margin:40}}>
            <h1 style={{fontSize:42}}>{title}</h1>
            <h3> {text}</h3>
           
        </div>
    )
}

export default Header