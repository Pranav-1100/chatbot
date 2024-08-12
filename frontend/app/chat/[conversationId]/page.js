'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getConversation, sendStreamMessage, addNote, updateConversationTags, updatePriority } from '../../../services/chatService';

export default function Chat({ params }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [priority, setPriority] = useState('Moderate');
  const [isThinking, setIsThinking] = useState(false);
  const router = useRouter();
  const conversationId = params.conversationId;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  // Add this new useEffect hook
  useEffect(() => {
    const savedMessages = localStorage.getItem(`messages_${conversationId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [conversationId]);

  // Add this new useEffect hook
  useEffect(() => {
    localStorage.setItem(`messages_${conversationId}`, JSON.stringify(messages));
  }, [messages, conversationId]);

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
  
    const userMessage = { chatText: newMessage, chatUser: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsThinking(true);
  
    try {
      const response = await sendStreamMessage(conversationId, newMessage);
      const reader = response.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';
  
      setMessages(prev => [...prev, { chatText: '', chatUser: 'bot' }]);
  
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
    } finally {
      setIsThinking(false);
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
    <div className="min-h-screen bg-gray-900 text-white p-4 flex">
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-bold mb-4">Chat Settings</h2>
        <div className="mb-4">
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
        <div className="mb-4">
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
      
      <div className="w-2/4 flex flex-col">
        <div className="bg-gray-800 rounded-t-lg p-4">
          <h1 className="text-2xl font-bold text-center">{conversation.Chatbot?.name || 'Chat'}</h1>
        </div>
        <div className="flex-grow bg-gray-800 p-4 overflow-y-auto h-[calc(100vh-16rem)]">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.chatUser === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.chatUser === 'user' ? 'bg-indigo-600' : 'bg-gray-700'} ${message.chatUser === 'user' ? 'max-w-[70%]' : 'max-w-[60%]'}`}>
                {message.chatText}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="text-left">
              <div className="inline-block p-2 rounded-lg bg-gray-700 animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="bg-gray-800 rounded-b-lg p-4">
          <div className="flex">
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
          </div>
        </form>
      </div>

      <div className="w-1/4 pl-4">
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        <div className="mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-800 text-white rounded p-2 mb-2"
            placeholder="Add a note..."
          />
          <button
            onClick={handleAddNote}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Note
          </button>
        </div>
        {conversation.notes && conversation.notes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-20rem)]">
            {conversation.notes.map((note, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded mb-2">
                {note}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}