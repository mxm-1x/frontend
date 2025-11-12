import api from './api';

export interface StudentRegisterData {
    name: string;
    email: string;
    password: string;
    bagNumber: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface StaffRegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const authService = {
    studentRegister: async (data: StudentRegisterData) => {
        const response = await api.post('/auth/student/register', data);
        return response.data;
    },

    studentLogin: async (data: LoginData) => {
        const response = await api.post('/auth/student/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', 'student');
        }
        return response.data;
    },

    staffRegister: async (data: StaffRegisterData) => {
        const response = await api.post('/auth/staff/register', data);
        return response.data;
    },

    staffLogin: async (data: LoginData) => {
        const response = await api.post('/auth/staff/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRole', 'staff');
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    },

    getToken: () => localStorage.getItem('token'),
    getUserRole: () => localStorage.getItem('userRole'),
};
