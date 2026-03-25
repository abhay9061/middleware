import supabase from "../../config/supabase";

// ✅ CREATE STUDENT
export const createStudent = async (data: any) => {
    const { name, email, course } = data;

    const { data: result, error } = await supabase
        .from("student")
        .insert([
            {
                name,
                email,
                course,
            },
        ]);

    if (error) {
        throw new Error(error.message);
    }

    return result;
};

// ✅ UPDATE STUDENT
export const updateStudent = async (data: any) => {
    const { id, ...updateData } = data;

    const { data: result, error } = await supabase
        .from("student")
        .update(updateData)
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return result;
};

// ✅ DELETE STUDENT
export const deleteStudent = async (data: any) => {
    const { id } = data;

    const { data: result, error } = await supabase
        .from("student")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return result;
};