const mongoose = require('mongoose');

// Define the schema
const droneDataSchema = new mongoose.Schema({
  gps: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  image: { type: String, required: true },
  confidence: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create and export the model
const DroneData = mongoose.model('DroneData', droneDataSchema);
module.exports = DroneData;

// For debugging
console.log('In DroneData.js: Model type:', typeof DroneData);
console.log('In DroneData.js: Is model a function?', typeof DroneData === 'function');