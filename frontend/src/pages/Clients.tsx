import { ClientsTable } from "../modules/clients/clientsTable";

export default function Clients() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <ClientsTable />
    </div>
  );
}
