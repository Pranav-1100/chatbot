'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getConversation, sendStreamMessage, addNote, updateConversationTags, updatePriority } from '../../../services/conversationService';

export default function Chat({ params }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [priority, setPriority] = useState('Moderate');
  const router = useRouter();
  const conversationId = params.conversationId;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const fetchedConversation = await getConversation(conversationId);
      setConversation(fetchedConversation);
      setMessages(fetchedConversation.Messages || []);
      setTags(fetchedConversation.conversationTags || []);
      setPriority(fetchedConversation.priority || 'Moderate');
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setMessages(prev => [...prev, { chatText: newMessage, chatUser: 'user' }]);
      setNewMessage('');

      const response = await sendStreamMessage(conversationId, newMessage);
      const reader = response.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'bot') {
              botResponse += data.content;
              setMessages(prev => [
                ...prev.slice(0, -1),
                { chatText: botResponse, chatUser: 'bot' }
              ]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      const updatedConversation = await addNote(conversationId, note);
      setConversation(updatedConversation);
      setNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    const updatedTags = [...tags, newTag];
    try {
      const updatedConversation = await updateConversationTags(conversationId, updatedTags);
      setConversation(updatedConversation);
      setTags(updatedTags);
      setNewTag('');
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    try {
      const updatedConversation = await updatePriority(conversationId, newPriority);
      setConversation(updatedConversation);
      setPriority(newPriority);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!conversation) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">{conversation.subject || 'Chat'}</h1>
      
      <div className="flex mb-4 space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => handleUpdatePriority(e.target.value)}
            className="w-full bg-gray-800 text-white rounded p-2"
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex items-center">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-grow bg-gray-800 text-white rounded-l p-2"
              placeholder="Add a tag"
            />
            <button
              onClick={handleAddTag}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r"
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap">
            {tags.map((tag, index) => (
              <span key={index} className="bg-indigo-600 text-white text-sm rounded-full px-3 py-1 mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-grow bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.chatUser === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.chatUser === 'user' ? 'bg-indigo-600' : 'bg-gray-700'} max-w-3/4`}>
              {message.chatText}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex mb-4">
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

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Add Note</label>
        <div className="flex">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-grow bg-gray-700 text-white rounded-l p-2"
            placeholder="Add a note..."
          />
          <button
            onClick={handleAddNote}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r"
          >
            Add Note
          </button>
        </div>
      </div>

      {conversation.notes && conversation.notes.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Notes</h2>
          {conversation.notes.map((note, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded mb-2">
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}