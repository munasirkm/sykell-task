import axiosInstance from '../Api/axiosInstance';
import { Product } from '../types';

// Function to get all URLs from the database
const getAllUrls = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get('/urls'); // Adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    throw error;
  }
};

export const addUrl = async (url: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/urls', { original_url: url }); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error adding URL:', error);
    throw error;
  }
};

export const startcrawl = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/urls/${id}/start`); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error adding URL:', error);
    throw error;
  }
};

export const deleteUrl = async (ids: number[]): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/urls`, { data: ids }); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error adding URL:', error);
    throw error;
  }
};

export const reanalyzeUrl = async (ids: number[]): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/urls/reanalyze`, ids); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error adding URL:', error);
    throw error;
  }
};

export default {
  getAllUrls,
  addUrl,
  deleteUrl,
  reanalyzeUrl
}; 