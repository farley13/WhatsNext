import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
// and https://github.com/chibuike07/data_collection_react/blob/master/src/Component/Buttons/ButtonGroup.jsx for crud updates
// TODO - this should be broken up into the REACT interface (get data hook)
// and the method(s) of storing/looking up data - localstorage, in memory or github etc - almost none of this is specific to in memory / test data right now
// the API for this should be
// {{status, result,error}, update([...dataRows])} = getSheetsData(query,storageStrategy)
// where storage strategy takes in "setPartData"
// and the production storage strategy delegates to two other strategies, reading/writing to local and then remote, retrying remote until it succeeds with some backoff.
// syncing all local updates not yet written to remote using local state
import { ApiStates } from './apicommon';
import { HardcodedStorage } from './hardcodedStorage';
import { StorageListQuery, Storage, DataEntry } from './storageInterface';

interface DatasourceState {
    status: ApiStates,
    error: string,
    result: DataEntry[],
    updateCount: number,
    apiAvailable: boolean

}

export const createDatasource = (input: {query: StorageListQuery, storage: Storage}) => {
  const [data, setData] = React.useState<DatasourceState>({
      // THOUGHT - state and error probably need to be a little more complex if we delegate to more than one backend
      // we need to reduce these from multiple states to a single one
      // maybe the backend components and aggregate component can handle this instead of us...
    status: ApiStates.LOADING,
    error: '',
    result: [],
    updateCount: 0,
    apiAvailable: true
  });

 const storage = new HardcodedStorage();
 const query = {};

 // TODO move these to useEffect...
 const setPartData = (partialData: any) => setData({ ...data, ...partialData });

 // THOUGHT this might deserve to be it's own hook
 const updateData = ( items: DataEntry[] ) => {
     // updateDataLocally then update data / state
     // && updateDataRemotely then update data / state
     console.log('Running update datae')
     setPartData({
	 updateCount: data.updateCount + 1
     });
     storage.addOrUpdateData(items)
	 .then((result) => {
        setPartData({
          status: ApiStates.SUCCESS,
          result: result // TODO this should really update just the workitems that were updated
        });
      })
      .catch((error) => {
       setPartData({
          status: ApiStates.ERROR,
          error: 'fetch failed: ' + error + error.stack
       });
      });
  };

  React.useEffect(() => {
     console.log("Running Get Sheets with api:" + true)

    setPartData({
      status: ApiStates.LOADING
    });
    if (!data.apiAvailable) {
       console.log("No gapi loaded yet.")
	return;
    } else {
       console.log("gapi now loaded.")
    }
    storage.getData(query)
      .then((result) => {
        setPartData({
          status: ApiStates.SUCCESS,
          result: result
        });
      })
      .catch((error) => {
       setPartData({
          status: ApiStates.ERROR,
          error: 'fetch failed: ' + error + error.stack
       });
      });
 }, [data.apiAvailable]);

  return { api: data, updateData };
};

