const API_URL = 'https://chatbot-0pmq.onrender.com/api';

export async function getConversations(chatbotId) {
  try {
    const response = await fetch(`${API_URL}/chat/conversations?chatbotId=${chatbotId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
}

export async function createConversation(conversationData) {
    try {
      const response = await fetch(`${API_URL}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(conversationData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create conversation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

export async function getConversation(conversationId) {
  try {
    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

export async function sendMessage(conversationId, message) {
  try {
    const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
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
  
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  
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
  
    if (!response.ok) {
      throw new Error('Failed to add note');
    }
  
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
  
    if (!response.ok) {
      throw new Error('Failed to update tags');
    }
  
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
  
    if (!response.ok) {
      throw new Error('Failed to update priority');
    }
  
    return response.json();
  }