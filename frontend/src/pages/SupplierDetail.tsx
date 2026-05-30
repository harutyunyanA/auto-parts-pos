import { useParams } from "react-router-dom";
import { SupplierDetail as SupplierDetailModule } from "../modules/suppliers/supplierDetail";

export default function SupplierDetail() {
  const { id } = useParams<{ id: string }>();

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
      <SupplierDetailModule id={Number(id)} />
    </div>
  );
}
