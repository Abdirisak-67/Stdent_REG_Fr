import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUserGraduate, 
  FaUserShield, 
  FaSchool, 
  FaPhone, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaPhoneAlt, 
  FaSpinner,
  FaExclamationTriangle,
  FaSatellite
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="text-yellow-500 mt-1">
                <FaExclamationTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600 mt-1">{message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StudentSearchDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoadingStatus(true);
        const res = await axios.get(`https://stdent-reg-bk.onrender.com/api/students/${id}`);
        setStudent(res.data);
        setCalled(res.data.called || false);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleCheckboxChange = () => {
    const action = called ? 'unmark' : 'mark';
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        await axios.put(`https://stdent-reg-bk.onrender.com/api/students/${id}`, { 
          ...student, 
          called: !called 
        });
        setCalled(!called);
      } finally {
        setLoading(false);
      }
    });
    setShowConfirm(true);
  };

  const closeModal = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Student Not Found</h2>
          <button 
            onClick={() => navigate('/search')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={closeModal}
        onConfirm={() => {
          confirmAction?.();
          closeModal();
        }}
        title={called ? "Unmark as Called?" : "Mark as Called?"}
        message={`Are you sure you want to ${called ? 'unmark' : 'mark'} this student as called?`}
        confirmText={called ? "Unmark" : "Mark as Called"}
      />

      <div className="max-w-xl mx-auto">
        <button 
          onClick={() => navigate('/search')} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Search
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className={`p-4 ${called ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-between`}>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUserGraduate />
              Student Details
            </h1>
            <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
              called ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
            }`}>
              {called ? (
                <>
                  <FaCheckCircle /> CALLED
                </>
              ) : (
                <>
                  <FaPhoneAlt /> NOT CALLED
                </>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <FaUserGraduate /> Name:
              </div>
              <div className="flex-1 text-gray-800 font-medium">{student.name}</div>
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
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={called}
                    onChange={handleCheckboxChange}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${called ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${called ? 'transform translate-x-5' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <span className="font-medium">
                  {called ? 'Called' : 'Not Called'}
                </span>
                {loading && <FaSpinner className="animate-spin ml-2 text-blue-500" />}
              </label>

              <AnimatePresence>
                {called ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
                  >
                    <FaCheckCircle className="text-green-500" />
                    <span>This student has been contacted</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2"
                  >
                    <FaPhoneAlt className="text-blue-500 animate-bounceY" />
                    <motion.span
                      className="font-bold text-lg animate-bounceY bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow"
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                    >
                      Call this student now
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex justify-end">
            <button 
              onClick={() => navigate('/search')} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaArrowLeft /> Back to Search
            </button>
          </div>
        </motion.div>
      </div>

      {!called && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            style={{ top: '10%', left: '50%', transform: 'translate(-50%, 0)' }}
          >
            <FaSatellite className="text-blue-300 drop-shadow-lg" size={80} />
          </motion.div>
          <motion.div
            className="absolute w-full flex justify-center"
            style={{ bottom: '10%' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.span
              className="bg-white bg-opacity-80 px-6 py-3 rounded-full shadow-lg text-blue-700 font-bold text-xl border-2 border-blue-200 animate-pulse"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
            >
              Don't forget to Tick
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentSearchDetails;