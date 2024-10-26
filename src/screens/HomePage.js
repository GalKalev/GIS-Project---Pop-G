import React from 'react'
import Country from '../components/Country';
import Header from '../components/Header';

const HomePage = () => {
    return (
        <main style={{ marginTop: '4px' }}>
            <Header title={'Welcome to POPG!'} text={'Choose a country to see its population and GDP through out the years.'} />
            <Country />
        </main>
    )
}

export default HomePage