import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import * as fs from 'fs';
// import fetch from 'node-fetch';
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId: string = '';
const location: string = ''; // Format is 'us' or 'eu'
const processorId: string = ''; // Create processor in Cloud Console
const filePath: string = '/Projects/test4docai/public/Discharge_Summary_sample_6_test_compressed.pdf';
const fileUrl: string = 'https://utfs.io/f/88e84ed7-b842-4f19-9978-2b4e11edfdcb-aw5mu.pdf'; // Your file URL

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
// const client = new DocumentProcessorServiceClient({apiEndpoint: 'eu-documentai.googleapis.com'});
const client = new DocumentProcessorServiceClient();

export async function quickstart(): Promise<void> {
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name: string = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  
  // Read the file into memory.
  const imageFile: Buffer = await fs.promises.readFile(filePath);
  
  const response = await fetch(fileUrl);
  if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${fileUrl}`);
  }
  const fileBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage: string = buffer.toString('base64');
  
  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf',
    },
  };
  
  // Recognizes text entities in the PDF document
  const [operation] = await client.batchProcessDocuments(request);
  const [result] = await client.processDocument(request);
  
  const {document} = result;
  if (!document) {
    console.error('Document not found.');
    return;
  }
  // Get all of the document text as one big string
  const {text} = document;

  // Extract shards from the text field
  const getText = (textAnchor: any): string => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return '';
    }

    // First shard in document doesn't have startIndex property
    const startIndex: number = textAnchor.textSegments[0].startIndex || 0;
    const endIndex: number = textAnchor.textSegments[0].endIndex;

    if (!text) {
      console.error('Document not found.');
      return "SHIT";
    }
    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  console.log('The document contains the following paragraphs:');
  if (!document.pages) {
    console.error('pages not found.');
    return;
  }
  for (const page of document.pages) {
    const {paragraphs} = page;
    if (!paragraphs) {
       console.error('paragraph not found.');
       continue; // Skip to the next page if no paragraphs are found
    }
    for (const paragraph of paragraphs) {
       if (!paragraph.layout) {
         console.error('layout not found.');
         continue; // Skip to the next paragraph if no layout is found
       }
       const paragraphText: string = getText(paragraph.layout.textAnchor);
       console.log(`Paragraph text:\n${paragraphText}`);
    }
   }
}
