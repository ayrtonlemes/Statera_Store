import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },
}; 