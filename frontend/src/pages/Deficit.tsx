import { Deficit as DeficitTable } from "../modules/deficit/deficit";

export default function Deficit() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
      }}
    >
      <section id="main" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <DeficitTable />
      </section>
    </div>
  );
}
