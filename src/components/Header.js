import React from 'react'

const Header = ({ text }) => {
    return (
        <div style={{textAlign:'center', fontSize:40, margin:10}}>
            {text}
        </div>
    )
}

export default Header