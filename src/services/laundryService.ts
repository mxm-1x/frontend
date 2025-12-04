import api from './api';

export interface LaundryItem {
    id: number;
    bagNumber: string;
    pickupDate: string;
    deliveryDate: string | null;
    status: 'PENDING' | 'PICKED_UP' | 'WASHED' | 'DELIVERED';
    shirts: number;
    bottoms: number;
    towels: number;
    bedsheets: number;
    others: number;
    totalItems: number;
    issue: string | null;
    studentId: number;
    student?: {
        name: string;
        email: string;
        gender: string;
        bagNumber: string;
    };
    Student?: {
        name: string;
        email: string;
        gender: string;
        bagNumber: string;
    };
}

export interface CreateLaundryTicket {
    shirts: number;
    bottoms: number;
    towels: number;
    bedsheets: number;
    others: number;
}

export const laundryService = {
    // Student endpoints
    getMyLaundry: async (): Promise<LaundryItem[]> => {
        const response = await api.get('/students/laundry');
        return response.data;
    },

    createLaundryTicket: async (data: CreateLaundryTicket) => {
        const response = await api.post('/students/laundry', data);
        return response.data;
    },

    updateMyLaundryStatus: async (id: number, status: string) => {
        const response = await api.patch(`/students/laundry/${id}`, { status });
        return response.data;
    },

    updateMyLaundryIssue: async (id: number, issue: string) => {
        const response = await api.patch(`/students/laundry/${id}/issue`, { issue });
        return response.data;
    },

    deleteLaundryTicket: async (id: number) => {
        const response = await api.delete(`/students/laundry/${id}`);
        return response.data;
    },

    // Staff endpoints
    getAllLaundry: async (): Promise<LaundryItem[]> => {
        const response = await api.get('/laundry');
        return response.data;
    },

    updateLaundryStatus: async (id: number, status: string) => {
        const response = await api.patch(`/laundry/${id}`, { status });
        return response.data;
    },

    updateLaundryIssue: async (id: number, issue: string) => {
        const response = await api.patch(`/laundry/${id}/issue`, { issue });
        return response.data;
    },
};
