const API_URL = 'http://localhost:3004';

export const api = {
  async getAllOffers() {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch offers');
    return response.json();
  },

  async createOffer(offer) {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offer),
    });
    if (!response.ok) throw new Error('Failed to create offer');
    return response.json();
  },

  async updateOffer(id, offer) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offer),
    });
    if (!response.ok) throw new Error('Failed to update offer');
    return response.json();
  },

  async deleteOffer(id) {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete offer');
    return true;
  }
};
 
