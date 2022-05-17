
interface ColumnData {
  new(stringToParse: string): ColumnData;
  serialize(): string;
}


class UnknownData implements ColumnData {
  constructor(stringToParse: string): UnknownData {
     // do nothing;
  }
  serialize(): string {
     return "";
  }
}

class ShortTextData implements ColumnData{
  const string text;
  constructor(stringToParse: string) {
     this.text = stringToParse;			     
  }
  
  serialize(): string {
     return text;
  }
}

class LongTexData implements ColumnData {
  const string text;
  constructor(stringToParse: string) {
     this.text = stringToParse;			     
  }

  serialize(): string {
     return text;
  }
}

class IntegerData implements ColumnData {
  const num: number;
  constructor(stringToParse: string) {
     this.num = Math.round(Number(stringToParse));			     
  }

  serialize(): string {
     return num.toString();
  }
}

class NumberData implements ColumnData {
  const num: number;
  constructor(stringToParse: string) {
     this.num = Number(stringToParse);			     
  }

  serialize(): string {
     return num.toString();
  }
}

class LinkData implements ColumnData {
  const link: string;
  const anchor: string;
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
  currentValue: string;
  // TODO - validate this maps to one of the enum values somewhere...
  constructor(stringToParse: string) {
     this.currentValue = stringToParse;			     
  }

  serialize(): string {
     return currentValue;
  }
}

type ColumnTypes =
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
   
     columnDataMapping["words"] = ShortTextData;
     columnDataMapping["paragraph"] = LongTextData;
     columnDataMapping["integer"] = IntegerData;
     columnDataMapping["number"] = NumberData;
     columnDataMapping["link"] = LinkData;
     columnDataMapping["categories"] = EnumData;
}
parseColumnType(stringType: string): { new(textToParse:string): ColumnData } {
     const definedType = columnTypeMapping[stringType];
     if(!!definedType){
	return Undefined;
     }
     return definedType;
}
}
interface DataEntry {
   columnNames: string[];
   get(column: string): any;
   set(column: string, value: any);

   getType(column: string): ColumnType;

   // only valid for enum type columns
   getValues(column: string): string[];

   // Mandatory fields
   name: string;
   createdTime: Date;
   updatedTime: Date;
   isComplete: boolean;
   completionTime: Date;
   uuid: string;
   copy: DataEntry;
}

interface Storage {
   
   getData(includeDone: boolean): DataEntry[];

}
