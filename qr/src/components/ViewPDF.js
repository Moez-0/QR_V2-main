import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { DotLoader } from 'react-spinners';

const ViewPDF = ({ selectedOption , bufferArray }) => {
    const [pdfUrl, setPdfUrl] = useState('');
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        const fetchPDF = async () => {
            setLoading(true); // Set loading state to true when fetching starts
            try {
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
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(blob) + '#toolbar=0&scrollbar=0&navpanes=0&zoom=100';
                setPdfUrl(pdfUrl);

                // Set loading state to false after a custom timeout (e.g., 2 seconds)
                setTimeout(() => {
                    setLoading(false);
                }, 2300);
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setLoading(false); // Set loading state to false in case of error
            }
        };

        fetchPDF();
    }, [selectedOption,bufferArray]);

    return (
        <div className='h-screen'>
            {/* Conditional rendering based on loading state */}
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="loader">
                        <DotLoader color='#4F67FF' />
                    </div> {/* Replace this with your loading animation */}
                </div>
            ) : (
                <iframe src={pdfUrl} width="100%" height="1000px" title="PDF Viewer" className="pdf border-none bg-transparent" id="pdf" />
            )}
        </div>
    );
};

export default ViewPDF;
