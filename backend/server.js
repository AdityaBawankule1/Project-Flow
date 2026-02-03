const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");

        // Log existing projects on startup
        Project.find({})
            .then(projects => {
                console.log(`📊 Total projects in database: ${projects.length}`);

                const inProgressProjects = projects.filter(p => p.status === 'in-progress');
                console.log(`🚀 In-progress projects: ${inProgressProjects.length}`);

                if (inProgressProjects.length > 0) {
                    console.log('📋 In-progress projects:');
                    inProgressProjects.forEach(p => {
                        console.log(`  - ${p.name} (Client: ${p.client}, User: ${p.userId})`);
                    });
                }
            })
            .catch(err => console.error('Error checking projects:', err));
    })
    .catch((err) => console.error("❌ MongoDB Connection Failed:", err.message));

// --- SCHEMAS ---

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['CEO', 'Employee'], default: 'Employee' },
    createdAt: { type: Date, default: Date.now }
});

const isCEO = async (req, res, next) => {
  const userId = req.headers.userid;
  const user = await User.findById(userId);

  if (!user || user.role !== 'CEO') {
    return res.status(403).json({ message: 'Access denied: CEO only' });
  }

  req.user = user;
  next();
};

const projectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    client: { type: String, required: true },
    clientLogo: { type: String },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'review', 'completed'],
        default: 'planning'
    },
    deadline: { type: Date, required: true },
    progress: { type: Number, default: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    revenue: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

// --- PROJECT ROUTES ---

// GET all projects for a user
app.get('/api/projects', async (req, res) => {
    try {
        const { userid } = req.headers;
        if (!userid) return res.status(400).json({ message: "User ID required" });

        const projects = await Project.find({ userId: userid }).sort({ createdAt: -1 });
        console.log(`📦 Fetched ${projects.length} projects for user ${userid}`);
        res.json(projects);
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
});

// GET ALL in-progress projects (NO USER FILTER!)
app.get('/api/projects/in-progress', async (req, res) => {
    try {
        console.log('📥 Fetching ALL in-progress projects (no user filter)');

        // Query MongoDB for ALL in-progress projects regardless of userId
        const projects = await Project.find({
            status: 'in-progress'
        }).sort({ createdAt: -1 });

        console.log(`✅ Found ${projects.length} in-progress projects across all users`);

        if (projects.length > 0) {
            console.log('📋 In-progress projects:');
            projects.forEach(p => {
                console.log(`  - ${p.name} (Client: ${p.client}, User: ${p.userId}, Progress: ${p.progress}%)`);
            });
        }

        res.json(projects);
    } catch (error) {
        console.error('❌ Error fetching in-progress projects:', error);
        res.status(500).json({ message: 'Server error fetching in-progress projects' });
    }
});

// POST create new project
app.post('/api/projects', isCEO, async (req, res) => {
    try {
        const { userId, name, client, clientLogo, status, deadline, progress, priority } = req.body;

        console.log("📥 Received Project Data:", req.body);

        // --- VALIDATION ---
        const missingFields = [];
        if (!userId || userId.trim() === "") missingFields.push("userId");
        if (!name || name.trim() === "") missingFields.push("name");
        if (!client || client.trim() === "") missingFields.push("client");
        if (!deadline || deadline.trim() === "") missingFields.push("deadline");

        if (missingFields.length > 0) {
            console.error("❌ Missing required fields:", missingFields);
            return res.status(400).json({
                message: "Missing required fields",
                missingFields
            });
        }

        // --- PARSE DD/MM/YYYY DEADLINE ---
        function parseDate(dateStr) {
            if (!dateStr) return null;
            if (dateStr.includes('/')) {
                // DD/MM/YYYY
                const [day, month, year] = dateStr.split('/');
                return new Date(`${year}-${month}-${day}`);
            } else {
                // Assume ISO format
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? null : date;
            }
        }

        const projectDeadline = parseDate(deadline);
        if (!projectDeadline) {
            console.error("❌ Invalid deadline:", deadline);
            return res.status(400).json({ message: "Invalid deadline date. Use DD/MM/YYYY" });
        }

        // --- CREATE PROJECT ---
        const newProject = new Project({
            userId: userId.trim(),
            name: name.trim(),
            client: client.trim(),
            clientLogo: clientLogo ? clientLogo.trim() : "",
            status: status || "planning",
            deadline: projectDeadline,
            progress: progress || 0,
            priority: priority || "medium"
        });

        const savedProject = await newProject.save();
        console.log(`✅ Project created: ${savedProject.name} (ID: ${savedProject._id})`);
        res.status(201).json(savedProject);

    } catch (error) {
        console.error("❌ DB Save Error:", error.message);
        res.status(500).json({ message: 'Server error saving project', error: error.message });
    }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        console.log(`🗑️ Project deleted: ${deletedProject.name} (ID: ${req.params.id})`);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('❌ Delete failed:', error);
        res.status(500).json({ message: 'Delete failed' });
    }
});

// UPDATE project
app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const updateData = req.body;

        console.log('📝 Updating project:', projectId, updateData);

        // If deadline is being updated, parse it
        if (updateData.deadline) {
            function parseDate(dateStr) {
                if (!dateStr) return null;
                if (dateStr.includes('/')) {
                    const [day, month, year] = dateStr.split('/');
                    return new Date(`${year}-${month}-${day}`);
                } else {
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? null : date;
                }
            }
            updateData.deadline = parseDate(updateData.deadline);
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log(`✅ Project updated: ${updatedProject.name} (ID: ${projectId})`);
        res.json(updatedProject);
    } catch (error) {
        console.error('❌ Update failed:', error);
        res.status(500).json({ message: 'Failed to update project' });
    }
});

// --- AUTH ROUTES ---

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, company, phone, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, email, password, company, phone, role });
        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        res.status(200).json({
            message: 'Login successful',
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));