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
