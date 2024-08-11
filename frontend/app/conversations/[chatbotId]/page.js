'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter } from 'lucide-react';
import { getConversations, createConversation } from '../../../services/conversationService';
import NewConversationModal from '../../../components/NewConversationModal';

export default function Conversations({ params }) {
  const [conversations, setConversations] = useState([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const router = useRouter();
  const chatbotId = params.chatbotId;

  useEffect(() => {
    fetchConversations();
  }, [chatbotId]);

  const fetchConversations = async () => {
    try {
      const fetchedConversations = await getConversations(chatbotId);
      setConversations(fetchedConversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const handleCreateConversation = async (conversationData) => {
    console.log('Creating new conversation:', conversationData);
    try {
      const newConversation = await createConversation(conversationData);
      console.log('New conversation created:', newConversation);
      setShowNewConversationModal(false);
      fetchConversations();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };
  const allTags = [...new Set(conversations.flatMap(conversation => conversation.conversationTags || []))];

  const filteredConversations = conversations.filter(conversation => {
    const priorityMatch = filter === 'all' || conversation.priority === filter;
    const tagMatch = tagFilter === 'all' || conversation.conversationTags?.includes(tagFilter);
    return priorityMatch && tagMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Conversations</h1>
      <div className="flex justify-between mb-6">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={() => setShowNewConversationModal(true)}
        >
          <Plus className="mr-2" /> New Conversation
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              className="bg-gray-800 text-white rounded p-2"
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center">
            <Filter className="mr-2" />
            <select
              className="bg-gray-800 text-white rounded p-2"
              onChange={(e) => setTagFilter(e.target.value)}
              value={tagFilter}
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConversations.map((conversation) => (
          <div key={conversation.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">{conversation.subject || 'No subject'}</h2>
            <p className="text-gray-400 mb-4">Priority: {conversation.priority}</p>
            <div className="flex flex-wrap mb-4">
              {conversation.conversationTags?.map((tag, index) => (
                <span key={index} className="bg-indigo-600 text-white text-sm rounded-full px-3 py-1 mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
            <button
              className="text-indigo-400 hover:text-indigo-300"
              onClick={() => router.push(`/chat/${conversation.id}`)}
            >
              View Chat
            </button>
          </div>
        ))}
      </div>
      {showNewConversationModal && (
        <NewConversationModal
          onClose={() => setShowNewConversationModal(false)}
          onCreateConversation={handleCreateConversation}
          chatbotId={chatbotId}
        />
      )}
    </div>
  );
}