import type { ClientType } from "./clients.types.ts";

class ClientsService {
  private mockClients: ClientType[] = [
    { id: 1, name: "Default", phone: "+1234567890" },
    { id: 2, name: "John Doe", phone: "+1234567890" },
    { id: 3, name: "Jane Smith", phone: "+0987654321" },
    { id: 4, name: "Bob Johnson", phone: "+1122334455" },
  ];

  async getAllClients(): Promise<ClientType[]> {
    return this.mockClients;
  }
}

export default new ClientsService();
