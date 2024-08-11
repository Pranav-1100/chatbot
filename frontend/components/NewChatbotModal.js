import { useState } from 'react';

export default function NewChatbotModal({ onClose, onCreateChatbot }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [llmModel, setLlmModel] = useState('');
  const [llmPrompts, setLlmPrompts] = useState('');
  const [activePlan, setActivePlan] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      description,
      url,
      LLMModel: llmModel,
      LLMPrompts: llmPrompts,
    };
    onCreateChatbot({ name, config, activePlan });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-96 max-h-90vh overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Chatbot</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300">URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="llmModel" className="block text-sm font-medium text-gray-300">LLM Model</label>
            <input
              type="text"
              id="llmModel"
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="llmPrompts" className="block text-sm font-medium text-gray-300">LLM Prompts</label>
            <textarea
              id="llmPrompts"
              value={llmPrompts}
              onChange={(e) => setLlmPrompts(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="activePlan" className="block text-sm font-medium text-gray-300">Active Plan</label>
            <input
              type="text"
              id="activePlan"
              value={activePlan}
              onChange={(e) => setActivePlan(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
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