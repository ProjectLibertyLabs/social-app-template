import axios from 'axios';
import { SIWFResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:3019'; // Update with your backend URL

export class AuthService {
  static async initiateSIWF(): Promise<SIWFResponse> {
    try {
      console.log('initiateSIWF');
      const response = await axios.get(`${API_BASE_URL}/auth/login/v2/siwf`);
      console.log('response', response);
      return response.data;
    } catch (error) {
      throw new Error('Failed to initiate SIWF login');
    }
  }

  static async postSIWF(payload: any): Promise<void> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/v2/siwf`, payload);
      return response.data;
    } catch (error) {
      throw new Error('Failed to post SIWF');
    }
  }
} 