import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import Student, { IStudent } from '../models/Student';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// CREATE
router.post('/', upload.single('studentPhoto'), async (req: Request, res: Response): Promise<any> => {
    try {
        const studentData = req.body;
        if (req.file) {
            studentData.studentPhoto = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        const newStudent: IStudent = new Student(studentData);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error creating student', error });
    }
});

// READ ALL
router.get('/', async (req: Request, res: Response) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
});

// READ ONE
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error });
    }
});

// UPDATE
router.put('/:id', upload.single('studentPhoto'), async (req: Request, res: Response): Promise<any> => {
    try {
        const updateData = req.body;
        if (req.file) {
            updateData.studentPhoto = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error });
    }
});

// DELETE
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
});

export default router;
