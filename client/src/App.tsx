import { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import { getStudents, deleteStudent } from './services/api';
import type { Student } from './types';
import './App.css';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students. Ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student: Student) => {
    setCurrentStudent(student);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
      fetchStudents();
    }
  };

  const handleSuccess = () => {
    setIsFormVisible(false);
    setCurrentStudent(null);
    fetchStudents();
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setCurrentStudent(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>College Student Management</h1>
        <button className="btn-add" onClick={() => { setCurrentStudent(null); setIsFormVisible(true); }}>
          + Add New Student
        </button>
      </header>

      <main>
        {loading && <p>Loading students...</p>}
        {error && <p className="error-msg">{error}</p>}

        {isFormVisible ? (
          <StudentForm
            currentStudent={currentStudent}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <StudentList
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default App;
