import { BulkDiscountPanel } from "../modules/discounts/bulkDiscountPanel";
import { DiscountsTable } from "../modules/discounts/discountsTable";

export default function Discounts() {
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
      <BulkDiscountPanel />
      <DiscountsTable />
    </div>
  );
}
