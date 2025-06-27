import { apiClient } from "./api.service";

/**
 * Generic CRUD service providing common REST operations.
 * Concrete subclasses must specify the `endpoint` and can
 * override `authenticated` if endpoints require auth.
 *
 * SRP: This class encapsulates only HTTP CRUD logic.
 */
export abstract class CrudService<T, ID extends number | string = number> {
  /** Resource base path, e.g. "/jobs" */
  protected abstract endpoint: string;
  /** Whether requests need authentication by default */
  protected authenticated = false;

  /**
   * GET /resource
   */
  async list(query: string = ""): Promise<T[]> {
    const path = query ? `${this.endpoint}${query}` : this.endpoint;
    const res = await apiClient.get<any>(path, this.authenticated);
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return res.data ?? [];
  }

  /**
   * GET /resource/:id
   */
  async detail(id: ID): Promise<T> {
    const res = await apiClient.get<any>(`${this.endpoint}/${id}`, this.authenticated);
    return res.data ?? res;
  }

  /**
   * POST /resource
   */
  async create(payload: Partial<T>): Promise<T> {
    return apiClient.post<T>(this.endpoint, payload, true);
  }

  /**
   * PUT /resource/:id
   */
  async update(id: ID, payload: Partial<T>): Promise<T> {
    return apiClient.put<T>(`${this.endpoint}/${id}`, payload, true);
  }

  /**
   * DELETE /resource/:id
   */
  async remove(id: ID): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`, true);
  }
} 