const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost/srhaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Define the User schema with timestamps and disable version key (__v)
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    timestamps: true,  // Automatically adds created_at and updated_at fields
    versionKey: false  // Removes the default __v field from the schema
  }
);

// Remove __v from the response and define a transform function
userSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    // Delete the __v field before sending the response
    delete ret.__v; 
    return ret;
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Route to validate user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, send an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Omit the password field and sensitive data
    const userData = user.toObject();
    delete userData.password; // Remove the password field

    // Respond with only the message, not user data
    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email 
      } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});
  

// Route to create a new user (signup)
// Route to validate user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if password matches
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Log the user data for debugging
    console.log('Logged in user data:', user);

    // Send the user data (firstName, lastName, email)
    res.status(200).json({
      message: 'Login successful',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// Route to update a user's details by email
app.put('/api/users/:email', async (req, res) => {
  const { firstName, lastName, password } = req.body;
  const email = req.params.email; // Use email as a unique identifier

  try {
    // Find the user by email and update their information
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Search by email
      { firstName, lastName, password }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
