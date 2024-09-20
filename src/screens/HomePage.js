import React from 'react'
import Country from '../components/Country';
import Header from '../components/Header';

const HomePage = () => {
   const text = 'Choose a country to see its details'
    return (
        <main style={{marginTop:'4px'}}>
            <Header text={text} />
             <Country/>
        </main>
    )
}

export default HomePage