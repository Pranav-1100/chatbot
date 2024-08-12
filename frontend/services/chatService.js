const API_URL = 'http://localhost:234/api';

export async function getConversation(conversationId) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch conversation');
  const data = await response.json();
  return {
    ...data,
    Messages: data.Messages || [],
    notes: data.notes || [],
    conversationTags: data.conversationTags || [],
    priority: data.priority || 'Moderate'
  };
}

export async function getConversations(chatbotId) {
  const response = await fetch(`${API_URL}/chat/conversations?chatbotId=${chatbotId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch conversations');
  const data = await response.json();
  return data.map(conversation => ({
    ...conversation,
    conversationTags: conversation.conversationTags || [],
    priority: conversation.priority || 'Moderate'
  }));
}

export async function sendStreamMessage(conversationId, message) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.body;
}

export async function addNote(conversationId, note) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ note }),
  });
  if (!response.ok) throw new Error('Failed to add note');
  return response.json();
}

export async function getNotes(conversationId) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/notes`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
}

export async function updateConversationTags(conversationId, tags) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/tags`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ tags }),
  });
  if (!response.ok) throw new Error('Failed to update tags');
  return response.json();
}

export async function updatePriority(conversationId, priority) {
  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/priority`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ priority }),
  });
  if (!response.ok) throw new Error('Failed to update priority');
  return response.json();
}

export async function createConversation(conversationData) {
  const response = await fetch(`${API_URL}/chat/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(conversationData),
  });
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}