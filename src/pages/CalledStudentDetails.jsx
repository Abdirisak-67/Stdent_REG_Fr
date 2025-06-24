import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPhone, FaUserGraduate, FaUserShield, FaSchool, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const CalledStudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://stdent-reg-bk.onrender.com/api/students/${id}`);
        setStudent(res.data);
      } catch (error) {
        toast.error('Failed to fetch student details');
        setStudent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Student Not Found</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to List
        </button>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <FaCheckCircle className="text-white" />
                Student Contacted
              </h1>
              <div className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <FaPhone /> CALLED
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <FaUserGraduate /> Name:
              </div>
              <div className="flex-1 text-gray-800 font-bold text-lg">{student.name}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <FaUserShield /> Mother:
              </div>
              <div className="flex-1 text-gray-700">{student.motherName}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <FaSchool /> School:
              </div>
              <div className="flex-1 text-gray-700">{student.school}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <FaPhone /> Phone:
              </div>
              <div className="flex-1 text-gray-700 font-medium">{student.phone}</div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                <div>
                  <p className="font-bold">Successfully contacted!</p>
                  <p className="text-sm">This student has been marked as called.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex justify-end">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaArrowLeft /> Return to List
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CalledStudentDetails;