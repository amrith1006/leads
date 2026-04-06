const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch dashboard statistics (total leads, status breakdown, source breakdown, employee breakdown).
 */
export const getDashboardStats = async (date_from, date_to) => {
    try {
        const queryParams = new URLSearchParams();
        if (date_from) queryParams.append('date_from', date_from);
        if (date_to) queryParams.append('date_to', date_to);
        
        let url = `${BASE_URL}/dashboard`;
        if (queryParams.toString()) url += `?${queryParams.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

/**
 * Fetch a paginated and filtered list of leads.
 */
export const getLeads = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.source) queryParams.append('lead_source', params.source);
        if (params.search) queryParams.append('search', params.search);
        if (params.date_from) queryParams.append('date_from', params.date_from);
        if (params.date_to) queryParams.append('date_to', params.date_to);
        
        // Default limit to 200 as per backend main.py
        queryParams.append('limit', 200);

        const response = await fetch(`${BASE_URL}/leads?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch leads');
        return await response.json();
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
};

/**
 * Upload an Excel file to the backend.
 */
export const uploadLeads = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Upload failed');
        return data;
    } catch (error) {
        console.error('Error uploading leads:', error);
        throw error;
    }
};

/**
 * Export leads to Excel.
 */
export const exportLeads = async () => {
    try {
        window.open(`${BASE_URL}/export`, '_blank');
    } catch (error) {
        console.error('Error exporting leads:', error);
    }
};
