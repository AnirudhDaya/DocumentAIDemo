import { NextRequest } from 'next/server';
import { quickstart } from '@/utils/processPDF2';

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, projectId, location, processorName } = await request.json();
    await quickstart();
    return new Response('Document processed successfully!', { status: 200 });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return new Response('An error occurred while processing the document.', { status: 500 });
  }
}