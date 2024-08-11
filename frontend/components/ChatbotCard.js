import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ChatbotCard({ chatbot, onViewConversations }) {
  return (
    <motion.div
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2 className="text-xl font-bold mb-2">{chatbot.name}</h2>
      <p className="text-gray-400 mb-4">{chatbot.config?.description || 'No description'}</p>
      <div className="flex flex-wrap mb-4">
        {chatbot.conversationTags?.map((tag, index) => (
          <span key={index} className="bg-indigo-600 text-white text-sm rounded-full px-3 py-1 mr-2 mb-2">
            {tag}
          </span>
        ))}
      </div>
      <button
        className="flex items-center text-indigo-400 hover:text-indigo-300"
        onClick={() => onViewConversations(chatbot.id)}
      >
        View Conversations <ChevronRight className="ml-1" />
      </button>
    </motion.div>
  );
}