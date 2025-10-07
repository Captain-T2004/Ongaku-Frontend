import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const itineraryApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getWeather = async (city) => {
  try {
    const response = await api.get('/api/weather', {
      params: { city }
    });
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

export const getQuickSuggestions = async (userQuery, location, preferences = [], date = null) => {
  try {
    const requestBody = {
      user_query: userQuery,
      location,
      preferences,
    };
    
    if (date) {
      requestBody.date = date;
    }

    const response = await api.post('/api/suggest-quick', requestBody);
    return response.data;
  } catch (error) {
    console.error('Quick Suggestions API error:', error);
    throw error;
  }
};

export const getItinerary = async (location, durationDays, preferences = [], date = null, userQuery = null, language = 'en') => {
  try {
    const requestBody = {
      location,
      duration_days: durationDays,
      preferences,
      language
    };
    
    if (date) {
      requestBody.date = date;
    }
    
    if (userQuery) {
      requestBody.user_query = userQuery;
    }

    const response = await itineraryApi.post('/api/itinerary', requestBody);
    return response.data;
  } catch (error) {
    console.error('Itinerary API error:', error);
    throw error;
  }
};

export const geocodeCity = async (city, language = 'ja') => {
  try {
    const response = await api.get('/api/geocode', {
      params: { city, language }
    });
    return response.data;
  } catch (error) {
    console.error('Geocode API error:', error);
    throw error;
  }
};

export default api;
