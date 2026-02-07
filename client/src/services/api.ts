import axios from 'axios';
import type { Student } from '../types';

const API_URL = 'http://localhost:5000/api/students';

// FormData type not explicitly needed for axios, it handles it.
// Student input can be FormData or Object, but for create/update with file, it must be FormData.

export const getStudents = async () => {
    const response = await axios.get<Student[]>(API_URL);
    return response.data;
};

export const getStudent = async (id: string) => {
    const response = await axios.get<Student>(`${API_URL}/${id}`);
    return response.data;
};

export const createStudent = async (studentData: FormData) => {
    // Axios automatically sets Content-Type: multipart/form-data for FormData
    const response = await axios.post<Student>(API_URL, studentData);
    return response.data;
};

export const updateStudent = async (id: string, studentData: FormData) => {
    const response = await axios.put<Student>(`${API_URL}/${id}`, studentData);
    return response.data;
};

export const deleteStudent = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
