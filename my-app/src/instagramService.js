// src/instagramService.js
import axios from 'axios';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';
const ACCESS_TOKEN = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN;

export const fetchInstagramPhotos = async () => {
  try {
    const response = await axios.get(INSTAGRAM_API_URL, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
        access_token: ACCESS_TOKEN,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Instagram photos', error);
    throw error;
  }
};
