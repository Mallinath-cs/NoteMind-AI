import axios from "axios";
import express from 'express'
import dotenv from 'dotenv'
import rateLimit from "express-rate-limit";
import DB from './database/db.js'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import path from 'path'
import bcrypt from 'bcrypt'
import User from './models/users.model.js'
import Note from './models/notes.model.js'
import authenticateToken from './utilities.js'


dotenv.config();

const app = express();
const __dirname=path.resolve();
// middlewares

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
]
if(process.env.NODE_ENV !== "production"){
    app.use(cors({ origin: allowedOrigins, credentials: true }));
}

// database

DB();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  keyGenerator: (req) => req.user.userId,
  message: {
    error: "Too many AI requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({error: true, message: "All fields are required"})
    }
    try {
        const isUser = await User.findOne({ email });
        if(isUser){
            return res.status(409).json({ error: true, message: "User Already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ fullName, email, password: hashedPassword })
        await user.save();
        const accessToken = jwt.sign({ userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3600m",
        })
        return res.status(201).json({
            error:false,
            message: "Account created successfully",
            accessToken
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error"})
    }
})

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ error: true, message: "Email and password are required"});
    }
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: true, message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ error: true, message: "Invalid Credentials"})
        }
        const accessToken = jwt.sign({ userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3600m"
        })
        return res.json({
            error: false,
            message: "Login successfull",
            email,
            accessToken
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server Error"})
    }
})

// Get user
app.get("/get-user", authenticateToken, async (req, res) =>{
    try {
        const user = await User.findById(req.user.userId);
        if(!user){
            return res.status(401).json({ error: true, message: "Unauthorized"});
        }
        return res.json({
            user: {
                fullName: user.fullName,
                email: user.email,
                _id: user._id,
                createdOn: user.createdOn,
            },
            message: ""
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error"})
    }
})

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user.userId;

    if(!title || !content){
        return res.status(400).json({ error: true, message: "Title and content are required"})
    }
    try{
        const note  = new Note({ title, content, tags: tags || [], userId});
        await note.save();
        return res.json({
        error: false,
        note,
        message: "Note added successfully"
        });
    }catch(err){
        return res.status(500).json({ error: true, message: "Server error"})
    }
})

// Edit Note
app.put("/edit-note/:noteId",authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned} = req.body;
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if(!note){
            return res.status(404).json({ error: true, message: "Note not found"})
        }
        if(title){
            note.title = title;
        }
        if(content){
            note.content = content;
        }
        if(tags){
            note.tags = tags;
        }
        if(typeof isPinned === "boolean"){
            note.isPinned = isPinned;
        }

        await note.save();
        
        return res.json({ error: false, note, message: "Note updated successfully"})
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error"});
    }
})

// Get all Notes

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        const notes = await Note
            .find({ userId: req.user.userId })
            .sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,   // ✅ SEND THE NOTES
            message: "All notes retrieved successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Server error"
        });
    }
});

// Delete Note

app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if(!note){
            return res.status(404).json({ error: true, message: "Note not found"});
        }    
        await Note.deleteOne({ _id: noteId});
        return res.json({ error: false, message: "Note deleted successfully"})
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error"})
    }
})

// Update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        // 🔥 Toggle here
        note.isPinned = !note.isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Pinned status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
});

// Search Notes

app.get("/search-notes", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const userId = req.user.userId;
    try {
      if(!query){
        return res.status(400).json({ error: true, message: "Query is required"});
    }
    const notes = await Note.find({
        userId,
        $or: [
            { title: { $regex: query, $options: "i"}},
            { content: { $regex: query, $options: "i"}},
        ]
    })
    return res.json({ error: false, notes, message: "Matching notes found"});  
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error"});
    }
})
// ai
app.get("/api/ai/summarize-all", authenticateToken, aiLimiter, async (req, res) => {
  try {
    // assuming userId comes from auth middleware
    const userId = req.user.userId;
    // OR temporarily:
    // const userId = req.query.userId;
    
    // fetch only this user's notes
    const notes = await Note.find({ userId });

    if (!notes.length) {
      return res.json({ summary: "No notes found." });
    }

    // combine title + content
    const combinedText = notes
      .map(note => `${note.title}\n${note.content}`)
      .join("\n\n");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nex-agi/deepseek-v3.1-nex-n1",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Summarize the following user notes into one concise paragraph:\n\n${combinedText}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const summary =
      response.data.choices[0].message.content;

    res.json({ summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI summary failed" });
  }
});


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
