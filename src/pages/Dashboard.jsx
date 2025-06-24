import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import CalledStudentCards from './CalledStudentCards';
import useCalledStudents from './useCalledStudents';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, monthly: [] });
  const [loading, setLoading] = useState(true);
  const calledStudents = useCalledStudents();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://stdent-reg-bk.onrender.com/api/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Registrations',
        data: months.map((_, i) => {
          const found = stats.monthly.find(m => m._id === i + 1);
          return found ? found.count : 0;
        }),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280' }
      },
      y: {
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
        ticks: { color: '#6b7280' }
      }
    }
  };

  const statsCards = [
    {
      icon: <FaUsers className="text-4xl" />,
      value: stats.total,
      label: 'Total Students',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      value: `+${calledStudents.length}`,
      label: 'Called Students',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Key metrics and analytics at a glance</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  <div className="p-6 flex items-center gap-4">
                    <div className={`p-4 rounded-full ${card.color}`}>
                      {card.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <div className="text-gray-600">{card.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Registrations</h2>
              <div className="h-80">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CalledStudentCards />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;