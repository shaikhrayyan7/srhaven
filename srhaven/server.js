const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/srhaven', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Transform the schema for cleaner JSON response
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.password; // Remove sensitive data
    return ret;
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Route for signing up a new user
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    // Respond with only a success message
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Route to validate user login
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Stored password hash:', user.password);
    console.log('Password entered:', password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in login process:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Route to get the authenticated user's profile
app.get('/api/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }); // Only send necessary details
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Route to update a user's details
app.put('/api/users/:email', async (req, res) => {
  const email = req.params.email;
  const { firstName, lastName, email: newEmail, password } = req.body;

  try {
    // Prepare updated fields
    const updates = {
      firstName,
      lastName,
    };

    if (newEmail) {
      updates.email = newEmail; // Include email if provided
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
      updates.password = hashedPassword; // Include hashed password
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updates,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


// DELETE user by email
app.delete('/api/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find and delete the user by email
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user. Please try again later.' });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
