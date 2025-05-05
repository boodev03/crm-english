import axios, { AxiosError } from 'axios';
import axiosInstance from '../config/axiosInstance';

export const registerUser = async ({ email, password, role }: { email: string, password: string, role?: string }) => {
    try {
        const response = await axiosInstance.post('/auth/register', {
            email,
            password,
            role
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error: string }>;
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error);
            }
            throw new Error(`Registration failed: ${axiosError.message}`);
        }
        throw new Error('Registration failed. Please try again later.');
    }
};

export const loginUser = async ({ email, password }: { email: string, password: string }) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error: string }>;
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error);
            }
            throw new Error(`Login failed: ${axiosError.message}`);
        }
        throw new Error('Login failed. Please try again later.');
    }
};

export const getUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/user');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ error: string }>;
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error);
            }
            throw new Error(`Failed to get user: ${axiosError.message}`);
        }
        throw new Error('Failed to get user. Please try again later.');
    }
};

export const logoutUser = async () => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error: unknown) {
        console.error('Logout failed:', error);
        throw new Error('Logout failed. Please try again later.');
    }
};
