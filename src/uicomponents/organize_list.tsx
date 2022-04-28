import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';

import { getSheetsData } from "../storage/testStorage"


const OrganizeList = ({ children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    const workItems = [];
if (result && result.response && result.response.result && result.response.result.values){
  for (let  workItem of result.response.result.values ) {
    workItems.push(<li>{JSON.stringify(workItem, null, 2)}</li>);  
  }}

  return (
    <>
      <ol>
	  {workItems}
      </ol>
      <p>Organize List got some hot data :{JSON.stringify(result, null, 2)} {status} {error}</p>
    </>
  )
};

export default OrganizeList
