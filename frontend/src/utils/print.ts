// Generic, dependency-free print engine. Knows nothing about carts or products.
// It writes a self-contained HTML document into an off-screen iframe and triggers
// the browser's native print dialog. The browser renders the HTML and hands it to
// the OS printer driver — so it works with any ordinary printer (A4 laser/inkjet).

// Escape dynamic text so values like "A&B" or "<" don't break the markup.
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Shared A4 table styling, injected into every printed document.
export const PRINT_CSS = `
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Arial, "Noto Sans Armenian", sans-serif;
    color: #000; margin: 0; font-size: 12px;
  }
  .doc-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 12px; border-bottom: 2px solid #000; padding-bottom: 6px;
  }
  .doc-header h1 { font-size: 18px; margin: 0; }
  .doc-meta { text-align: right; font-size: 11px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; }
  thead { display: table-header-group; }      /* repeat header on every page */
  th, td { border: 1px solid #444; padding: 4px 6px; text-align: left; }
  th { background: #eee; font-weight: bold; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  td.center, th.center { text-align: center; }
  tr { page-break-inside: avoid; }
  .empty { padding: 24px; text-align: center; color: #666; }
`;

// Lifecycle-managed primitive. `bodyHtml` is the inner HTML of <body>.
// Uses `srcdoc` so the iframe loads our content in a single `load` event —
// document.write would fire `load` twice (about:blank, then the written doc),
// and the first, empty firing would print the parent page instead.
export function printHtml(title: string, bodyHtml: string): void {
  const html =
    `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title>` +
    `<style>${PRINT_CSS}</style></head><body>${bodyHtml}</body></html>`;

  const iframe = document.createElement("iframe");
  // Off-screen but still rendered (display:none can suppress printing in some engines).
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");

  let triggered = false;
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    // Defer removal so the print dialog has fully grabbed the document.
    setTimeout(() => iframe.remove(), 1000);
  };

  iframe.onload = () => {
    if (triggered) return; // guard against any extra load firing
    triggered = true;
    const win = iframe.contentWindow;
    if (!win) {
      cleanup();
      return;
    }
    win.onafterprint = cleanup;
    win.focus(); // Safari/WebKit needs focus before print()
    win.print();
    // Safety net in case onafterprint never fires.
    setTimeout(cleanup, 60000);
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
}
