const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');


// ✅ Create Student
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, course } = req.body;

    const { data, error } = await supabase
      .from('student')
      .insert([{ name, email, course }])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Student created successfully",
      data: data[0]
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Get All Students
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Get Single Student
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('student')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Update Student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('student')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: "Student updated successfully",
      data: data[0]
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Delete Student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('student')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;