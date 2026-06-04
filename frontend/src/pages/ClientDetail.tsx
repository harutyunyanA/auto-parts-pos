import { useParams } from "react-router-dom";
import { ClientDetail as ClientDetailModule } from "../modules/clients/clientDetail";

export default function ClientDetail() {
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
      <ClientDetailModule id={Number(id)} />
    </div>
  );
}
