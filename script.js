async function convertPdfToText() {
  const fileInput = document.getElementById('pdfFile');
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = '';

  if (fileInput.files.length === 0) {
    statusMessage.textContent = 'Please select a PDF file to upload.';
    statusMessage.style.color = 'red';
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  // Initialize PDF.js
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textContent = '';

  // Loop through each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContentPage = await page.getTextContent();
    const strings = textContentPage.items.map(item => item.str);
    textContent += strings.join(' ') + '\n';
  }

  // Create a Blob from the text content
  const blob = new Blob([textContent], { type: 'text/plain' });

  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'converted_document.txt';

  // Append the link to the document body
  document.body.appendChild(link);

  // Click the link to download the text file
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);

  statusMessage.textContent = 'Success! Text file downloaded.';
  statusMessage.style.color = 'green';
}
