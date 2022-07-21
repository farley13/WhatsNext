import React from 'react';


import { DataEntry } from "../storage/storageInterface";
import { HardcodedStorage } from "../storage/hardcodedStorage";
import { createDatasource } from "../storage/listDataSource";
import Editor from "./editor"

import css from "./organize_list.module.css";

interface OrganizeListProps {
}

const OrganizeList: React.FC<OrganizeListProps> = () => {
  
    const hardcodedStorage = new HardcodedStorage();
    const { api:{ status, error, result, updateCount }, updateData } = createDatasource({query: {}, storage: hardcodedStorage });
    const [ activeWorkItem, setActiveWorkItem ] = React.useState<DataEntry | null>(null);
    const workItems: React.ReactNode[] = [];
    console.log("result:  " + JSON.stringify(result));
    
    if (result){
	result.forEach((workItem: DataEntry, workItemIndex) => {
	    if (!activeWorkItem) {
		setActiveWorkItem(workItem);
	    }
	    const itemMarkup: React.ReactNode[] = [];
	    // TODO - this should come from config
	    const listLayout = [["Name", "Importance"], 
				["Domain", "Due Date", "Edit Event",<button>EditDont</button>,<button>RescheduleDont</button>],
				["Time Remaining [Hours]","Done",<button>mark in progressDont</button>,<button>mark completeDont</button>],
				[<button onClick={() => setActiveWorkItem(workItem)}>edit</button>, "Comments"]];
	    listLayout.forEach((layoutGroup, groupIndex) => { 
		const layoutGroupRender: React.ReactNode[] = [];
		layoutGroup.forEach((listElement, formButtonIndex) => {
		    const workItemValue = workItem.get(listElement as string);
		    if (workItemValue) {
			layoutGroupRender.push(<span key={formButtonIndex} className={css.listSpan}>{workItemValue}</span>);
		    } else {
			layoutGroupRender.push(<span key={formButtonIndex} className={css.listSpan}>{listElement}</span>);
		    }
		})
		itemMarkup.push(<div key={groupIndex}>{layoutGroupRender}</div>);
	    });
	    workItems.push(<li key={workItemIndex} className={css.listEntry}>{itemMarkup}</li>);
	    //workItems.push(<li> {JSON.stringify(workItem, null, 2)}</li>);  
	});
    }
    
  return (
    <>
      <ol>
	  {workItems}
      </ol>
      <p>Organize List got some hot data |status|</p>
      <p>{error}</p>
     <p>save count: {updateCount}</p>
      <Editor workItem={activeWorkItem} updateData={updateData}/> 
    </>
  )
};

export default OrganizeList
