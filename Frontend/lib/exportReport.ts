function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), filename);
}

/** Demo PDF export — minimal valid PDF with report summary text */
export function exportPdfReport(filename: string, title: string, lines: string[]) {
  const summary = [title, `Generated ${new Date().toLocaleString()}`, ...lines].join('  |  ').slice(0, 240);
  const safe = summary.replace(/[^\x20-\x7E]/g, ' ');

  const stream = `BT /F1 11 Tf 50 750 Td (${safe}) Tj ET`;
  const pdf = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${stream.length}>>stream
${stream}
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000264 00000 n 
0000000400 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
460
%%EOF`;

  triggerDownload(new Blob([pdf], { type: 'application/pdf' }), filename);
}
