import React from 'react';
import type { Student } from '../types';

interface Props {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

const StudentList: React.FC<Props> = ({ students, onEdit, onDelete }) => {
    return (
        <div className="student-list-container">
            <h2>Student List</h2>
            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="student-grid">
                    {students.map((student) => (
                        <div key={student._id || student.studentId} className="student-card">
                            <img
                                src={student.studentPhoto}
                                alt={student.studentName}
                                className="student-photo"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                }}
                            />
                            <div className="student-info">
                                <h3>{student.studentName}</h3>
                                <p><strong>ID:</strong> {student.studentId}</p>
                                <p><strong>Address:</strong> {student.studentAddress}</p>
                                <div className="card-actions">
                                    <button onClick={() => onEdit(student)} className="btn-edit">Edit</button>
                                    <button onClick={() => onDelete(student._id!)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentList;
