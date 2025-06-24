import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserGraduate, FaUserShield, FaSchool, FaPhone, FaEdit, FaArrowLeft, FaCheck, FaPhoneVolume, FaExclamationTriangle, FaSatellite } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const StudentDetails = () => {
  const { id } = useParams();
  const { search } = useLocation();
  const [student, setStudent] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', motherName: '', school: '', phone: '' });
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCalled, setLoadingCalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEdit(new URLSearchParams(search).get('edit') === 'true');
    setLoading(true);
    axios.get(`https://stdent-reg-bk.onrender.com/api/students/${id}`)
      .then(res => {
        setStudent(res.data);
        setForm(res.data);
        setCalled(res.data.called);
      })
      .catch(() => toast.error('Failed to fetch student'))
      .finally(() => setLoading(false));
  }, [id, search]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://stdent-reg-bk.onrender.com/api/students/${id}`, form);
      toast.success('Student updated successfully!');
      setEdit(false);
      setStudent({ ...student, ...form });
    } catch {
      toast.error('Update failed. Please try again.');
    }
  };

  const handleCheckbox = async () => {
    const action = called ? 'unmark' : 'mark';
    setConfirmAction(() => async () => {
      setLoadingCalled(true);
      try {
        await axios.put(`https://stdent-reg-bk.onrender.com/api/students/${id}`, { ...student, called: !called });
        setCalled(!called);
        setStudent({ ...student, called: !called });
        toast.success(`Student ${action}ed as ${called ? 'not called' : 'called'}`);
      } finally {
        setLoadingCalled(false);
      }
    });
    setShowConfirm(true);
  };

  const closeModal = () => {
    setShowConfirm(false);
    setConfirmAction(null);
  };

  // ConfirmationModal component for styled confirmation
  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => (
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Student Not Found</h2>
          <button 
            onClick={() => navigate('/students')} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Students
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
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/students')} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Students
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
              {edit ? 'Edit Student' : 'Student Details'}
            </h1>
            {!edit && (
              <button 
                onClick={() => setEdit(true)}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaEdit /> Edit
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {edit ? (
              <motion.form
                key="edit-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleUpdate}
                className="p-6 space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserGraduate className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Student Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserShield className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.motherName}
                    onChange={e => setForm({ ...form, motherName: e.target.value })}
                    required
                    placeholder="Mother's Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSchool className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.school}
                    onChange={e => setForm({ ...form, school: e.target.value })}
                    required
                    placeholder="School"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="view-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-32 font-medium text-gray-500 flex items-center gap-2">
                      <FaUserGraduate /> Name:
                    </div>
                    <div className="flex-1 text-gray-800 font-medium">{student.name}</div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-32 font-medium text-gray-500 flex items-center gap-2">
                      <FaUserShield /> Mother:
                    </div>
                    <div className="flex-1 text-gray-800">{student.motherName}</div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-32 font-medium text-gray-500 flex items-center gap-2">
                      <FaSchool /> School:
                    </div>
                    <div className="flex-1 text-gray-800">{student.school}</div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-32 font-medium text-gray-500 flex items-center gap-2">
                      <FaPhone /> Phone:
                    </div>
                    <div className="flex-1 text-gray-800">{student.phone}</div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={called}
                          onChange={handleCheckbox}
                          disabled={loadingCalled}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${called ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${called ? 'transform translate-x-5' : 'left-0.5'}`}></div>
                        </div>
                      </div>
                      <span className="font-medium">
                        {called ? 'Called' : 'Not Called'}
                      </span>
                      {loadingCalled && <div className="ml-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
                    </label>

                    <AnimatePresence>
                      {called ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
                        >
                          <FaCheck className="text-green-500" />
                          <span>This student has been contacted</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2"
                        >
                          <FaPhoneVolume className="text-blue-500" />
                          <span>Call this student now</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

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
            Don't forget to tick
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentDetails;