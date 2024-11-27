import React from 'react';
import Sidebar from '../components/sidebar/sidebar.jsx';
import Appbar from '../components/appbar/appbar.jsx';

const Home = () => {
    return ( 
        <>
            <Appbar />
            <main>
                <Sidebar />
                <h1>Rota Home</h1>
            </main>
            
        </>
     );
}
 
export default Home;