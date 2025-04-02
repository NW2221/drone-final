import React from 'react';
import {Link} from 'react-router-dom';
import './Homepage.css';

const HomePage = () => {
  const buttonStyle = {
    borderRadius: '10px', // Slightly round edges
    padding: '15px 30px',
    width: '150px', // Set a fixed width for all buttons
    height: '50px', // Set a fixed height for all buttons
  };


  return (
    <div className='homepage'>
      <h3 style={{ textAlign: 'center', marginBottom: '-10px', fontFamily: 'Courier New' }} className='animated-welcome'>Welcome to the</h3>
      <h3 style={{ textAlign: 'center', fontFamily: 'Courier New' }} className='animated-app'>Drone Tracking App</h3>
      <div className='gap'></div> {/* Spacer between buttons */}
      <div className='button-container'>

        {/* Button to navigate to Map page */}
        <Link to="/map">
          <button style={buttonStyle} className='animated-vm buttoneffects'>
            View Map</button>
        </Link>

        <div className='gap'></div> {/* Spacer between buttons */}

        {/* Button to navigate to About Us page */}
        <Link to="/about">
          <button style={buttonStyle} className='animated-au buttoneffects'>
            About Us</button>
        </Link>

        <div className='gap'></div> {/* Spacer between buttons */}

        {/* Button to visit GitHub */}
        <a
          href="https://github.com/NW2221/Senior-Design-Project"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={buttonStyle} className='animated-gh buttoneffects'>
            GitHub</button>
        </a>
      </div>
      </div>
  );
};


export default HomePage;
