import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { ApiBaseUrl } from '../Context/Context';

const useCalledStudents = () => {
  const [students, setStudents] = useState([]);
  const apiBaseUrl = useContext(ApiBaseUrl);
  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/students`)
      .then(res => setStudents(res.data.filter(s => s.called)))
      .catch(() => setStudents([]));
  }, [apiBaseUrl]);
  return students;
};

export default useCalledStudents;
