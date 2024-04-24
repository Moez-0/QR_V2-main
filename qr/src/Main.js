import React, { useEffect } from 'react';
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from 'react';
import Loader from './components/Loader';
import ViewPDF from './components/ViewPDF';
import Spreadsheet from './components/Spreadsheet';


const Main = () => {
    const [formData,setFormData] = useState({ paperWidth: 210 , paperHeight:297 , labelWidth: 70, labelHeight: 50, nbCols: 4, nbRows: 4, pageTopMargin: 1, pageBottomMargin: 1, pageLeftMargin: 1, pageRightMargin: 1});
    const [paper, setPaper] = useState('paper1');
    const [selectedOption, setSelectedOption] = useState('A4');
    const [pdfArray,setPdfArray] = useState();
    const [titleSize,setTitleSize] = useState(2);
    const [titleBold,setTitleBold] = useState(true);
    const [titleAlign,setTitleAlign] = useState('center');
    const [barcodeType,setBarcodeType] = useState('128');

    useEffect(() => {
        // Define default values based on selected option
        const defaultValues = {
            'A5': { paperWidth: 210, paperHeight: 297, labelWidth: 70, labelHeight: 50, nbCols: 2, nbRows: 12, pageTopMargin: 1, pageBottomMargin: 1, pageLeftMargin: 1, pageRightMargin: 1 },
            'A4': { paperWidth: 37, paperHeight: 70, labelWidth: 70, labelHeight: 50, nbCols: 3, nbRows: 12, pageTopMargin: 1, pageBottomMargin: 1, pageLeftMargin: 1, pageRightMargin: 1 }
        };
    
        // Set formData to default values based on the selectedOption
        setFormData(defaultValues[selectedOption]);

    }, [selectedOption, paper]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value
        }));
      };


      const handleOptionChange = (event) => {
        const newOption = event.target.value;
        setSelectedOption(newOption);
    };


    const togglePaper = (event) => {
        const newPaper = event.target.value;
        setPaper(newPaper);
    };
    useEffect(() => {
        // Preserve selected option if it's already set for the new paper type
        if (paper === 'paper1' && selectedOption !== 'A5') {
            setSelectedOption('A4');
        } else if (paper === 'paper3' && selectedOption !== 'A4') {
            setSelectedOption('A5');
        }
    }, [paper, selectedOption]);
    const handlePrint = async () => {
        const paperWidth = formData["paperWidth"]; // Example paper width
        const paperHeight = formData["paperHeight"]; // Example paper height
        const nbRows = formData["nbRows"];
        const nbCols = formData["nbCols"];
        const topMargin = formData["pageTopMargin"];
        const bottomMargin = formData["pageBottomMargin"];
        
        const fetchResponse = {};
        //console.log(nbCols);
        if(paperHeight && paperWidth && nbRows && nbCols && topMargin && bottomMargin && titleAlign && titleBold != null && titleSize && barcodeType){
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            // Convert paperWidth and paperHeight to query parameters
            body: JSON.stringify({ paperWidth, paperHeight })
        };
    
        try {
            console.log(selectedOption);
            const fetchResponse = await fetch(`http://localhost:5215/params?paperWidth=${paperWidth}&paperHeight=${paperHeight}&nbRows=${nbRows}&nbCols=${nbCols}&pageBottomMargin=${bottomMargin}&pageTopMargin=${topMargin}&type=${selectedOption}&titleAlign=${titleAlign}&titleSize=${titleSize}&titleBold=${titleBold}&barcodeType=${barcodeType}`, settings);
            // Handle response as needed
           
            let bufferArray = await fetchResponse.arrayBuffer();
            //console.log("setted");
            setPdfArray(bufferArray);

        } catch (e) {
            console.error(e);
        }    
    }else{
        console.log("paper height and withd undefined")
    }
    }

    const printIframe = (id) => {
        const iframe = document.frames
          ? document.frames[id]
          : document.getElementById(id);
        const iframeWindow = iframe.contentWindow || iframe;
    
        iframe.focus();
        iframeWindow.print();
    
        return false;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(formData);
      }
    let content = null;

    if (paper === 'paper1') {
        
        content =  <div className='flex flex-row mr-5 w-full'>
       <select className='border-2 border-black dark:border-white rounded-md p-1 w-full' value={selectedOption} onChange={handleOptionChange}>
    {selectedOption === 'A4' ? (
        <>
            <option value="A4">A4/24</option>
            <option value="A5">A4/65</option>
        </>
    ) : (
        <>
            <option value="A5">A4/65</option>
            <option value="A4">A4/24</option>
        </>
    )}
</select>
        
    </div>
    }
    else if (paper === 'paper2') {
        content = <div className='container m-auto grid grid-cols-2 gap-3 text-xs font-medium'>
            
 <div className='flex justify-between items-center'>
        <label for="paperWidth">Width</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1.5'>
        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[50px] p-1.5 dark:bg-gray-700 ' type="number" id="paperWidth" name="paperWidth" />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="paperHeight">Height</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[50px] p-1.5 dark:bg-gray-700 '  type="number" id="paperHeight" name="paperHeight" />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        </div>;
    }
    else if (paper === 'paper3') {
        content = 
         <div className='container m-auto grid grid-cols-2 gap-3 text-xs font-medium'>
           
        <div className='flex justify-between items-center'>
        <label for="paperWidth">Paper Width</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1 '>
        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 ' type="number" id="paperWidth" name="paperWidth" value={formData.paperWidth} onChange={handleChange}  min={0}
 step={1}
 onKeyDown={(e) => {
 if (e.code === 'Minus') {
    e.preventDefault();
    }
  }}  required/>
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="paperHeight">Paper Height</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperHeight" name="paperHeight" value={formData.paperHeight}  onChange={handleChange}  min={0}
 step={1}
 onKeyDown={(e) => {
 if (e.code === 'Minus') {
    e.preventDefault();
    }
  }} required />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="labelWidth">Label Width</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>
        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="labelWidth" value={formData.labelWidth} onChange={handleChange} />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="labelHeight">Label Height</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="labelHeight" value={formData.labelHeight} onChange={handleChange} />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="numberOfCols"># of columns</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="nbCols" value={formData.nbCols} onChange={handleChange} />
        <span className='ml-2 opacity-0'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
            
        <label for="numberOfRows"># of rows</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="nbRows" value={formData.nbRows} onChange={handleChange} />
        <span className='ml-2 opacity-0'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="pageTopMargin">Page Top Margin</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="pageTopMargin" value={formData.pageTopMargin} onChange={handleChange} />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        
        <label for="pageBottomMargin">Page Bottom Margin</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>


        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="pageBottomMargin" value={formData.pageBottomMargin} onChange={handleChange} />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
        <label for="pageLeftMargin">Page Left Margin</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="pageLeftMargin" value={formData.pageLeftMargin} onChange={handleChange}  />
        <span className='ml-2 text-gray-400'>mm</span>
        </div>
        </div>
        <div className='flex justify-between items-center '>
            
        <label for="pageRightMargin">Page Right Margin</label>
        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1'>

        <input className='  text-gray-900 text-sm rounded-lg outline-none block w-[55px] py-1 px-1.5 dark:bg-gray-700 '  type="number" id="paperWidth" name="pageRightMargin" value={formData.pageRightMargin} onChange={handleChange} />
        <span className='ml-2 text-gray-400'>mm</span>
        
        </div>
        
        </div>
        <div className='flex justify-between items-center '>
            
        {/* <button className=' mb-10 mt-17 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32' style={{ backgroundColor: '#4F67FF' , transition: 'background-color 0.3s'}} onClick={handlePrint}>Update</button> */}

            
            </div>
        </div>

    }
    else {
        content = null;
    }
    
    useEffect(() => {
        console.log(barcodeType);
        // Execute handlePrint whenever titleBold, titleSize, or titleAlign changes
        handlePrint();
    }, [titleBold, titleSize, titleAlign,formData,barcodeType]);


    return <>
    <Loader />
        <div className='mt-20 min-h-screen min-w-full h-full w-full bg-white dark:bg-slate-950 flex text-black dark:text-white flex-col justify-center items-center '>
                   
            <div className='w-full bg-grayBg flex flex-col md:flex-row h-full'>
                <div className='rightt bg-white px-5  dark:bg-slate-800 w-full h-[20%] md:h-screen  md:h-full md:w-[30%] flex flex-col justify-between'>
                <h1 className='text-lg font-bold text-black dark:text-white mt-10 ml-5 mb-5'>1. Types of Paper</h1>
                <div className='w-[90%] ml-5 flex justify-between'>
                  <div className='flex flex-row mr-5'>
                  <input className='mr-2' type="radio" id="paper1" name="paper" value="paper1" checked={paper === "paper1"} // Check if paper1 is selected
 onChange={togglePaper}/>
                  <label for="paper1">Label Sheet</label>
                  </div>
                   
                  <div className='flex flex-row mr-5'>
                  <input className='mr-2' type="radio" id="paper3" name="paper" value="paper3" checked={paper === "paper3"}  onChange={togglePaper}/>
                  <label for="paper3">Custom</label>
                  </div>
                </div>

                <div className='paper w-[90%] ml-5 flex justify-between mt-5'>
    
                    { content }
            
                </div>

                <h1 className='text-lg font-bold text-black dark:text-white mt-10 ml-5'>2. Label Design</h1>
                <div>
                <form className='mx-10 mt-5'>
   <section className="snap-x snap-mandatory pretty-scrollbar pb-[10px] flex gap-[10px] overflow-x-auto overscroll-contain" role="radiogroup">
      <h3 className="hidden">List of Label Design</h3>
      <div className="relative snap-start snap-always h-[120px] flex-none cursor-pointer overflow-hidden rounded-[8px] border-2 border-solid border-gray-4  z-0" role="radio" aria-label="Design : barcodeSimple"><img src="../s1.png"  alt="preview" width="226.77165354599998" height="113.38582677299999" decoding="async" data-nimg="1" className="h-full w-full object-cover z-0  " /></div>
      <div className="relative snap-start snap-always h-[120px] flex-none cursor-pointer overflow-hidden rounded-[8px] border-2 border-solid border-gray-4 z-0"  role="radio" aria-label="Design : qrSimple"><img alt="preview" width="188.976377955" height="188.976377955" decoding="async" data-nimg="1" className="h-full w-full object-cover z-0" src="../s2.png" /></div>
      <div className="relative snap-start snap-always h-[120px] flex-none cursor-pointer overflow-hidden rounded-[8px] border-2 border-solid border-gray-4 z-0"  role="radio" aria-label="Design : qrHorizontal"><img alt="preview" width="226.77165354599998" height="132.2834645685" decoding="async" data-nimg="1" className="h-full w-full object-cover z-0" src="../s3.png" /></div>
      <div className="relative snap-start snap-always h-[120px] flex-none cursor-pointer overflow-hidden rounded-[8px] border-2 border-solid border-gray-4 z-0" role="radio" aria-label="Design : textOnly"><img alt="preview" width="226.77165354599998" height="113.38582677299999" decoding="async" data-nimg="1" className="h-full w-full object-cover z-0" src="../s4.png"/></div>
   </section>
   
