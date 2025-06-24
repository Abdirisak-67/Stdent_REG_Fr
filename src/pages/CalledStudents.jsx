import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPhoneAlt, FaUserCheck, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const CalledStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalledStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://stdent-reg-bk.onrender.com/api/students');
        const calledStudents = res.data.filter(s => s.called === true);
        setStudents(calledStudents);
        if (calledStudents.length === 0) {
          toast.info('No called students found');
        }
      } catch (error) {
        toast.error('Failed to fetch called students');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalledStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaUserCheck className="text-blue-600" />
              Called Students
            </h1>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
          <p className="text-gray-600 text-center">
            View all students who have been contacted
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : students.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FaUserCheck className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Called Students Yet
            </h3>
            <p className="text-gray-500">
              Students will appear here once they've been contacted
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 bg-blue-600 text-white flex items-center gap-2">
              <FaPhoneAlt />
              <span className="font-medium">
                {students.length} {students.length === 1 ? 'Student' : 'Students'} Contacted
              </span>
            </div>
            
            <ul className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <motion.li
                  key={student._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{student.name}</h3>
                      {student.phone && (
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <FaPhoneAlt className="text-green-500" />
                          {student.phone}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/called-students/${student._id}`)}
                      className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaUserCheck />
                      <span>Details</span>
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalledStudents;