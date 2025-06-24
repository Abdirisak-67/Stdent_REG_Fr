import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const useCalledStudents = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(res => setStudents(res.data.filter(s => s.called)))
      .catch(() => setStudents([]));
  }, []);
  return students;
};

export default useCalledStudents;
