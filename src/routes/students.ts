import express, { Request, Response } from "express";
const router = express.Router();

import supabase from "../config/supabase";
import authMiddleware from "../middleware/auth";
import { postCacheMiddleware } from "../middleware/post-cache";


// ✅ Create Student
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, email, course } = req.body;

    const { data, error } = await supabase
      .from("student")
      .insert([{ name, email, course }])
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      message: "Student created successfully",
      data: data?.[0],
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});


// ✅ Get All Students (FILTER + PAGINATION + CACHE 🔥)
router.get("/", authMiddleware, postCacheMiddleware, async (req: Request, res: Response) => {
  try {
    let { course, page = "1", limit = "10" } = req.query;

    // ✅ convert to number
    let pageNumber = parseInt(page as string);
    let limitNumber = parseInt(limit as string);

    // ✅ validation
    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    }

    if (isNaN(limitNumber) || limitNumber < 1) {
      limitNumber = 10;
    }

    // ✅ max limit protection
    if (limitNumber > 50) {
      limitNumber = 50;
    }

    // ✅ pagination logic
    const from = (pageNumber - 1) * limitNumber;
    const to = from + limitNumber - 1;

    let query = supabase
      .from("student")
      .select("id,name,email,course")
      .range(from, to);

    // ✅ filter
    if (course) {
      query = query.eq("course", course);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      data,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ✅ Get Single Student
router.get("/:id", authMiddleware, postCacheMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("student")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      data,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ✅ Update Student
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("student")
      .update(req.body)
      .eq("id", id)
      .select();

    if (error) throw error;

    return res.json({
      success: true,
      message: "Student updated successfully",
      data: data?.[0],
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ✅ Delete Student
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("student")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;