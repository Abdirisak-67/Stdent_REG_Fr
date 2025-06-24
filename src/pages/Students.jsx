import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaTimesCircle, FaUserEdit, FaTrash, FaInfoCircle, FaUsers, FaSpinner } from 'react-icons/fa';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://stdent-reg-bk.onrender.com/api/students');
      setStudents(res.data);
      setFiltered(res.data.filter(s => !s.called));
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(students.filter(s => !s.called));
    } else {
      setFiltered(
        students.filter(s => {
          return (
            !s.called && (
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              (s.phone && s.phone.replace(/\D/g, '').includes(search.replace(/\D/g, '')))
            )
          );
        })
      );
    }
  }, [search, students]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`https://stdent-reg-bk.onrender.com/api/students/${id}`);
      toast.success('Student deleted successfully');
      setStudents(students.filter(s => s._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleClear = () => setSearch('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-600 mt-1">View and manage student records</p>
          </div>
          <button
            onClick={() => navigate('/all-students')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all shadow hover:shadow-lg"
          >
            <FaUsers className="text-lg" />
            View All Students
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or phone number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Clear search"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'student' : 'students'} found
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-left">
                    <th className="px-6 py-3 font-medium rounded-tl-lg">Student Name</th>
                    <th className="px-6 py-3 font-medium">Number</th>
                    <th className="px-6 py-3 font-medium">School</th>
                    <th className="px-6 py-3 font-medium rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.length > 0 ? (
                    filtered.map(student => (
                      <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                        <td className="px-6 py-4 text-gray-600">{student.phone || '-'}</td>
                        <td className="px-6 py-4 text-gray-600">{student.school || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/students/${student._id}`)}
                              className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FaInfoCircle />
                              <span className="hidden sm:inline">Details</span>
                            </button>
                            <button
                              onClick={() => navigate(`/students/${student._id}?edit=true`)}
                              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaUserEdit />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(student._id, student.name)}
                              className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        {search ? 'No matching students found' : 'No students available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;