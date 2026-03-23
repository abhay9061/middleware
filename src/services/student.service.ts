import supabase from "../config/supabase";

// CREATE
export const createStudentService = async (payload: any) => {
    const { data, error } = await supabase
        .from("student")
        .insert([payload])
        .select();

    if (error) throw error;
    return data?.[0];
};

// GET LIST
export const getStudentsService = async (query: any) => {
    let { course, page = "1", limit = "10" } = query;

    let pageNumber = parseInt(page);
    let limitNumber = parseInt(limit);

    if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
    if (isNaN(limitNumber) || limitNumber < 1) limitNumber = 10;
    if (limitNumber > 50) limitNumber = 50;

    const from = (pageNumber - 1) * limitNumber;
    const to = from + limitNumber - 1;

    let queryBuilder = supabase
        .from("student")
        .select("id,name,email,course")
        .range(from, to);

    if (course) {
        queryBuilder = queryBuilder.eq("course", course);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return { page: pageNumber, limit: limitNumber, data };
};

// GET BY ID
export const getStudentByIdService = async (id: string) => {
    const { data, error } = await supabase
        .from("student")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};

// UPDATE
export const updateStudentService = async (id: string, payload: any) => {
    const { data, error } = await supabase
        .from("student")
        .update(payload)
        .eq("id", id)
        .select();

    if (error) throw error;
    return data?.[0];
};

// DELETE
export const deleteStudentService = async (id: string) => {
    const { error } = await supabase
        .from("student")
        .delete()
        .eq("id", id);

    if (error) throw error;
    return true;
};