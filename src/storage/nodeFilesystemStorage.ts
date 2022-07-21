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

function _getDataInternal(query: StorageListQuery):Promise<DataEntry[]> {

    var promisedResult = new Promise<DataEntry[]>((resolve, reject) => {
	const data: DataEntry[] = generateData();
	resolve(data);
  });
  return promisedResult;
}

interface JsonObject {
   [name: string]: any;
}

interface JsonData {
   data: string[],
   columns: string[],
   columnTypes: string[],
   enumValues: {name: string, values: string[]}[],
}

function loadFromNodeFS(): Promise<DataEntry[]> {

}

function saveToNodeFS(entries: DataEntry[]): Promise<DataEntry[]> {
    
}


export class FileSystemDataEntry implements DataEntry {

  constructor(private readonly data: JsonData) {
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

