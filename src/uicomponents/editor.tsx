import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';

import { getSheetsData } from "../storage/testStorage"


const Editor = ({ workItem, updateData, children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    const firstResult = workItem;
    let editor = [];
    // TODO pull this from our storage
    const tempEditorOrder = ["Name","Comment", "Importance","Done", "Time Remaining [Hours]","Milestone","Domain", "Ext Link","Due Date","Categories","Cost"];
    const [state, setState] = React.useState({});
    let debugout = "workitem;" + JSON.stringify(workItem) + " status:"+ status;

    const handleInputChange = (event) => {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;
	setState({
	    ...state, 
	    [name]: value    });
    }

    const handleSave = () => {
	if (firstResult) {
	    const updatedWorkItem = firstResult.copy();
	    for (let i = 0; i < tempEditorOrder.length; i++) {
		const itemName = tempEditorOrder[i];
		const itemValue = firstResult.get(tempEditorOrder[i]);
		updatedWorkItem.set(itemName, itemValue);
	    }
	    updateData([updatedWorkItem]);
	}
    }

    React.useEffect(() => {
	if (firstResult) {
	    const initialState = {};
		for (let i = 0; i < tempEditorOrder.length; i++) {
		    const itemName = tempEditorOrder[i];
		    const itemValue = firstResult.get(tempEditorOrder[i]);
		    initialState[itemName] = itemValue;
		}
		setState({
		    ...initialState,
		});	
	    }
	},[firstResult]);


    if (firstResult) {

	for (let i = 0; i < tempEditorOrder.length; i++) {
	    const itemName = tempEditorOrder[i];
	    editor.push(<div>
			<label>{itemName}</label>
			<input name={itemName} value={state[itemName]} onChange={handleInputChange} />
			</div>);
	}
	
    } 
  return (
    <>
	  {editor}
          <button onClick={handleSave}>Save</button>
      <p>{debugout}</p>
      <p>Editor got some hot data: {status} {error}</p>
    </>
  )
};

export default Editor
