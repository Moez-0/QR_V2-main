import React, { useState, useEffect } from 'react';
import { PDFViewer, Document, Page } from '@react-pdf/renderer';
import axios from 'axios';

const ViewPDF = () => {
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5215/generate', { responseType: 'arraybuffer' })
      .then(res => {
        setPdf(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className='h-screen w-full'>

      {pdf && (
        <PDFViewer width="900px" height="100%" showToolbar={false}>
          <Document
            file={{
              data: pdf,
            }}
          >
            <Page pageNumber={1} size="A4" />
          </Document>
        </PDFViewer>
      )}
    </div>
  );
};

export default ViewPDF;
