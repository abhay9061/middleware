import express, { Request, Response } from "express";
const router = express.Router();
import supabase from "../config/supabase";
import authMiddleware from "../middleware/auth";



// ✅ Create Student
router.post('/', authMiddleware, async (req: Request, res: Response) => {
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
      data: data?.[0],
    });

  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        message: error.message
      })
    } else
      res.status(500).json({ success: false, message: "Server Error" });
  }
});


// ✅ Get All Students
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('student')
    .select('id,name,email,course');

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
  res.json({
    success: true,
    data
  });
});


// ✅ Get Single Student
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
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

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Update Student
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
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

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Delete Student
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
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

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});



export default router;