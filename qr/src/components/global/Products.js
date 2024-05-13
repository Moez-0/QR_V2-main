import React, { useState, useEffect } from 'react';

import axios from 'axios';

const Products = ({ type }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState('');
    const [newProduct, setNewProduct] = useState({
        Title : '',
        Description : '',
        Code : '',
        UserId : ''
    });
    const [newProductError, setNewProductError] = useState('');

    const validateNewProduct = () => {
        if (!newProduct.Title || !newProduct.Description || !newProduct.Code) {
            setNewProductError('Please fill in all fields');
            return false;
        }
        return true;
    }

    


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            setUserId(userData.id);
        }
    }, []); // Only run this effect once on component mount

    useEffect(() => {
        if (!userId) return; // Skip if userId is not set yet

        axios.get(`http://localhost:5215/products/user?userId=${userId}`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [userId]); // Run this effect whenever userId changes

    const handleAddNewProduct = () => {
        if (!validateNewProduct()) return;

        axios.post('http://localhost:5215/products', { ...newProduct, UserId: userId })
            .then(res => {
                setProducts([...products, res.data]);
                setNewProduct({
                    Title: '',
                    Description: '',
                    Code: '',
                    UserId: ''
                });
                setNewProductError('');

                
             
            })
            .catch(err => {
                setNewProductError(err.response.data.message);
            });

    }
    
    
const sendDataToServer = async () => {
    // Prepare your JSON data remove userId and id
    //make the attirubtes of the products capital

    
    const excelData = products.map((product) => {
        const newProduct = {};
        for (const key in product) {
            if (key !== 'id' && key !== 'userId') {
                newProduct[key.charAt(0).toUpperCase() + key.slice(1)] = product[key];
            }
        }
        return newProduct;
    }
    );


    
    try {
    
        // Prepare your JSON data
        const jsonData = {
            dataArray: excelData,
            type:type
        };
  
        // Send POST request to the server
        const response = await fetch('http://localhost:5215/excelData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });
  
        // Check if the request was successful
        if (response.ok) {
            // Handle successful response
  
            //console.log('Data sent successfully');
            //console.log(response.ok)
        } else {
            // Handle error response
            console.error('Failed to send data:', response.statusText);
        }
    } catch (error) {
        // Handle network errors
        console.error('Error:', error.message);
    }
  };
    useEffect(() => {
        if (products.length > 0) {
            sendDataToServer();
        }
    }
    , [products]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    

    return (
        <div className="viewer overflow-x-auto overflow-y-auto overscroll-contain pretty-scrollbar max-h-96">
          
            <div className="flex flex-col space-y-4 mb-4">
                <input type="text" placeholder="Title" className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md" value={newProduct.Title} onChange={(e) => setNewProduct({ ...newProduct, Title: e.target.value })} />
                <input type="text" placeholder="Description" className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md" value={newProduct.Description} onChange={(e) => setNewProduct({ ...newProduct, Description: e.target.value })} />
                <input type="text" placeholder="Code" className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md" value={newProduct.Code} onChange={(e) => setNewProduct({ ...newProduct, Code: e.target.value })} />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleAddNewProduct}>Add Product</button>
                {newProductError && <div className="text-red-500">{newProductError}</div>}
            </div>

            {products && products.length > 0 ? (
                <table className="min-w-full text-left text-sm font-light mb-10">
                    <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                          
                            
                            {Object.keys(products[0]).map((key) => (
                                key === 'id' || key === 'userId' ? null :
                             
                                    <th scope='col' className="px-6 py-4 capitalize" key={key}>{key}</th>
                            ))}
                           

                                <th scope='col' className="px-6 py-4 capitalize" >Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((individualExcelData, index) => (
                            <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={index}>
                                {Object.keys(individualExcelData).map((key) => (
                                    key === 'id' || key === 'userId' ? null :
                                        
                                     <td className="whitespace-nowrap px-6 py-4" key={key}><input type="text" className="whitespace-nowrap px-6 py-2 dark:bg-slate-800 dark:border-white" key={key} value={individualExcelData[key]} /></td>


                                ))}
                                <td className="whitespace-nowrap px-6 py-4"><button onClick={() => {
                                    axios.delete(`http://localhost:5215/products/${individualExcelData.id}`)
                                        .then(res => {
                                            setProducts(products.filter(product => product.id !== individualExcelData.id));
                                        })
                                        .catch(err => {
                                            console.error(err);
                                        });
                                }}>Delete</button></td>
                            </tr>
                        ))}

                        
                    </tbody>
                </table>
                

            ) : (
                <div>No products found</div>
            )}
            
            

        </div>
        

    );
}

export default Products;
