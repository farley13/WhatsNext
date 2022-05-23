
export interface ColumnData {
   serialize(): string;
}

// TODO remove 'Data' from the end of each of these
class UnknownData implements ColumnData {
  constructor(stringToParse: string) {
     // do nothing;
  }
  serialize(): string {
     return "";
  }
}

export class ShortTextData implements ColumnData{
  private readonly text: string;
  constructor(stringToParse: string) {
     this.text = stringToParse;			     
  }
  
  serialize(): string {
     return this.text;
  }
}

class LongTextData implements ColumnData {
   private readonly text: string;
  constructor(stringToParse: string) {
     this.text = stringToParse;			     
  }

  serialize(): string {
     return this.text;
  }
}

class IntegerData implements ColumnData {
  private readonly num: number;
  constructor(stringToParse: string) {
     this.num = Math.round(Number(stringToParse));			     
  }

  serialize(): string {
     return this.num.toString();
  }
}

class NumberData implements ColumnData {
  private readonly num: number;
  constructor(stringToParse: string) {
     this.num = Number(stringToParse);			     
  }

  serialize(): string {
     return this.num.toString();
  }
}

class LinkData implements ColumnData {
  private readonly link: string;
  private readonly anchor: string;
  constructor(stringToParse: string) {
     const parsedJson = JSON.parse(stringToParse);
     this.link = parsedJson.link.toString();
     this.anchor = parsedJson.anchor.toString();
  }

  serialize(): string {
     const seralized = { link: this.link.toString(), anchor: this.anchor.toString() };
     return JSON.stringify(seralized);
  }

}

class EnumData implements ColumnData {
  private readonly currentValue: string;
  // TODO - validate this maps to one of the enum values somewhere...
  constructor(stringToParse: string) {
     this.currentValue = stringToParse;			     
  }

  serialize(): string {
     return this.currentValue;
  }
}

export type ColumnType =
   UnknownData |
   ShortTextData |
   LongTextData |
   IntegerData |
   NumberData |
   LinkData |
   EnumData;

class ColumnTypeParser {
static columnTypeMapping: { [key:string]: { new(textToParse:string): ColumnData}; } = {};
static {
   
     ColumnTypeParser.columnTypeMapping["words"] = ShortTextData;
     ColumnTypeParser.columnTypeMapping["paragraph"] = LongTextData;
     ColumnTypeParser.columnTypeMapping["integer"] = IntegerData;
     ColumnTypeParser.columnTypeMapping["number"] = NumberData;
     ColumnTypeParser.columnTypeMapping["link"] = LinkData;
     ColumnTypeParser.columnTypeMapping["categories"] = EnumData;
}
parseColumnType(stringType: string): { new(textToParse:string): ColumnData } {
     const definedType = ColumnTypeParser.columnTypeMapping[stringType];
     if(!!definedType){
	return UnknownData;
     }
     return definedType;
}
}
export interface DataEntry {
   columnNames(): string[];
   get(column: string): any;
   set(column: string, value: any): void;

   getType(column: string): ColumnType;

   // only valid for enum type columns
   getValues(column: string): string[];

   // Mandatory fields
   name(): string;
   createdTime(): Date;
   updatedTime(): Date;
   isComplete(): boolean;
   completionTime(): Date;
   uuid(): string;
   copy(): DataEntry;
}

export interface Storage {   
   getData(query: StorageListQuery): Promise<DataEntry[]>;
   addOrUpdateData(updatedData: DataEntry[]): Promise<DataEntry[]>;
}

export interface StorageListQuery {
    ids?:string[];
    dateSince?:string;
    stringMatch?:string;
    parameterValues?:{key: string, value: string}[];
}
