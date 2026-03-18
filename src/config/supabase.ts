import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { error } from "node:console";
dotenv.config();


const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_ANON_KEY || " ";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variable are missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;