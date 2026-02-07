import React, { useState, useEffect } from 'react';
import type { Student } from '../types';
import { createStudent, updateStudent } from '../services/api';

interface Props {
    currentStudent: Student | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const StudentForm: React.FC<Props> = ({ currentStudent, onSuccess, onCancel }) => {
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentAddress, setStudentAddress] = useState('');
    const [studentPhoto, setStudentPhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (currentStudent) {
            setStudentId(currentStudent.studentId);
            setStudentName(currentStudent.studentName);
            setStudentAddress(currentStudent.studentAddress);
            setPreviewUrl(currentStudent.studentPhoto); // Show existing photo URL
            setStudentPhoto(null); // Reset file input
        } else {
            setStudentId('');
            setStudentName('');
            setStudentAddress('');
            setStudentPhoto(null);
            setPreviewUrl(null);
        }
    }, [currentStudent]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setStudentPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('studentName', studentName);
        formData.append('studentAddress', studentAddress);
        if (studentPhoto) {
            formData.append('studentPhoto', studentPhoto);
        } else if (currentStudent && currentStudent.studentPhoto) {
            // If no new file selected, we might need a way to tell backend to keep existing.
            // The backend code currently looks for req.file. If no req.file, it doesn't update photo URL unless we send it in body.
            // However, with FormData and multer, simple fields are in req.body. 
            // If we don't send 'studentPhoto' key at all, backend won't update it if we check for existence.
            // But my backend code updates photo ONLY if req.file exists. So this is fine for updates.
            // For creates, photo is required in Schema. So we must provide it.
        }

        try {
            if (currentStudent && currentStudent._id) {
                await updateStudent(currentStudent._id, formData);
            } else {
                if (!studentPhoto) {
                    alert("Please select a photo");
                    return;
                }
                await createStudent(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student.');
        }
    };

    return (
        <div className="student-form-container">
            <h2>{currentStudent ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Student ID:</label>
                    <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                        disabled={!!currentStudent}
                    />
                </div>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        value={studentAddress}
                        onChange={(e) => setStudentAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required={!currentStudent} // Required only for new students
                    />
                    {previewUrl && (
                        <div className="image-preview">
                            <p>Preview:</p>
                            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />
                        </div>
                    )}
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        {currentStudent ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
