"use client"
import { useState } from 'react';

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [projectId, setProjectId] = useState('');
  const [location, setLocation] = useState('');
  const [processorName, setProcessorName] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setProjectId('ai-projects-1234')
    setLocation('us')
    setProcessorName('OCR')
    try {
      const response = await fetch("/api/ocr", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl, projectId, location, processorName }),
      });

      if (response.ok) {
        setResult('Document processed successfully!');
      } else {
        setResult('An error occurred while processing the document.');
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      setResult('An error occurred while processing the document.');
    }
  };

  return (
    <div className="flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-6">PDF Processor</h1>
    <form onSubmit={handleSubmit} className="w-96 space-y-4">
      <div>
        <label htmlFor="pdfUrl" className="block mb-1">PDF URL:</label>
        <input
          type="text"
          id="pdfUrl"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
        />
      </div>
      {/* <div>
        <label htmlFor="projectId" className="block mb-1">Project ID:</label>
        <input
          type="text"
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2  text-black"
        />
      </div>
      <div>
        <label htmlFor="location" className="block mb-1">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2  text-black"
        />
      </div>
      <div>
        <label htmlFor="processorName" className="block mb-1">Processor Name:</label>
        <input
          type="text"
          id="processorName"
          value={processorName}
          onChange={(e) => setProcessorName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2  text-black"
        />
      </div> */}
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Process PDF
      </button>
    </form>
    <p className="mt-4">{result}</p>
  </div>
  );
}