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

export const getSheetsData = (query: storageListQuery) => {
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

function getData(query: storageListQuery):DataEntry[] {
    var promisedResult = _getDataInternal(query);

    return promisedResult.then(function(response) {
	console.log(JSON.stringify(response, null,2));
	//const rows = [["a","b"],[1,2],[3,5]]; // response.result
	const rows = response.result.values; 
	const header = rows[0];
	const mapper = new Mapper(header, [], []);
	const dataEntries = [];
	for (let rowNum = 1; rowNum < rows.length; rowNum++) {
	    const newEntry = new TestRowDataEntry(mapper, rows[rowNum]);
	    dataEntries.push(newEntry);
	}
	return dataEntries;
        }, function(response) {
          return 'Error: ' + response.result.error.message;
        });
}

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

class Mapper {
    // enum values are stored as enumTypeName;;value1;value2;value3 etc...
  constructor(headerIn: string[], headerTypes: string[], headerEnums: string[]) {
      
      console.log("headerIn: " + JSON.stringify(headerIn, null, 2));
      this.header = headerIn;
      this.headerTypeMap = this.createTypeMap(headerTypes);
      this.headerEnumMap = this.createEnumMap(headerEnums);
/*      this.nameColumnIndex = header.indexOf("Name")
      this.createdTimeColumnIndex = header.indexOf("Created");
      this.timestampColumnIndex = header.indexOf("Updated");
      this.editColumnIndex = header.indexOf("Edit Link");
      this.completionDateColumnIndex = header.indexOf("Completed Date");
      this.nextScheduledEventColumnIndex = header.indexOf("Edit Event");
      this.nextScheduledEventLinkColumnIndex = header.indexOf("Edit Event Link");
      this.scheduleNewLinkColumnIndex = header.indexOf("Custom Scheduler");
      this.UuidColumnIndex = header.indexOf("UUID");
      this.OrderColumnIndex = header.indexOf("Order");
*/
      this.columnNameLookup = {};
      this.header.forEach((colName,index) => this.columnNameLookup[colName] = index);

      // UDFs - my own - but could be anyone\'s
  /*    this.doneColumnIndex = header.indexOf("Done");
      this.loeColumnIndex = header.indexOf("Time Remaining [Hours]");
      this.originalLoeColumnIndex = header.indexOf("Original LOE");
      this.milestoneColumnIndex = header.indexOf("Milestone");
      this.domainColumnIndex = header.indexOf("Domain");
      this.commentColumnIndex = header.indexOf("Comment");
      this.dueDateColumnIndex = header.indexOf("Due Date");
      this.categoriesColumnIndex = header.indexOf("Categories");
      this.importanceColumnIndex = header.indexOf("Importance");
      this.externalLinkAnchorColumnIndex = header.indexOf("Ext Link");
      this.externalLinkColumnIndex = header.indexOf("Links");
      this.costColumnIndex = header.indexOf("Cost");*/
  }

  getHeader(): string[] {
      return this.header;
  }

  createTypeMap(types: string[]) {
      this.typeMap = {};
      types.forEach((typeName,index) => this.typeMap[this.header[index]] = typeName)
  }

  createEnumMap(enums: string[]) {
      this.enumMap ={};
      enums.forEach((enumValue,index) => { 
	  enumValues = enumValue.split(";");
	  const enumName = enumValues[0];
	  enumValues.shift();
	  this.enumMap[enumName] = enumValues;
      });
  }
}

class TestRowDataEntry implements DataEntry {
  constructor(mapper: Mapper, row: string[]) {
      this.mapper = mapper;
      this.row = row;
  }

   columnNames(): string[] {
       return this.mapper.getHeader();
   }

   get(column: string): any {
       // const type = getType(column);
       return this.row[this.mapper.columnNameLookup[column]];
   }
   
   set(column: string, value: any) {
       // const type = getType(column);
       this.row[this.mapper.columnNameLookup[column]] = value;
   }

   getType(column: string): ColumnType {
       return this.mapper.typeLookup[column];
   } 

   // only valid for enum type columns
   getValues(column: string): string[] {
       return mapper.enumLookup[column];
   }

   // Mandatory fields
   name(): string {
       return this.get("Name");
   }
   createdTime(): Date {
      return this.get("Created");
   }
   updatedTime(): Date {
      return this.get("Updated");
   }
   isComplete(): boolean {
       return this.get("Completed Date") !== '';
   }
   completionTime(): Date {
      return this.get("Completed Date");
   }
   uuid(): string {
      return this.get("UUID");
   }
   copy(): DataRowEntry {
       return new TestRowDataEntry(this.mapper,[...this.row]);
   }
}

