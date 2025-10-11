// Types for API responses

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Item {
  id: number;
  name: string;
  price: string;
  quantity: number;
  size: string;
  color: string;
  description: string;
  category: string;
  brand: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ItemsResponse {
  items: Item[];
}

export interface GetItemResponse {
  item: Item;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface AddItemRequest {
  name: string;
  price: number;
  size: string;
  color: string;
  description: string;
  category: string;
  brand: string;
  quantity: number;
  imageUrl?: string;
}

export interface AddItemResponse {
  item: Item;
}

export interface DeleteItemResponse {
  message: string;
}

export interface UpdateItemRequest {
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  description: string;
  category: string;
  brand: string;
  imageUrl?: string;
}

export interface UpdateItemResponse {
  item: Item;
}