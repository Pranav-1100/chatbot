'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Plus, Filter, User } from 'lucide-react';
import { motion } from 'framer-motion';

// Assuming you have a service to fetch chatbots
import { getChatbots, createChatbot } from '../../services/chatbotService';

export default function ChatbotDashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [showNewChatbotModal, setShowNewChatbotModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    const fetchedChatbots = await getChatbots();
    setChatbots(fetchedChatbots);
  };

  const filteredChatbots = chatbots.filter(chatbot => {
    if (filter === 'all') return true;
    return chatbot.priority === filter;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Chatbot Dashboard</h1>
        <div className="relative">
          <User className="cursor-pointer" onClick={() => {/* Implement dropdown */}} />
          {/* Implement dropdown menu here */}
        </div>
      </header>

      <main className="p-8">
        <div className="flex justify-between mb-6">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={() => setShowNewChatbotModal(true)}
          >
            <Plus className="mr-2" /> New Chatbot
          </button>
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              className="bg-gray-800 text-white rounded p-2"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            >
              <option value="all">All</option>
              <option value="Urgent">Urgent</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChatbots.map((chatbot) => (
            <motion.div
              key={chatbot.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-bold mb-2">{chatbot.name}</h2>
              <p className="text-gray-400 mb-4">{chatbot.description}</p>
              <div className="flex flex-wrap mb-4">
                {chatbot.conversationTags.map((tag, index) => (
                  <span key={index} className="bg-indigo-600 text-white text-sm rounded-full px-3 py-1 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                className="flex items-center text-indigo-400 hover:text-indigo-300"
                onClick={() => router.push(`/chatbot/${chatbot.id}`)}
              >
                View Conversations <ChevronRight className="ml-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {showNewChatbotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Create New Chatbot</h2>
            {/* Implement form for creating new chatbot */}
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowNewChatbotModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}