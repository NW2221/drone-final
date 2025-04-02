import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import placeholder from '../images/placeholders.png';

const AboutUs = () => {
  const buttonStyle = {
    padding: '10px 20px', 
    width: '103px', // Set a fixed width for all buttons
    height: '36px', // Set a fixed height for all buttons
    backgroundColor: 'transparent',
    border: '0px solid white',
  };

  return (
    <div className='aboutus'>
    <div className='button-container'>
        {/* Button to navigate back to homepage */}
                <Link to="/"> <button style={buttonStyle} className='homepage_effect'>homepage</button></Link>
                </div>
        <h1 style={{ textAlign: 'center', color: 'white' }} className='animated-aboutus'>About Us</h1>
        <p style={{ textAlign: 'center', color: 'white', margin: '20px' }} className='animated-description'>
        Welcome to the Drone Tracking App! Our mission is to provide 
        real-time tracking of drone data to enhance 
        operations and improve decision-making.</p>

          <div style={{ marginTop: '50px' }}>
          <h3 style={{ color: 'white', margin: '5px', textAlign: 'center' }} className='animated-our_technology'>Our Technology</h3>

          <p style={{ color: 'white', margin: '5px', textAlign: 'center' }} className='animated-our_des'> 
            {/* Placeholders this will change later on */}
            Our app is built using the MERN stack, which consists of MongoDB, Express.js,
            React, and Node.js. We also use the Google Maps API to display the map and
            track the drones in real-time.
          </p>
        </div>

        {/* Team Member Display */}
        <h3 style={{ color: 'white', textAlign: 'center', margin: '50px', textDecoration: 'underline' }} className='animated-team'>Team Members</h3> 
        
        <div className = 'team-container'>
        {/* Nick Walden */}
        <div className="image-container animated-team">
        {/* Display Nick Picture */}
        <img src={placeholder} alt="Nick" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name animated-team">Nick Walden</h4>   {/* Name at the bottom */}
        

        {/* Michael Benefield */} 
        <div className="image-container team-profile-reversed animated-team-reversed">
        {/* Display Michael Picture */}
        <img src={placeholder} alt="Michael" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name team-profile-reversed animated-team-reversed">Michael Benefield</h4>   {/* Name at the bottom */}

        {/* Melanie Russell */}
        <div className="image-container animated-team">
        {/* Display Melanie Picture */}
        <img src={placeholder} alt="Melanie" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name animated-team">Melanie Russell</h4>   {/* Name at the bottom */}

        {/* Vincent Chen */}
        <div className="image-container team-profile-reversed animated-team-reversed">
        {/* Display Vincent Picture */}
        <img src={placeholder} alt="Vincent" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name team-profile-reversed animated-team-reversed">Vincent Chen</h4>   {/* Name at the bottom */}

        {/* Miranda Summers */}
        <div className="image-container animated-team">
        {/* Display Miranda Picture */}
        <img src={placeholder} alt="Miranda" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name animated-team">Miranda Summers</h4>   {/* Name at the bottom */}

        {/* George Davis */}
        <div className="image-container team-profile-reversed animated-team-reversed">
        {/* Display George Picture */}
        <img src={placeholder} alt="George" className="image-layout" />
        <div className="display-setting">
        <p className="about-member">Placeholder something something</p>   {/* Description */}
        </div></div>
        <h4 className="member_name team-profile-reversed animated-team-reversed">George Davis</h4>   {/* Name at the bottom */}
        
      </div></div>
  );
};

export default AboutUs;
