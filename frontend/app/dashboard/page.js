'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User, LogOut, Settings } from 'lucide-react';
import { getChatbots, createChatbot } from '../../services/chatbotService';
import NewChatbotModal from '../../components/NewChatbotModal';
import ChatbotCard from '../../components/ChatbotCard';
import ChatbotAnalytics from '../../components/ChatbotAnalytics';

export default function ChatbotDashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [showNewChatbotModal, setShowNewChatbotModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchChatbots();
    }
  }, []);

  const fetchChatbots = async () => {
    try {
      const fetchedChatbots = await getChatbots();
      setChatbots(fetchedChatbots);
    } catch (error) {
      console.error('Failed to fetch chatbots:', error);
    }
  };

  const handleCreateChatbot = async (chatbotData) => {
    try {
      await createChatbot(chatbotData);
      setShowNewChatbotModal(false);
      fetchChatbots();
    } catch (error) {
      console.error('Failed to create chatbot:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Chatbot Dashboard</h1>
        <div className="relative">
          <User 
            className="cursor-pointer" 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
          />
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                onClick={() => router.push('/settings')}
              >
                <Settings className="inline mr-2" size={16} />
                Settings
              </button>
              <button
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                onClick={handleLogout}
              >
                <LogOut className="inline mr-2" size={16} />
                Logout
              </button>
            </div>
          )}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <ChatbotCard 
              key={chatbot.id} 
              chatbot={chatbot} 
              onViewConversations={() => router.push(`/conversations/${chatbot.id}`)}
            />
          ))}
        </div>
      </main>

      <div className="p-8">
        <ChatbotAnalytics chatbots={chatbots} />
      </div>
      {showNewChatbotModal && (
        <NewChatbotModal
          onClose={() => setShowNewChatbotModal(false)}
          onCreateChatbot={handleCreateChatbot}
        />
      )}
    </div>
  );
}