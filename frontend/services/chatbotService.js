const API_URL = 'https://chatbot-0pmq.onrender.com/api';

export async function getChatbots() {
  try {
    const response = await fetch(`${API_URL}/chatbots`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch chatbots');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    throw error;
  }
}

export async function createChatbot(chatbotData) {
  try {
    const response = await fetch(`${API_URL}/chatbots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(chatbotData),
    });
    if (!response.ok) throw new Error('Failed to create chatbot');
    return await response.json();
  } catch (error) {
    console.error('Error creating chatbot:', error);
    throw error;
  }
}

export async function updateChatbot(id, updates) {
  try {
    const response = await fetch(`${API_URL}/chatbots/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update chatbot');
    return await response.json();
  } catch (error) {
    console.error('Error updating chatbot:', error);
    throw error;
  }
}

export async function deleteChatbot(id) {
  try {
    const response = await fetch(`${API_URL}/chatbots/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete chatbot');
    return await response.json();
  } catch (error) {
    console.error('Error deleting chatbot:', error);
    throw error;
  }
}

export async function getChatbotAnalytics(id) {
  try {
    const response = await fetch(`${API_URL}/chatbots/${id}/analytics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch chatbot analytics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chatbot analytics:', error);
    throw error;
  }
}