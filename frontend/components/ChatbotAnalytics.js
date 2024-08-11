import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getChatbotAnalytics } from '../services/chatbotService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChatbotAnalytics({ chatbots }) {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await Promise.all(chatbots.map(chatbot => getChatbotAnalytics(chatbot.id)));
      setAnalyticsData(data);
    };
    fetchAnalytics();
  }, [chatbots]);

  const chartData = {
    labels: chatbots.map(chatbot => chatbot.name),
    datasets: [
      {
        label: 'Total Conversations',
        data: analyticsData.map(data => data.totalConversations),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Total Messages',
        data: analyticsData.map(data => data.totalMessages),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chatbot Analytics',
      },
    },
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Chatbot Analytics</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}