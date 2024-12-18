const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Connect to MongoDB
mongoose
  .connect('mongodb://0.0.0.0:27017/srhaven', {
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
    subscription: { type: String, default: 'Unsubscribed' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the User model
const User = mongoose.model('User', userSchema);

// Define the Memory schema with an embedded array of images (Now image is stored as Buffer directly in DB)
const memorySchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    memories: [
      {
        image: { type: Buffer, required: true },  
        mimeType: { type: String, required: true }, 
        place: { type: String, default: 'Unknown' },
        gpsCoordinates: { type: String, default: 'Not available' },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the Memory model
const Memory = mongoose.model('Memory', memorySchema);

// Set up multer for image uploads (saving to memory, not disk)
const storage = multer.memoryStorage();  

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  },
});

// --- User Routes ---

// Signup
app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in login process:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Fetch User Profile
app.get('/api/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email }); // Fetch user by email
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include all necessary fields in the response
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password, // If including password, ensure proper hashing and security measures are in place
      subscription: user.subscription,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user. Please try again later.' });
  }
});

// Update User
app.put('/api/users/:email', async (req, res) => {
  const email = req.params.email;
  const { firstName, lastName, email: newEmail, password } = req.body;

  try {
    const updates = { firstName, lastName };
    if (newEmail) updates.email = newEmail;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate({ email }, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete User
app.delete('/api/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Memory Routes ---

// Upload Memory (Image will be stored in memory, not disk)
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const { email, place, gpsCoordinates } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Verify that the user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    // Get image from memory (multer stores it in req.file.buffer)
    const imageBuffer = req.file.buffer;  // Image is now in memory
    const mimeType = req.file.mimetype;

    const newMemory = {
      image: imageBuffer,
      mimeType: mimeType,
      place: place || 'Unknown',
      gpsCoordinates: gpsCoordinates || 'Not available',
    };

    // Save the memory in the database
    const memory = await Memory.findOneAndUpdate(
      { email },
      { $push: { memories: newMemory } },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Image uploaded and saved successfully', memory });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Fetch Memories
app.get('/api/memories/:email', async (req, res) => {
  try {
    const memories = await Memory.findOne({ email: req.params.email });

    if (!memories || !memories.memories.length) {
      return res.status(404).json({ message: 'No memories found for this user' });
    }

    // Convert binary data to base64 strings for display
    const formattedMemories = memories.memories.map(memory => ({
      image: `data:${memory.mimeType};base64,${memory.image.toString('base64')}`,
      place: memory.place,
      gpsCoordinates: memory.gpsCoordinates,
      date: memory.date,
    }));

    res.status(200).json({ memories: formattedMemories });
  } catch (err) {
    console.error('Error fetching memories:', err);
    res.status(500).json({ error: 'Error fetching memories' });
  }
});

// Subscription API (One-time Payment Logic)
app.post('/api/subscription', async (req, res) => {
  try {
    const { email, userIBAN, description } = req.body;

    if (!email || !userIBAN) {
      return res.status(400).json({ message: 'Email and IBAN are required.' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's subscription status to "Subscribed"
    user.subscription = 'Subscribed';
    await user.save();

    res.status(200).json({
      message: 'Payment successful! Subscription activated.',
      subscriptionStatus: 'Subscribed',
    });
  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
