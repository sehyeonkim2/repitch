export const exportElementAsPdf = async (
  element: HTMLElement,
  filename = "repitch-proposal.pdf",
): Promise<void> => {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  const renderedWidth = pageWidth - 48;
  const renderedHeight = renderedWidth / ratio;

  if (renderedHeight <= pageHeight - 48) {
    pdf.addImage(imgData, "PNG", 24, 24, renderedWidth, renderedHeight);
  } else {
    let position = 0;
    const pageRenderHeight = pageHeight - 48;
    const totalHeight = renderedHeight;
    while (position < totalHeight) {
      pdf.addImage(
        imgData,
        "PNG",
        24,
        24 - position,
        renderedWidth,
        renderedHeight,
      );
      position += pageRenderHeight;
      if (position < totalHeight) pdf.addPage();
    }
  }

  pdf.save(filename);
};
