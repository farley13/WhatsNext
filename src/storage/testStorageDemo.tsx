// SignIn.jsx
import React from 'react';

import { getSheetsData, setPartData } from "./testStorage"


const TestStorageDemo = ({ children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    
  return (
    <>
      <p>We got some hot data :{JSON.stringify(result, null, 2)} {status} {error}</p>
    </>
  )
};

export default TestStorageDemo;