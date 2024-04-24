import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPDF = ({ selectedOption , bufferArray}) => {
    const [pdfUrl, setPdfUrl] = useState('');
    const fetchTemplatePdf65 = async () => {
        try{
            let response;
            response = await axios.get('http://localhost:5215/generate65', {
                responseType: 'arraybuffer',
                     });
                     const blob = new Blob([response.data], { type: 'application/pdf' });

                // Create a URL for the Blob
                const pdfUrl = URL.createObjectURL(blob) + '#toolbar=0'; // Append #toolbar=0 to hide toolbar
                     console.log(pdfUrl);
                // Set the PDF URL state
                setPdfUrl(pdfUrl);
                
        }catch(error){
            console.log(error)
        }
    }
    useEffect(() => {
        fetchTemplatePdf65();
        const fetchPDF = async () => {
            try {
               // console.log(bufferArray+"test");
                 let response;
                 if (selectedOption === 'A4') {
                     response = await axios.get('http://localhost:5215/generate24', {
                         responseType: 'arraybuffer',
                     });
                 } else if (selectedOption === 'A5') {
                     response = await axios.get('http://localhost:5215/generate65', {
                         responseType: 'arraybuffer',
                     });
                 }
                // let response = bufferArray;
                //  
                // Convert the response data (PDF file) to a Blob
                const blob = new Blob([response.data], { type: 'application/pdf' });

                // Create a URL for the Blob
                const pdfUrl = URL.createObjectURL(blob) + '#zoom=100'; // Append #toolbar=0 to hide toolbar

                // Set the PDF URL state
                setPdfUrl(pdfUrl);

                // Log the PDF URL
                console.log('PDF URL:', pdfUrl);
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };

        fetchPDF(); // Fetch PDF when selected option changes
    }, [selectedOption,bufferArray]); // Dependency array ensures this effect runs whenever the selected option changes

    return (
        <div className='h-screen'>
            {/* Display the PDF using an iframe */}
            {pdfUrl && <iframe src={pdfUrl} width="100%" height="1000px" title="PDF Viewer" className="pdf border-none bg-transparent" id="pdf" />}
        </div>
    );
};

export default ViewPDF;
