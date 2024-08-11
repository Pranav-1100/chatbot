import { useState } from 'react';

export default function NewConversationModal({ onClose, onCreateConversation, chatbotId }) {
  const [endUserName, setEndUserName] = useState('');
  const [endUserEmail, setEndUserEmail] = useState('');
  const [source, setSource] = useState('website');
  const [externalId, setExternalId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new conversation');
    onCreateConversation({
      chatbotId,
      endUserName,
      endUserEmail,
      source,
      externalId,
      message
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Create New Conversation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="endUserName" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="endUserName"
              value={endUserName}
              onChange={(e) => setEndUserName(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endUserEmail" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="endUserEmail"
              value={endUserEmail}
              onChange={(e) => setEndUserEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="source" className="block text-sm font-medium text-gray-300">Source</label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <option value="website">Website</option>
              <option value="mobile">Mobile</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="externalId" className="block text-sm font-medium text-gray-300">External ID</label>
            <input
              type="text"
              id="externalId"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Initial Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}