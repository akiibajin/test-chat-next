export default class BaseRepository<T> {
  constructor(private baseUrl: string) {}

  async create(data: Partial<T>): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Create failed");
    return response.json();
  }

  async read(id: string | number): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error("Read failed");
    return response.json();
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Update failed");
    return response.json();
  }

  async delete(id: string | number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete failed");
  }

  async list(params: string, config?: RequestInit): Promise<T[]> {
    const response = await fetch(this.baseUrl + params, config);
    if (!response.ok) {
      console.log({ response });
      throw new Error("List failed");
    }
    return response.json();
  }
}