</form> 
                <div className='w-[90%] ml-5 flex justify-evenly flex-col pt-10'>
                <div className='flex flex-col'>
                <h1 className='font-bold'>Text</h1>
                    <div className='flex justify-evenly'>
                        <div className='flex flex-row justify-center items-center border border-gray-300 rounded-lg p-1 w-24'>
                        <input className='  text-gray-900 text-xs rounded-lg outline-none block w-[50px] py-1 px-1.5 dark:bg-gray-700 ' name="size"  value={titleSize} onChange={(e) => setTitleSize(parseInt(e.target.value))} type="number"  />
                        <span className='ml-2 text-gray-400'  >pt</span>
                        
                        </div>
                        <div className='flex items-center' >
                        <button  onClick={() => setTitleBold(false)} name='bold' className={` border border-gray-300 rounded-lg p-2 rounded-r-none ${titleBold === false ? 'bg-gray-100' : ''} hover:bg-gray-100`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.792 10.876c0-.774-.281-1.352-.846-1.733-.563-.382-1.438-.572-2.623-.572H5.938v4.683h.86c.859 0 1.567-.051 2.121-.153.555-.103 1.005-.327 1.352-.67.348-.343.521-.862.521-1.555m-.687-6.15c0-.657-.24-1.151-.717-1.482-.479-.332-1.154-.498-2.027-.498H5.938v4.088h1.443c1.815 0 2.724-.702 2.724-2.108m2.15-.112c0 .657-.151 1.236-.449 1.737-.3.502-.737.886-1.31 1.152.81.279 1.429.713 1.858 1.306.431.59.646 1.293.646 2.104 0 1.332-.502 2.345-1.505 3.043C10.491 14.652 8.989 15 6.988 15H2v-1.747h1.777V2.746H2V1h5.065c1.752 0 3.055.298 3.909.891.854.595 1.281 1.502 1.281 2.723"></path></svg></button>
                        <button  onClick={() => setTitleBold(true)} name='bold' className={` border border-gray-300 rounded-lg p-2 rounded-l-none ${titleBold === true ? 'bg-gray-100' : ''} hover:bg-gray-100`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M10.157 10.81c0-.68-.202-1.17-.606-1.468-.406-.297-1.102-.446-2.089-.446h-.947v3.726h1.472c.663 0 1.191-.146 1.582-.437.392-.29.588-.75.588-1.375m-.449-5.955c0-.545-.202-.927-.607-1.147-.405-.22-.973-.33-1.707-.33h-.879v3.16h1.157c.681 0 1.191-.128 1.529-.382.338-.254.507-.688.507-1.3m3.737-.187c0 1.357-.679 2.32-2.036 2.89.873.315 1.523.751 1.95 1.305.427.554.641 1.237.641 2.05C14 13.637 11.897 15 7.691 15H1v-2.378h1.778V3.378H1V1h6.691c1.944 0 3.389.304 4.335.911.946.607 1.419 1.526 1.419 2.758"></path></svg></button>
                        </div>
                        <div className='flex items-center' >
                        
                        <button value="left" onClick={(e) => setTitleAlign('left')} name="align" className={`border border-gray-300 rounded-lg p-2 ${titleAlign === 'left' ? 'bg-gray-100' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M14.25 4.5H1.75a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5m-8 4.25h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5m4 4.25h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5"></path></svg></button>
                        <button value="center" onClick={(e) => setTitleAlign('center')} name="align" className={`border border-gray-300 rounded-lg p-2 ${titleAlign === 'center' ? 'bg-gray-100' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M14.25 4.5H1.75a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5m-4 4.25h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5m2 4.25h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5"></path></svg></button>
                        <button  value="right"  onClick={(e) => setTitleAlign('right')} name="align" className={`border border-gray-300 rounded-lg p-2 ${titleAlign === 'right' ? 'bg-gray-100' : ''}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M14.25 4.5H1.75a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5m0 4.25h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5m0 4.25h-8.5a.75.75 0 0 1 0-1.5h8.5a.75.75 0 0 1 0 1.5"></path></svg></button>
                        </div>
                    </div>


                </div>
                <hr className='my-5'/>

                 <div className='flex flex-col'>
                <h1 className='font-bold'>Barcode</h1>
                    <div className='flex justify-evenly items-start'>
                    <div className='flex flex-row mr-5 w-full'>
       <select onChange={(e)=>{setBarcodeType(e.target.value)}} className='border-2 border-black dark:border-white rounded-md p-1 w-full' >
   
            <option value="128">Barcode 128</option>
            <option value="39">Barcode 39</option>
        

        </select>
    </div>
                    </div>


                </div> 
                <hr className='my-5'/>
                  </div>
                  <div className='w-[90%] ml-5 flex justify-between flex-col pt-10'>
                    <Spreadsheet type={selectedOption} />
                  </div>
                  <div className='w-full'>
                    <button className='ml-40 mb-10 mt-17 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-32' onClick={()=> printIframe('pdf')} style={{ backgroundColor: '#4F67FF' , transition: 'background-color 0.3s'}}>Print</button>
                </div>
                
                </div>
                </div>
    
                <div className='left bg-[#525659] w-full h-[80%] md:h-full md:w-[70%] w-full'>
                <ViewPDF selectedOption={selectedOption} bufferArray={pdfArray} />
                </div>
                
            </div>
    </div>
    </>
}
;

export default Main