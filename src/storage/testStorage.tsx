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
    _getDataInternal(true)
      .then((result) => {
        setPartData({
          state: apiStates.SUCCESS,
          result
        });
      })
      .catch((error) => {
       setPartData({
          state: apiStates.ERROR,
          error: 'fetch failed: ' + error
        });
      });
 }, [apiAvailableInput]);

  return data;
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
  constructor(header: string[], headerTypes: string[], headerEnums: string[]) {
      
      this.header = header;
      this.headerTypeMap = createTypeMap(headerTypes);
      this.headerEnumMap = createEnumMap(headerEnums);
      this.nameColumnIndex = header.indexOf("Name")
      this.createdTimeColumnIndex = header.indexOf("Created");
      this.timestampColumnIndex = header.indexOf("Updated");
      this.editColumnIndex = header.indexOf("Edit Link");
      this.completionDateColumnIndex = header.indexOf("Completed Date");
      this.nextScheduledEventColumnIndex = header.indexOf("Edit Event");
      this.nextScheduledEventLinkColumnIndex = header.indexOf("Edit Event Link");
      this.scheduleNewLinkColumnIndex = header.indexOf("Custom Scheduler");
      this.UuidColumnIndex = header.indexOf("UUID");
      this.OrderColumnIndex = header.indexOf("Order");

      this.columnNameLookup = {};
      header.forEach((colName,index) => this.columnNameLookup[colName] = index);

      // UDFs - my own - but could be anyone\'s
      this.doneColumnIndex = header.indexOf("Done");
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
      this.costColumnIndex = header.indexOf("Cost");
  }

  createTypeMap(header: string[], types: string[]) {
      typeMap = {};
      types.foreach((typeName,index) => typeMap[header[index]] = typeName)
  }

  createEnumMap(enums: string[]) {
      const enumMap ={};
      types.foreach((enumValue,index) => { 
	  enumValues = enumValue.split(";");
	  const enumName = enumValues[0];
	  enumValues.shift();
	  enumMap[enumName] = enumValues;
      });
  }
}

class TestRowDataEntry implements DataEntry {
  constructor(mapper: Mapper, row: string[]) {
      this.mapper = mapper;
      this.row = row;
  }

   columnNames(): string[] {
       return mapper.header;
   }

   get(column: string): any {
       const type = getType(column);
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

function getData(includeDone: boolean):DataEntry[] {
    var promisedResult = _getDataInternal(includeDone);

    return promisedResult.then(function(response) {
	const rows = response.result;
	const header = rows(0);
	
        }, function(response) {
          return 'Error: ' + response.result.error.message;
        });
}
