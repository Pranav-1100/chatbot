'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getConversation, sendMessage } from '../../../services/conversationService';

export default function Chat({ params }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const conversationId = params.conversationId;

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  const fetchConversation = async () => {
    try {
      const fetchedConversation = await getConversation(conversationId);
      setConversation(fetchedConversation);
      setMessages(fetchedConversation.Messages || []);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(conversationId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!conversation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">{conversation.subject || 'Chat'}</h1>
      <div className="bg-gray-800 rounded-lg p-4 h-[60vh] overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.chatUser === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.chatUser === 'user' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
              {message.chatText}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow bg-gray-700 text-white rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}