import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';

import { getSheetsData } from "../storage/testStorage"


const Editor = ({ children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    
  return (
    <>
      <input/>
      <input/>
      <p>Editor got some hot data :{JSON.stringify(result, null, 2)} {status} {error}</p>
    </>
  )
};

export default Editor
