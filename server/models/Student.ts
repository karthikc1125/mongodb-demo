import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    studentAddress: string;
    studentId: string;
    studentName: string;
    studentPhoto: string;
}

const StudentSchema: Schema = new Schema({
    studentAddress: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentPhoto: { type: String, required: true }, // Storing photo URL or Base64 string
});

// Explicitly setting collection name to 'student-phone-number' as requested, 
// though 'college-student' is the db name and 'student-phone-number' is collection.
export default mongoose.model<IStudent>('Student', StudentSchema, 'student-phone-number');
