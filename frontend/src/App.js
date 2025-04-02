import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage.jsx'
import AboutUs from './components/AboutUs/AboutUs.jsx';
import Map from './components/Map/Map.jsx';
import { io } from 'socket.io-client';

const App = () => {
  const [droneData, setDroneData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    const socket = io('http://159.65.245.235');
    
    // Initial data load
    fetch('http://159.65.245.235:8080/api/drone-data')
      .then((res) => res.json())
      .then((data) => {
        console.log('API response:', data, 'type:', typeof data, 'isArray:', Array.isArray(data));
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];
        setDroneData(dataArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching initial drone data:', error);
        setLoading(false);
      });

    // IMPORTANT: Make sure these event names match exactly what the server is emitting
    // Based on your server code, it emits 'new-drone-data', not 'update_data'
    socket.on('new-drone-data', (newData) => {
      console.log('New drone data received:', newData);
      setDroneData((prev) => {
        // Check if this is an update to existing data
        const exists = prev.findIndex(item => item._id === newData._id);
        
        if (exists >= 0) {
          // Update existing item
          const updated = [...prev];
          updated[exists] = newData;
          return updated;
        } else {
          // Add new item
          return [...prev, newData];
        }
      });
    });
    
    // This event name looks correct based on your server code
    socket.on('delete-drone-data', ({ id }) => {
      console.log('Drone data deleted with ID:', id);
      setDroneData((prev) => prev.filter((drone) => drone._id !== id));
    });
    
    // Clean up socket connection on component unmount
    return () => {
      socket.off('new-drone-data');
      socket.off('delete-drone-data');
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutUs />} />
          {/* Pass droneData as a prop to Map */}
          <Route path="/map" element={<Map droneData={droneData} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;