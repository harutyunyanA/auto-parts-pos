import type { TFunction } from "i18next";
import dayjs from "dayjs";
import type { IProduct } from "../products/types";
import { money } from "../analytics/format";
import { esc, printHtml } from "../../utils/print";

// Builds a clean A4 HTML document listing every deficit product and prints it.
export function printDeficit(products: IProduct[], t: TFunction): void {
  const title = t("print.deficitTitle");

  if (products.length === 0) {
    printHtml(
      title,
      `<div class="doc-header"><h1>${esc(title)}</h1></div>` +
        `<p class="empty">${esc(t("print.empty"))}</p>`,
    );
    return;
  }

  const headers = [
    { label: t("columns.num"), cls: "num" },
    { label: t("columns.code"), cls: "center" },
    { label: t("columns.name"), cls: "" },
    { label: t("columns.type"), cls: "center" },
    { label: t("columns.oem"), cls: "" },
    { label: t("columns.qty"), cls: "num" },
    { label: t("columns.min"), cls: "num" },
    { label: t("columns.purchasePrice"), cls: "num" },
  ];

  const head = headers
    .map((h) => `<th class="${h.cls}">${esc(h.label)}</th>`)
    .join("");

  const rows = products
    .map((p, i) => {
      return (
        `<tr>` +
        `<td class="num">${i + 1}</td>` +
        `<td class="center">${esc(p.code)}</td>` +
        `<td>${esc(p.name)}</td>` +
        `<td class="center">${esc(p.type)}</td>` +
        `<td>${esc(p.oem ?? "")}</td>` +
        `<td class="num">${esc(p.quantity)}</td>` +
        `<td class="num">${esc(p.minimum_quantity)}</td>` +
        `<td class="num">${money(p.purchase_price)}</td>` +
        `</tr>`
      );
    })
    .join("");

  const body =
    `<div class="doc-header">` +
    `<h1>${esc(title)}</h1>` +
    `<div class="doc-meta"><div>${esc(dayjs().format("YYYY-MM-DD HH:mm"))}</div></div>` +
    `</div>` +
    `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;

  printHtml(title, body);
}
