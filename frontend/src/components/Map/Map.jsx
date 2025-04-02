import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import './Map.css';
import placeholder from '../images/plasticbottle.png';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '100%',
  margin: '0 auto',
};

const mapOptions = {
  clickableIcons: false,
};

function Map({ droneData = [] }) {
  // Add safety check to ensure droneData is an array
  const droneArray = Array.isArray(droneData) ? droneData : [];
  
  console.log('droneData received:', droneData, 'type:', typeof droneData, 'isArray:', Array.isArray(droneData));

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA7p5mTi4z_jawGdGSc9MKjWM4JLLjqYYw',
  });

  const [selectedDrone, setSelectedDrone] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapCenter, setMapCenter] = useState({ lat: 30.6944, lng: -88.0431 });

  // Function to add pins to sidebar
  const addPinToSidebar = (pin) => {
    const isDuplicate = pins.some(
      (existingPin) =>
        existingPin.gps.latitude === pin.gps.latitude &&
        existingPin.gps.longitude === pin.gps.longitude
    );

    if (!isDuplicate) {
      const newPin = { ...pin, timestamp: new Date() };
      setPins((prevPins) => [...prevPins, newPin]);

      setTimeout(() => {
        setPins((prevPins) =>
          prevPins.filter((p) => p.gps.latitude !== pin.gps.latitude || p.gps.longitude !== pin.gps.longitude)
        );
      }, 900000); // 15 minutes
    }
  };

  const getTimeDifference = (timestamp) => {
    const timeDifference = currentTime - timestamp;
    return Math.max(Math.floor(timeDifference / (1000 * 60)), 0);
  };

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return isLoaded ? (
    <div className="map-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Button to navigate to About Us page */}
        <Link to="/">
          <button style={{ marginBottom: '-150px', align: 'center' }}>
            homepage
          </button>
        </Link>

        <h2>Pin Information</h2>
        {pins.map((pin, index) => (
          <div 
            key={index} 
            className="pin-info"
            onClick={() => {
              setMapCenter({ lat: pin.gps.latitude, lng: pin.gps.longitude });
              setSelectedDrone(pin);
            }}
          >
            <div className="dronelink">
              <h3>Drone Data</h3>
              <p>Latitude: {pin.gps.latitude}</p>
              <p>Longitude: {pin.gps.longitude}</p>
              <p>Confidence: {pin.confidence}</p>
              <div className="timestamp">{getTimeDifference(pin.timestamp)} min ago</div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        options={mapOptions}
        onClick={() => setSelectedDrone(null)}
      >
        {/* Render markers from actual drone data */}
        {droneArray.map((drone) => (
          <Marker
            key={drone._id || `drone-${drone.gps.latitude}-${drone.gps.longitude}`}
            position={{ lat: drone.gps.latitude, lng: drone.gps.longitude }}
            title={`Confidence: ${drone.confidence}`}
            onClick={() => {
              setSelectedDrone(drone);
              addPinToSidebar(drone);
              setMapCenter({ lat: drone.gps.latitude, lng: drone.gps.longitude });
            }}
          />
        ))}

        {selectedDrone && (
          <InfoWindow
            position={{
              lat: selectedDrone.gps.latitude,
              lng: selectedDrone.gps.longitude,
            }}
            onCloseClick={() => setSelectedDrone(null)}
          >
            <div>
              <img src={placeholder} alt="data" className="map-image-layout" />
              <h3>Drone Information</h3>
              <p>Latitude: {selectedDrone.gps.latitude}</p>
              <p>Longitude: {selectedDrone.gps.longitude}</p>
              <p>Confidence: {selectedDrone.confidence}</p>
              <a
                className="map_buttonStyle"
                href={`https://www.google.com/maps/search/?api=1&query=${selectedDrone.gps.latitude},${selectedDrone.gps.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="map_buttonContainer">Go To</button>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <p>Loading Map...</p>
  );
}

export default React.memo(Map);