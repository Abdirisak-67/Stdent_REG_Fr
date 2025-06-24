import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaPhone, FaCheckCircle, FaTimesCircle, FaSpinner, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://stdent-reg-bk.onrender.com/api/students');
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaUserGraduate className="text-indigo-600" />
            All Students
          </h1>
          <p className="text-gray-600">View and manage all student records</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded font-medium transition"
            >
              &larr; Back
            </button>
            <div></div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FaUserGraduate className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No matching students found' : 'No students available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Add students to see them listed here'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700">
              <div className="col-span-5 md:col-span-4">Student Name</div>
              <div className="col-span-4 md:col-span-3">Phone Number</div>
              <div className="col-span-3 md:col-span-3">Status</div>
            </div>

            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredStudents.map((student, index) => (
                  <motion.li
                    key={student._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-5 md:col-span-4 font-medium text-gray-800 flex items-center gap-2">
                        <FaUserGraduate className="text-indigo-500" />
                        {student.name}
                      </div>
                      <div className="col-span-4 md:col-span-3 text-gray-600 flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {student.phone || '-'}
                      </div>
                      <div className="col-span-3 md:col-span-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.called 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.called ? (
                            <>
                              <FaCheckCircle /> Called
                            </>
                          ) : (
                            <>
                              <FaTimesCircle /> Not Called
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="bg-gray-50 px-4 py-3 text-right">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredStudents.length}</span> of{' '}
                <span className="font-medium">{students.length}</span> students
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllStudents;