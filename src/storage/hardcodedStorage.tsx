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
import { Storage, StorageListQuery, DataEntry, ColumnType, ColumnData, ShortTextData } from './storageInterface';

export class HardcodedStorage implements Storage {
   getData(query: StorageListQuery): Promise<DataEntry[]> {
       return _getDataInternal(query);
   }
   addOrUpdateData(updatedData: DataEntry[]): Promise<DataEntry[]> {
       // prob should do some saving here too...
       return _getDataInternal({});
   }
}

function generateData(): DataEntry[] {
    const columnNames = ["Name","Description"];
    const columnTypes = [{name: "Name", type: (value: string) => new ShortTextData(value)},{name:"Description", type: (value: string)=> new ShortTextData(value)}];
    const enumValues: {name: string, values: string[]}[] = [];

  const entries: DataEntry[] = [
      new HardcodedDataEntry({ "data":{"Name": "Start things", "Description": "Do it!"}, columns: columnNames, columnTypes: columnTypes, enumValues: enumValues}),
      new HardcodedDataEntry({ "data":{"Name": "Finish things", "Description": "Do it!"}, columns: columnNames, columnTypes: columnTypes, enumValues: enumValues}),
  ];
    return entries;
}

function _getDataInternal(query: StorageListQuery):Promise<DataEntry[]> {

    var promisedResult = new Promise<DataEntry[]>((resolve, reject) => {
	const data: DataEntry[] = generateData();
	resolve(data);
  });
  return promisedResult;
}

interface HardcodedObject {
   [name: string]: any;
}

interface HardcodedData {
   data: HardcodedObject,
   columns: string[],
   columnTypes: {name: string, type: (stringToParse: string) => ColumnData}[],
   enumValues: {name: string, values: string[]}[],
}


export class HardcodedDataEntry implements DataEntry {

  constructor(private readonly data: HardcodedData) {
      // For some reason Firefox needs this...
      this.data = data;
  }

   columnNames(): string[] {
       return this.data.columns;
   }

   get(column: string): any {
       return this.data.data[column];
   }
   
   set(column: string, value: any) {
       this.data.data[column] = value;
   }

   getType(column: string): ColumnType {
       return new ShortTextData("NotRead");
   } 

   // only valid for enum type columns
   getValues(column: string): string[] {
       return [];
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
   copy(): DataEntry {
       return new HardcodedDataEntry(this.data);
   }
}




/*
function mapDataToEntries(response):DataEntry[] {
    
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
**
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
      this.costColumnIndex = header.indexOf("Cost");**
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
*/
