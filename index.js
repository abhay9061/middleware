
require('dotenv').config();

const express = require("express");
const app = express();
const Port = 3000;

const authMiddleware = require("./auth");

app.use(express.json());



app.get("/", (req, res) => {
    res.send("Server working");
});


// routes
app.get("/xyz", authMiddleware, (req, res) => {
    res.send("Access Mil gaya")
});

app.get("/api/rightHeader", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth middleware is working correctly"
    });
});




// ❗ supabase import missing tha (ye bhi add karo)
const supabase = require('./config/supabase');
//const { clearScreenDown } = require('node:readline');



//Student Insert 
app.post('/api/students', authMiddleware, async (req, res) => {
    const { name, email, course } = req.body;

    const { data, error } = await supabase
        .from('student')
        .insert([{ name, email, course }]).select();

    if (error) {
        return res.json({
            success: false,
            error: error.message
        });
    }

    res.json({
        success: true,
        message: "Student Create Successfully",
        data: data[0]
    });
});


//Get All Student

app.get("/api/students", authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('student')
            .select('*');

        if (error) {
            return res.status(500).json({ error: error.message })
        }
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get Single Student

app.get("/api/students/:id", async (req, res) => {
    try {
        const id = req.params;
        console.log(id);
        const { data, error } = await supabase
            .from('student')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
})


app.delete("/api/students/:id", async (req, res) => {
    try {
        const studentId = req.params.id;

        console.log(studentId);
        const { data, error } = await supabase
            .from('student')       // table name
            .delete()              // delete method
            .eq('id', studentId);  // filter by id

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data.length) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(Port, () => {
    console.log(`Server chal rha hai ${Port} par`);
});