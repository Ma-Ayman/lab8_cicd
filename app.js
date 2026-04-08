const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/tasks";

mongoose.connect(MONGO_URL)
  .then(async () => {
    console.log("Connected to MongoDB");

    // ✅ SEED DATA هنا
    const count = await Task.countDocuments();

    if (count === 0) {
      await Task.insertMany([
        { id: 1, name: 'Milk', status: 'done' },
        { id: 2, name: 'Eggs', status: 'done' },
        { id: 3, name: 'Bread', status: 'pending' },
        { id: 4, name: 'Butter', status: 'pending' },
        { id: 5, name: 'Orange juice', status: 'pending' }
      ]);
      console.log("Seed data inserted");
    }
  })
  .catch(err => console.log(err));

// Schema & Model
const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});

const Task = mongoose.model('Task', taskSchema);

// routes
app.get('/', (req, res) => {
  res.json({
    app: 'CISC 886 Lab 8',
    mode: process.env.MODE || 'local',
    node: process.version,
    host: os.hostname(),
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();

  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  res.json(grouped);
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
