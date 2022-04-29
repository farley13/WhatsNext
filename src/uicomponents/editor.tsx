import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';

import { getSheetsData } from "../storage/testStorage"


const Editor = ({ children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    const firstResult = result[0];
    var editor = [];
    // TODO pull this from our storage
    const tempEditorOrder = ["Name","Comment", "Importance","Done", "Time Remaining [Hours]","Milestone","Domain", "Ext Link","Due Date","Categories","Cost"];
    if (firstResult) {
	editor.push(<div>
		       <label>Name</label>
		       <input value={firstResult.name()}/>
		    </div>);
	for (let i = 1; i < tempEditorOrder.length; i++) {
	    editor.push(<div>
			   <label>{tempEditorOrder[i]}</label>
			   <input value={firstResult.get(tempEditorOrder[i])}/>
			</div>);
	}

    } 
  return (
    <>
      <p>Editor firstResult :{JSON.stringify(result[0], null, 2)} {status} {error}</p>
	  {editor}
      <p>Editor got some hot data :{JSON.stringify(result, null, 2)} {status} {error}</p>
    </>
  )
};

export default Editor
