import React from 'react';

// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import { apiStates, setPartData } from './apicommon';


export const getSheetsData = ({apiAvailable: apiAvailableInput }) => {
  const [data, setData] = React.useState({
    state: apiStates.LOADING,
    error: '',
    result: [],
    apiAvailable: apiAvailableInput
  });

 const setPartData = (partialData) => setData({ ...data, ...partialData });

  React.useEffect(() => {
     console.log("Running Get Sheets with api:" + apiAvailableInput)

    setPartData({
      state: apiStates.LOADING
    });
    if (!apiAvailableInput) {
       console.log("No gapi loaded yet.")
       return;  
    } else {
       console.log("gapi now loaded.")
    }
    getData(true)
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
 }, [apiAvailableInput]);

  return data;
};

function getData(includeDone: boolean):DataEntry[] {
    var promisedResult = _getDataInternal(includeDone);

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

function _getDataInternal(includeDone: boolean):string[][] {

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
       return mapper.getHeader();
   }

   get(column: string): any {
       // const type = getType(column);
       return row[mapper.columnNameLookup[column]];
   }
   
   getType(column: string): ColumnType {
       return mapper.typeLookup[column];
   } 

   // only valid for enum type columns
   getValues(column: string): string[] {
       return mapper.enumLookup[column];
   }

   // Mandatory fields
   name(): string {
       return get("Name");
   }
   createdTime(): Date {
      return get("Created");
   }
   updatedTime(): Date {
      return get("Updated");
   }
   isComplete(): boolean {
       return get("Completed Date") !== '';
   }
   completionTime(): Date {
      return get("Completed Date");
   }
   uuid(): string {
      return get("UUID");
   }
}

