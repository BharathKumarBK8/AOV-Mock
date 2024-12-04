// ApiOffer.js
import { axiosInstance } from './Api';

const ITEMS_ENDPOINT = '/items';

export const ApiOffer = {
  getAllOffers: async () => {
    try {
      const response = await axiosInstance.get(ITEMS_ENDPOINT);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch offers');
    }
  },

  createOffer: async (offer) => {
    try {
      const response = await axiosInstance.post(ITEMS_ENDPOINT, offer);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create offer');
    }
  },

  searchOffers: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(`${ITEMS_ENDPOINT}/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search offers: ${error.message}`);
    }
  },

  updateOffer: async (id, offer) => {
    try {
      const response = await axiosInstance.put(`${ITEMS_ENDPOINT}/${id}`, offer);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update offer');
    }
  },

  deleteOffer: async (id) => {
    try {
      await axiosInstance.delete(`${ITEMS_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete offer');
    }
  }
};
