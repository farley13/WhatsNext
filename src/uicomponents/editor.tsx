import React from 'react';

import { DataEntry } from '../storage/storageInterface';

interface EditorProps {
    workItem: DataEntry | null,
    updateData: (items: DataEntry[]) => void,
}

interface EditorState {
    [index: string]: any;
}

const Editor: React.FC<EditorProps> = ({ workItem, updateData }) => {
  
    const firstResult = workItem;
    let editor = [];
    // TODO pull this from our storage
    const tempEditorOrder = ["Name","Comment", "Importance","Done", "Time Remaining [Hours]","Milestone","Domain", "Ext Link","Due Date","Categories","Cost"];
    const [state, setState] = React.useState<EditorState>({} as EditorState);
    let debugout = "workitem;" + JSON.stringify(workItem);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
		const itemValue: any = firstResult.get(tempEditorOrder[i]);
		updatedWorkItem.set(itemName, itemValue);
	    }
	    updateData([updatedWorkItem]);
	}
    }

    React.useEffect(() => {
	if (firstResult) {
	    const initialState: EditorState = {};
	    for (let i = 0; i < tempEditorOrder.length; i++) {
		const itemName = tempEditorOrder[i];
		const itemValue: any = firstResult.get(tempEditorOrder[i]);
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
			<label>{itemName}
			   <input name={itemName} value={state[itemName]} onChange={handleInputChange} />
			</label>
			</div>);
	}
	
    } 
  return (
    <>
	  {editor}
          <button onClick={handleSave}>Save</button>
      <p>{debugout}</p>
    </>
  )
};

export default Editor
