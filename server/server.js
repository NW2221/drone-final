require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const DroneData = require('./models/DroneData');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Create an Express application
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Database connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  
  // Try getting the model directly from Mongoose
  const DroneDataModel = mongoose.model('DroneData');
  console.log('DroneDataModel from mongoose:', typeof DroneDataModel);
  console.log('DroneDataModel.find exists:', typeof DroneDataModel.find === 'function');
  
  // Replace your imported model with this one
  global.DroneData = DroneDataModel;
})
.catch((err) => console.error("MongoDB connection error:", err));


// Create HTTP server and setup Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (modify in production)
    methods: ['GET', 'POST']
  }
});

console.log('DroneData type:', typeof DroneData);
console.log('Is DroneData a function?', typeof DroneData === 'function');
console.log('DroneData constructor:', DroneData.constructor.name);
console.log('DroneData methods:', Object.getOwnPropertyNames(DroneData));

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // New event handler for update_data from Python client
  socket.on('update_data', async (data) => {
    try {
      // Validate incoming data against the model's requirements
      if (!data.gps || 
          data.gps.latitude == null || 
          data.gps.longitude == null || 
          !data.image || 
          data.confidence == null) {
        console.log('Invalid data received:', data);
        return;
      }

      // Create new DroneData entry matching the exact schema
      const newDroneData = new DroneData({
        gps: {
          latitude: data.gps.latitude,
          longitude: data.gps.longitude
        },
        image: data.image,
        confidence: data.confidence || data.analysis?.confidence
      });

      // Save to MongoDB
      const savedData = await newDroneData.save();

      // Emit to all connected clients
      io.emit('new-drone-data', savedData);

      console.log('Received and saved data from Python client');
    } catch (error) {
      console.error('Error processing update_data:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Test endpoint to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running and connected to MongoDB');
});

// CRUD Endpoints

// 1. Get all Drone Data
app.get('/api/drone-data', async (req, res) => {
  try {
    // Use the global model or the one from mongoose directly
    const model = global.DroneData || mongoose.model('DroneData');
    const data = await model.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching drone data:', error);
    res.status(500).send({ error: "Failed to find data" });
  }
});

// 2. Create new Drone Data
app.post('/api/drone-data', async (req, res) => {
  const { gps, image, confidence } = req.body;
  
  // Basic validation
  if (!gps || gps.latitude == null || gps.longitude == null || !image || confidence == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newDroneData = new DroneData({ gps, image, confidence });
    const savedData = await newDroneData.save();

    // Emit the new data event to all connected clients
    io.emit('new-drone-data', savedData);
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error saving drone data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Get a specific Drone Data by ID
app.get('/api/drone-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const droneData = await DroneData.findById(id);

    if (!droneData) {
      return res.status(404).json({ error: 'Drone data not found' });
    }

    res.status(200).json(droneData);
  } catch (error) {
    console.error('Error fetching drone data by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. Update Drone Data by ID
app.put('/api/drone-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const updatedDroneData = await DroneData.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDroneData) {
      return res.status(404).json({ error: 'Drone data not found' });
    }

    res.status(200).json(updatedDroneData);
  } catch (error) {
    console.error('Error updating drone data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. Delete Drone Data by ID
app.delete('/api/drone-data/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDroneData = await DroneData.findByIdAndDelete(id);

    if (!deletedDroneData) {
      return res.status(404).json({ error: 'Drone data not found' });
    }

    // Emit an event notifying clients of deletion
    io.emit('delete-drone-data', { id });

    res.status(200).json({ message: 'Drone data deleted successfully' });
  } catch (error) {
    console.error('Error deleting drone data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
