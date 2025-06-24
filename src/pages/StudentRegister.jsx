import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { FaUserGraduate, FaUserShield, FaSchool, FaPhone, FaFileExcel, FaUpload, FaSpinner, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StudentRegister = () => {
  const [form, setForm] = useState({ name: '', motherName: '', school: '', phone: '' });
  const [excelData, setExcelData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleExcel = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.warn('Please select an Excel file.');
      return;
    }
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error('Invalid file type. Please upload an Excel file (.xlsx or .xls).');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length <= 1) {
        toast.warn('Excel file is empty or missing data.');
        return;
      }
      setExcelData(data.slice(1));
      toast.success('Excel file loaded! Ready to upload.');
    };
    reader.readAsBinaryString(file);
  };

  const handleExcelUpload = async () => {
    if (!excelData.length) {
      toast.warn('No Excel data to upload.');
      return;
    }
    setIsUploading(true);
    const uploadingToast = toast.info('Uploading...', { autoClose: false });
    let successCount = 0;
    let failCount = 0;
    for (const row of excelData) {
      const [name, motherName, school, phone] = row;
      try {
        await axios.post('https://stdent-reg-bk.onrender.com/api/students', { name, motherName, school, phone });
        successCount++;
      } catch (err) {
        failCount++;
      }
    }
    toast.dismiss(uploadingToast);
    if (successCount > 0) toast.success(`${successCount} students registered from Excel!`);
    if (failCount > 0) toast.error(`${failCount} students failed to register from Excel.`);
    if (successCount === 0 && failCount === 0) toast.info('No students were uploaded.');
    setExcelData([]);
    setFileName('');
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.motherName || !form.school || !form.phone) {
      toast.warn('Please fill in all fields.');
      return;
    }
    setIsRegistering(true);
    const registeringToast = toast.info('Registering...', { autoClose: false });
    try {
      await axios.post('https://stdent-reg-bk.onrender.com/api/students', form);
      toast.dismiss(registeringToast);
      toast.success(`Student "${form.name}" registered successfully!`);
      setForm({ name: '', motherName: '', school: '', phone: '' });
    } catch (err) {
      toast.dismiss(registeringToast);
      toast.error('Registration failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h1>
        <p className="text-gray-600 mb-8">Register students individually or upload Excel file</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Excel Upload Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <FaFileExcel className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Bulk Registration</h2>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
              <div className="relative">
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  onChange={handleExcel} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="excel-upload"
                />
                <label 
                  htmlFor="excel-upload" 
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-gray-500 truncate mr-2">
                    {fileName || 'Choose Excel file (.xlsx, .xls)'}
                  </span>
                  <FaUpload className="text-gray-400" />
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Excel Format Requirements:</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Column A: Student Name (MAGACA ARDAYGA)</li>
                <li>• Column B: Mother's Name (MAGACA HOOOYADA)</li>
                <li>• Column C: School (DUGSIGA)</li>
                <li>• Column D: Phone Number (Telefonka Ardayga)</li>
              </ul>
            </div>

            <button 
              onClick={handleExcelUpload} 
              disabled={!excelData.length || isUploading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                !excelData.length 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  Upload Excel ({excelData.length} students)
                </>
              )}
            </button>
          </motion.div>

          {/* Individual Registration Card */}
          <motion.form 
            onSubmit={handleSubmit}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <FaUserPlus className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Individual Registration</h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserGraduate className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Student Name" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  required 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserShield className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Mother's Name" 
                  value={form.motherName} 
                  onChange={e => setForm({ ...form, motherName: e.target.value })} 
                  required 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSchool className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="School" 
                  value={form.school} 
                  onChange={e => setForm({ ...form, school: e.target.value })} 
                  required 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })} 
                  required 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isRegistering}
              className={`w-full mt-6 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all ${
                isRegistering 
                  ? 'bg-green-400 text-white cursor-wait' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isRegistering ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Register Student
                </>
              )}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegister;