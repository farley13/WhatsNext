import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';

import { getSheetsData } from "../storage/testStorage"
import Editor from "./editor"

import css from "./organize_list.module.css";

const OrganizeList = ({ children }) => {
  
    const { status, error, result } = getSheetsData({apiAvailable: true});
    const [ activeWorkItem, setActiveWorkItem ] = React.useState(null)
    const workItems = [];
    if (result){
	for (let  workItem of result ) {
	    if (!activeWorkItem) {
		setActiveWorkItem(workItem);
	    }
	    const itemMarkup = [];
	    // TODO - this should come from config
	    const listLayout = [["Name", "Importance"], 
				["Domain", "Due Date", "Edit Event",<button>Edit</button>,<button>Reschedule</button>],
				["Time Remaining [Hours]","Done",<button>mark in progress</button>,<button>mark complete</button>],
				[<button onClick={() => setActiveWorkItem(workItem)}>edit</button>, "Comments"]];
	    listLayout.forEach((layoutGroup) => { 
		const layoutGroupRender = [];
		layoutGroup.forEach((listElement) => {
		    const workItemValue = workItem.get(listElement);
		    if (workItemValue) {
			layoutGroupRender.push(<span className={css.listSpan}>{workItemValue}</span>);
		    } else {
			layoutGroupRender.push(<span className={css.listSpan}>{listElement}</span>);
		    }
		})
		itemMarkup.push(<div>{layoutGroupRender}</div>);
	    });
	    workItems.push(<li className={css.listEntry}>{itemMarkup}</li>);
	    //workItems.push(<li> {JSON.stringify(workItem, null, 2)}</li>);  
	}
    }
    
  return (
    <>
      <ol>
	  {workItems}
      </ol>
      <p>Organize List got some hot data {status} {error}</p>
      <Editor workItem={activeWorkItem}/>
    </>
  )
};

export default OrganizeList
