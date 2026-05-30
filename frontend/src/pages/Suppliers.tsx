import { SuppliersTable } from "../modules/suppliers/suppliersTable";

export default function Suppliers() {
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
      <SuppliersTable />
    </div>
  );
}
