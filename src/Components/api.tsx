import { create } from 'apisauce';

const api = create({
  baseURL: 'https://api.logelitefm.com/api', // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
