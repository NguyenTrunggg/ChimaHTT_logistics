import apiClient from "./api.service";
import { Container } from "../types/container";

const BASE_URL = "/containers"; // Already prefixed in apiService

export const containerService = {
  async list(query: string = ""): Promise<Container[]> {
    return apiClient.get(`${BASE_URL}?${query}`, true);
  },

  async get(id: number): Promise<Container> {
    return apiClient.get(`${BASE_URL}/${id}`, true);
  },

  async track(containerNumber: string): Promise<Container> {
    return apiClient.get(`${BASE_URL}/track?q=${encodeURIComponent(containerNumber)}`);
  },

  async trackByVehicle(vehicleNumber: string): Promise<Container> {
    return apiClient.get(`${BASE_URL}/track-vehicle?q=${encodeURIComponent(vehicleNumber)}`);
  },

  async create(data: Partial<Container>): Promise<Container> {
    return apiClient.post(BASE_URL, data, true);
  },

  async update(id: number, data: Partial<Container>): Promise<Container> {
    return apiClient.put(`${BASE_URL}/${id}`, data, true);
  },

  async remove(id: number): Promise<void> {
    return apiClient.delete(`${BASE_URL}/${id}`, true);
  },
};

export type { Container }; 