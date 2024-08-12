const API_URL = 'http://localhost:234/api'; // Adjust this to your backend URL

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
      Messages: data.Messages || [] // Ensure Messages is always an array
    };
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