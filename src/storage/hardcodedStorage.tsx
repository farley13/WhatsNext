import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
// and https://github.com/chibuike07/data_collection_react/blob/master/src/Component/Buttons/ButtonGroup.jsx for crud updates
// TODO - this should be broken up into the REACT interface (get data hook)
// and the method(s) of storing/looking up data - localstorage, in memory or github etc - almost none of this is specific to in memory / test data right now
// the API for this should be
// {{state, result,error}, update([...dataRows])} = getSheetsData(query,storageStrategy)
// where storage strategy takes in "setPartData"
// and the production storage strategy delegates to two other strategies, reading/writing to local and then remote, retrying remote until it succeeds with some backoff.
// syncing all local updates not yet written to remote using local state
import { apiStates, setPartData } from './apicommon';
import { Storage } from './storageInterface';

export class HardcodedStorage implements Storage {
   getData(query: StorageListQuery): Promise<DataEntry[]> {
       return _getDataInternal(query);
   }
   addOrUpdateData(updatedData: DataEnty[]): Promise<DataEntry[]> {
       // prob should do some saving here too...
       return _getDataInternal({});
   }
}

export const IGNOREgetSheetsData = (query: storageListQuery) => {
  const [data, setData] = React.useState({
      // THOUGHT - state and error probably need to be a little more complex if we delegate to more than one backend
      // we need to reduce these from multiple states to a single one
      // maybe the backend components and aggregate component can handle this instead of us...
    state: apiStates.LOADING,
    error: '',
    result: [],
    updateCount: 0,
    apiAvailable: true
  });

 // TODO move these to useEffect...
 const setPartData = (partialData) => setData({ ...data, ...partialData });

 // THOUGHT this might deserve to be it's own hook
 const updateData = ( items: DataEntry[] ) => {
     // updateDataLocally then update data / state
     // && updateDataRemotely then update data / state
     console.log('Running update datae')
     setPartData({
	 updateCount: data.updateCount + 1
     });
    };

  React.useEffect(() => {
     console.log("Running Get Sheets with api:" + true)

    setPartData({
      state: apiStates.LOADING
    });
    if (!data.apiAvailable) {
       console.log("No gapi loaded yet.")
       return { api: {}, updateData };  
    } else {
       console.log("gapi now loaded.")
    }
    getData(query)
      .then((result) => {
        setPartData({
          state: apiStates.SUCCESS,
          result
        });
      })
      .catch((error) => {
       setPartData({
          state: apiStates.ERROR,
          error: 'fetch failed: ' + error + error.stack
       });
      });
 }, [data.apiAvailable]);

  return { api: data, updateData };
};


function generateData() {
  return [[
    "Get garden bench", 1647315976, 1647315999,"Edit Link", "", "Ready", 40, 40, 0,"","","","ABC123",34684, "Gardening", "https://www.gardening.com", "", "", 0,"Fast, Expensive", "Critical","$$ (100-300)"
  ],
  [
    "Cleanup Home", 1647315976, 1647315999,"Edit Link", "", "In Progress", 2, 3, 0,"","","","ABC124",34684, "Home", "https://www.gardening.com", "", "", 0,"Fast", "Critical",""
  ]
  ]
}

function _getDataInternal(query: storageListQuery):string[][] {

    var promisedResult = new Promise((resolve, reject) => {
      const header = ["Name","Created","Updated","Edit Link", "Comment", "Done", "Time Remaining [Hours]","Original LOE", "Completed Date","Milestone","Edit Event","Edit Event Link","UUID","Order", "Domain", "Ext Link", "Links", "Custom Scheduler", "Due Date","Categories", "Importance","Cost"];
  
      const data = generateData();
      const rows = [header];
      [].push.apply(rows,data);
      const range = { values: rows };
      const result = { result: range };
      resolve(result);
  });
  return promisedResult;
}

interface StorageListQuery {
    ids?;
    dateSince?;
    stringMatch?;
    parameterValues?;
}


