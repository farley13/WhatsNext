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

