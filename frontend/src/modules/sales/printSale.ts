import type { TFunction } from "i18next";
import dayjs from "dayjs";
import type { ICart } from "./types";
import { discountPct } from "./discount";
import { money } from "../analytics/format";
import { esc, printHtml } from "../../utils/print";

// Builds a clean A4 HTML document from the open cart and sends it to the printer.
// Iterates `cart.items` directly — never the live table's dataSource, which holds
// a synthetic { isNew: true } row that must not be printed.
export function printSale(cart: ICart, t: TFunction): void {
  const title = t("print.saleTitle");
  const items = cart.items ?? [];

  if (items.length === 0) {
    printHtml(
      title,
      `<div class="doc-header"><h1>${esc(title)}</h1></div>` +
        `<p class="empty">${esc(t("print.empty"))}</p>`,
    );
    return;
  }

  // Each column: header label + cell class (controls alignment).
  const headers = [
    { label: t("columns.num"), cls: "num" },
    { label: t("columns.id"), cls: "center" },
    { label: t("columns.name"), cls: "" },
    { label: t("columns.type"), cls: "center" },
    { label: t("columns.oem"), cls: "" },
    { label: t("columns.qty"), cls: "num" },
    { label: t("sales.originalPrice"), cls: "num" },
    { label: t("columns.discount"), cls: "num" },
    { label: t("columns.price"), cls: "num" },
    { label: t("columns.total"), cls: "num" },
  ];

  const head = headers
    .map((h) => `<th class="${h.cls}">${esc(h.label)}</th>`)
    .join("");

  const rows = items
    .map((it, i) => {
      const pct = discountPct(it);
      return (
        `<tr>` +
        `<td class="num">${i + 1}</td>` +
        `<td class="center">${esc(it.productId)}</td>` +
        `<td>${esc(it.name)}</td>` +
        `<td class="center">${esc(it.type)}</td>` +
        `<td>${esc(it.oem ?? "")}</td>` +
        `<td class="num">${esc(it.quantity)}</td>` +
        `<td class="num">${money(it.sale_price)}</td>` +
        `<td class="num">${pct > 0 ? `-${pct}%` : ""}</td>` +
        `<td class="num">${money(it.priceAtSale)}</td>` +
        `<td class="num">${money(it.totalPrice)}</td>` +
        `</tr>`
      );
    })
    .join("");

  const body =
    `<div class="doc-header">` +
    `<h1>${esc(title)}</h1>` +
    `<div class="doc-meta">` +
    `<div>${esc(t("sales.receipt"))} #${esc(cart.id)}</div>` +
    `<div>${esc(dayjs().format("YYYY-MM-DD HH:mm"))}</div>` +
    `<div>${esc(t("columns.total"))}: ${money(cart.totalAmount)}</div>` +
    `</div>` +
    `</div>` +
    `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;

  printHtml(title, body);
}
