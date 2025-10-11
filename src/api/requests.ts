import { User, Item, ItemsResponse, GetItemResponse, ApiError, LoginRequest, LoginResponse, AddItemRequest, AddItemResponse, DeleteItemResponse, UpdateItemRequest, UpdateItemResponse } from '../types/api';

// API Configuration
export const API_BASE_URL = 'http://localhost:5050';

// Helper function to get access token from localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem('access-token');
};

// Helper function to create headers with access token
const createAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'access-token': token })
  };
};

// Function to signup user
export const signupUser = async (name: string, email: string, password: string, passwordConfirmation: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordConfirmation
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
// Function to get current user data
export const getCurrentUser = async (): Promise<User> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Access token not found in localStorage');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Function to get all items (public endpoint)
export const getAllItems = async (): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-all-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ItemsResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

// Utility function to check if user is admin
export const isAdmin = async (): Promise<boolean> => {
  try {
    if (!isAuthenticated()) {
      return false;
    }
    
    const user = await getCurrentUser();
    return user.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Function to clear authentication (logout)
export const clearAuth = (): void => {
  localStorage.removeItem('access-token');
};

// Function to login user
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const loginData: LoginRequest = {
    email,
    password
  };

  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const loginResponse: LoginResponse = await response.json();
    
    // Store the access token in localStorage
    localStorage.setItem('access-token', loginResponse.accessToken);
    
    return loginResponse;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Function to get a specific item by ID (public endpoint)
export const getItem = async (itemId: number): Promise<Item> => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-item/${itemId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GetItemResponse = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

// Function to add a new item (authenticated endpoint)
export const addItem = async (itemData: AddItemRequest): Promise<Item> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Access token not found. Please login first.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/add-item`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: AddItemResponse = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Function to delete an item (authenticated endpoint)
export const deleteItem = async (itemId: number): Promise<string> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Access token not found. Please login first.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/delete-item/${itemId}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DeleteItemResponse = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// Function to update an item (authenticated endpoint)
export const updateItem = async (itemId: number, itemData: UpdateItemRequest): Promise<Item> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('Access token not found. Please login first.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/update-item/${itemId}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: UpdateItemResponse = await response.json();
    return data.item;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};
