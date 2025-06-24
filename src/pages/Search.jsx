import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimesCircle, FaUserGraduate, FaPhoneAlt, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiBaseUrl } from '../Context/Context';

const normalizePhone = (num) => {
  num = num.replace(/\D/g, '');
  if (num.startsWith('252')) num = num.slice(3);
  if (num.length === 9 && num.startsWith('6')) num = '252' + num;
  if (num.length === 8 && num.startsWith('6')) num = '252' + '61' + num.slice(1);
  if (num.length === 8 && num.startsWith('7')) num = '252' + '7' + num;
  if (num.length === 9 && !num.startsWith('252')) num = '252' + num;
  if (num.length === 7 && num.startsWith('6')) num = '25261' + num.slice(1);
  if (num.length === 7 && num.startsWith('7')) num = '2527' + num;
  if (!num.startsWith('252')) num = '252' + num;
  return '+' + num;
};

const Search = () => {
  const [phone, setPhone] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = useContext(ApiBaseUrl);

  useEffect(() => {
    if (!phone) {
      setStudents([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      handleSearch(phone);
    }, 400);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line
  }, [phone]);

  const handleSearch = async (value) => {
    if (!value) {
      setStudents([]);
      return;
    }
    let inputDigits = value.replace(/\D/g, '');
    if (inputDigits.length < 2) {
      setStudents([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/students`);
      let matches = [];
      if (inputDigits.length === 2 && inputDigits === '61') {
        matches = res.data.filter(s =>
          normalizePhone(s.phone).replace(/\D/g, '').startsWith('612') ||
          normalizePhone(s.phone).replace(/\D/g, '').startsWith('61')
        );
      } else if (inputDigits.length === 7) {
        const pattern = '61' + inputDigits;
        matches = res.data.filter(s =>
          normalizePhone(s.phone).replace(/\D/g, '').endsWith(pattern)
        );
      } else {
        matches = res.data.filter(s =>
          normalizePhone(s.phone).replace(/\D/g, '').includes(inputDigits)
        );
      }
      setStudents(matches);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPhone('');
    setStudents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <FaSearch className="text-blue-600" />
             Search Student
          </h1>
          <p className="text-gray-600">Search students by phone number</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhoneAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter phone number)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={15}
              />
              {phone && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Clear"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleSearch(phone)}
              disabled={!phone || loading}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                !phone || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </div>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        )}

        <AnimatePresence>
          {students.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {students.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                      <FaUserGraduate className="text-blue-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h3>
                    {student.phone && (
                      <p className="text-gray-600 mb-4 flex items-center gap-2">
                        <FaPhoneAlt className="text-green-500" />
                        {normalizePhone(student.phone)}
                      </p>
                    )}
                    <button
                      onClick={() => navigate(`/search/${student._id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      View Full Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && students.length === 0 && phone.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <div className="text-gray-400 mb-4">
              <FaUserGraduate className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Students Found
            </h3>
            <p className="text-gray-500">
              No matching students found for "{phone}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
