/*
function gH(name) {
    var sheet = SpreadsheetApp.getActiveSheet();
  var formula = SpreadsheetApp.getActiveRange().getFormula();
  var args = formula.match(/\w+:\w+(?=[ ,])/);
  var range = sheet.getRange(args[0]);
  var firstRow = range.offset(0, 0, 1, range.getWidth());
  var headers = firstRow.getValues();
  for (var i = 0; i < headers[0].length; i++) {
    if (headers[0][i] == name) {
      var notation = range.getCell(1, i+1).getA1Notation();
      var column = notation.replace(/\d/, '');
      return column;
    }
  }
  return 'Not found';
}*/

// From https://support.awesome-table.com/hc/en-us/articles/115001156125-Allow-users-to-update-your-app-s-data-with-Google-Forms

var formURL = 'https://docs.google.com/forms/d/1SqQR-cbf4hgkXvBprzMYTBZzPT5KlaEdLxVNk8vXydQ/viewform';
var formSheetName = 'Form Raw List';

// Web App
function doGet(e) {
    var showWhatsNext = e.parameter.whatsNext || false;
  var organizeView = e.parameter.organizeView || false;

  if (showWhatsNext) {
      return HtmlService.createHtmlOutputFromFile('WhatsNext');
  } if (organizeView) {
      return HtmlService.createHtmlOutputFromFile('OrganizeView')
  }
  return HtmlService.createHtmlOutputFromFile('FindATime');
}


function setMilestoneDropDown(list) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(formSheetName);
  var data = sheet.getDataRange().getValues();
  var form = FormApp.openByUrl(formURL);
  var formItems = form.getItems();
   for (var i=0; i < formItems.length; i++) {
     var formItemName = formItems[i].getTitle();
     if (formItemName === "Milestone") {
       list.push("None");
       formItems[i].asMultipleChoiceItem().setChoiceValues(list);
     }
   }
}

function testUuidv4() {
  var uuid = Utilities.getUuid();
  Logger.log("Uid returned is " + uuid);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                                               var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function testFormatDateToSortable() {
  var d = new Date('Fri Aug 21 2020 14:11:11 GMT-0400');
  var result = formatDateToSortable(d);
  return result;
}

function formatDateToSortable(dateToFormat) {
  var d = dateToFormat;
  month = ('' + (d.getMonth() + 1)).padStart(2, "0");
  day = '' + d.getDate();
  year = d.getFullYear();
  hour = ('' + d.getHours()).padStart(2, "0");
  minute = ('' + d.getMinutes()).padStart(2, "0");
  return year + "-" + month + "-" + day + " " + hour + ":" + minute;
}

function getFormSubmittedFromTimestamp(form, timestamp) {
  var formsSubmittedAfterTime = form.getResponses(timestamp);
  var formSubmitted;
  if (formsSubmittedAfterTime.length > 0) { 
    for (formIndex = 0; formIndex < formsSubmittedAfterTime.length; formIndex++) { // currently the items are sorted - but this is not documented
      if (formsSubmittedAfterTime[formIndex].getTimestamp().getTime() === timestamp.getTime()){
        formSubmitted = formsSubmittedAfterTime[formIndex];
      }
    }
  }
  return formSubmitted;
}

function getEditResponseUrls() { 

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(formSheetName);
  var data = sheet.getDataRange().getValues();
  var form = FormApp.openByUrl(formURL);
  var formItems = form.getItems();
  var defaultCalendar = CalendarApp.getDefaultCalendar();
  var header = data[0];
  var nameColumnIndex = header.indexOf("Name");
  var createdColumnIndex = header.indexOf("Created");
  var timestampColumnIndex = header.indexOf("Timestamp");
  var editColumnIndex = header.indexOf("Edit Link");
  var commentColumnIndex = header.indexOf("Comment");
  var doneColumnIndex = header.indexOf("Done");
  var loeColumnIndex = header.indexOf("Time Remaining [Hours]");
  var originalLoeColumnIndex = header.indexOf("Original LOE");
  var completionDateColumnIndex = header.indexOf("Completion Date");
  var milestoneColumnIndex = header.indexOf("Milestone");
  var nextScheduledEventColumnIndex = header.indexOf("Next Scheduled Event");
  var nextScheduledEventLinkColumnIndex = header.indexOf("Next Scheduled Event Link");
  var UuidColumnIndex = header.indexOf("UUID");
  
  var currentMilestones = []
  var eventsByUuid = findNextEventsInCalendar();
      
  for(var row = 1; row < data.length; row++) {
    
    // Make sure the current row has a valid response and get it
    if(data[row][nameColumnIndex] === '') {
      continue;
    }
    var timestamp = data[row][timestampColumnIndex];
    if (!timestamp || timestamp === '') {
      continue;
    }
    
    // Update any missing responses with default ones (since submitting new responses to a form doesn't work)
    if (data[row][editColumnIndex] === '') {
      var formSubmitted = getFormSubmittedFromTimestamp(form, timestamp);
      if (formSubmitted) {
        var editResponseUrl = formSubmitted.getEditResponseUrl();
        sheet.getRange(row+1, editColumnIndex+1).setValue(editResponseUrl);
      }
    }
    if (data[row][createdColumnIndex] === '') {
      sheet.getRange(row+1, createdColumnIndex+1).setValue(new Date());
    }
    if (data[row][doneColumnIndex] === '') {
      sheet.getRange(row+1, doneColumnIndex+1).setValue('N');
    }
    if (data[row][originalLoeColumnIndex] === '') {
      sheet.getRange(row+1, originalLoeColumnIndex+1).setValue(data[row][loeColumnIndex].valueOf());
    }
    if (data[row][doneColumnIndex] === 'Y' && data[row][completionDateColumnIndex] === '') {
      sheet.getRange(row+1, completionDateColumnIndex+1).setValue(data[row][timestampColumnIndex]);
    }
    if (data[row][milestoneColumnIndex] === 'None') {
      sheet.getRange(row+1, milestoneColumnIndex+1).setValue('');
    }
    if (data[row][UuidColumnIndex] === '') {
      var uuid = Utilities.getUuid();
      sheet.getRange(row+1, UuidColumnIndex+1).setValue(uuid);
      data[row][UuidColumnIndex] = uuid;
    }
    // a bit of an ugly hack because we can't edit the submitted rows from recurring events right after submission
    if (data[row][commentColumnIndex] && 
        data[row][commentColumnIndex].includes("[WorkitemEventGen]")) {
      var oldRecurringUuid = extractGuidFromDescription(data[row][commentColumnIndex]);
      if (oldRecurringUuid != '') {
        var event = eventsByUuid[oldRecurringUuid];
        if (event) {
          var newRow = data[row];
          var currentDescription = event.getDescription();
          var newUuid = newRow[UuidColumnIndex];
          var newDescription = currentDescription.replace(/https:\/\/docs.google.com\/forms\/d?[^ ]*/g, data[row][editColumnIndex]);
          newDescription = newDescription.replace(/\[WorkitemEventGen\].*\[WorkitemEventGen\]/, "[WorkitemEventGen]" + newUuid+ "[WorkitemEventGen]");
          event.getEventSeries().setDescription(newDescription);
          event.setDescription(newDescription);
          var cleanedSheetComment = data[row][commentColumnIndex].replace(/[ ]*\[WorkitemEventGen\].*\[WorkitemEventGen\]/,"");
          sheet.getRange(row+1, commentColumnIndex+1).setValue(cleanedSheetComment);
          var updated = event.getDescription();
        }
      }
    }
    // If we can find an event - update our sheet with it
    if (data[row][doneColumnIndex] !== 'Y') {
      var uuid = data[row][UuidColumnIndex];
      if (uuid in eventsByUuid) {
        var nextScheduledEvent = eventsByUuid[uuid];
        // TODO format this so that it's sortable
        var startTime = formatDateToSortable(nextScheduledEvent.getStartTime());
        sheet.getRange(row+1, nextScheduledEventColumnIndex+1).setValue(startTime);
        var fullEditUrl = getEventEditUrl(nextScheduledEvent);
        sheet.getRange(row+1, nextScheduledEventLinkColumnIndex+1).setValue(fullEditUrl);
      }
    }
    
    var isDone = data[row][doneColumnIndex];
    var milestone = data[row][milestoneColumnIndex];
    var threeMonthsBack = new Date('1900-03-01').getTime() - new Date('1900-01-01').getTime();
    // If this is not done or fairly recently updated and has a milestone - add it to our dropdown
    if ((data[row][doneColumnIndex] !== 'Y' || new Date().getTime() - timestamp.getTime() < threeMonthsBack) && 
        data[row][milestoneColumnIndex] !== '' && data[row][milestoneColumnIndex] !== 'None' &&
        currentMilestones.indexOf(data[row][milestoneColumnIndex])  < 0) {
          var difference = new Date().getTime() - timestamp.getTime();
          currentMilestones.push(data[row][milestoneColumnIndex]);
    }
  }
  currentMilestones.sort();
  setMilestoneDropDown(currentMilestones);
  
}

function getEventEditUrl(event) {
  var splitEventId = event.getId().split('@');
  var calendarId = event.getOriginalCalendarId();
  var fullEditUrl = "https://www.google.com/calendar/event?eid=" + Utilities.base64Encode(splitEventId[0] + " " + calendarId);
  return fullEditUrl;
}

function addLineBreaks() {
  var theForm = FormApp.openByUrl(formURL);
  var theQuestions = theForm.getItems();
  var thePlaceholder = new RegExp(/\s{4,99}|\n/, 'gi');
  for (i = 0; i < theQuestions.length; i++) {
    if (theQuestions[i].getTitle() === "Cost") {
      var choices = theQuestions[i].asGridItem();
      var currentColumns = choices.getColumns();
      for (q = 0; q < currentColumns.length; q++) {
        var theText = currentColumns[q];
        if (theText.search(thePlaceholder) > 0 ) {
          currentColumns[q] = theText.replace(thePlaceholder,'    \n');
        }
      }
      choices.setColumns(currentColumns);
    }
  }
}

// This can't actually edit existing Form responses :(
function updatePollResponseWithData(columnName, columnValue, formItems, formResponse) {

      for (var i=0; i < formItems.length; i++) {     // TODO - could probably create a map here to avoid this...
      var formItemName = formItems[i].getTitle();  
      var foundIt = false;
      if (columnName === formItemName) {
        foundIt = true;
      }
      // we have some headers with a single row of responses instead of a column
      else if ( formItems[i].getType() === FormApp.ItemType.GRID) {
        var subName = formItems[i].asGridItem().getRows()[0];
        foundIt = columnName === formItemName+' ['+subName+']';
      }
      if (foundIt !== true) {
        continue;
      }
      var respItem;
      // Need to treat every type of answer as its specific type.
      if (columnValue !== '' ) {     //jumps the entire procedure for empty datafields, as may occur for non required questions
        switch (formItems[i].getType()) {  //note that data[#][1] corresponds to item[0], as there's no timestamp item!
          case FormApp.ItemType.MULTIPLE_CHOICE:
            item = formItems[i].asMultipleChoiceItem();
            respItem = item.createResponse(columnValue);
            break;
          case FormApp.ItemType.CHECKBOX:
            // In a form submission event, resp is an array, containing CSV strings. Join into 1 string.
            // In spreadsheet, just CSV string. Convert to array of separate choices, ready for createResponse().
            if (typeof resp !== 'string'){
              columnValue = columnValue.join(',');      // Convert array to CSV
            }
            columnValue = columnValue.split(/ *, */);   // Convert CSV to array
            respItem = formItems[i].asCheckboxItem().createResponse(columnValue);
            break;
          case FormApp.ItemType.TEXT:
            respItem = formItems[i].asTextItem().createResponse(columnValue);
            break;
          case FormApp.ItemType.PARAGRAPH_TEXT: 
            respItem = formItems[i].asParagraphTextItem().createResponse(columnValue);
            break;
          case FormApp.ItemType.DATE: 
            respItem = formItems[i].asDateItem().createResponse(columnValue);
            break;
          case FormApp.ItemType.GRID:
            columnValue = columnValue + '';
            respItem = formItems[i].asGridItem().createResponse([columnValue]);
            break;
          default:
            respItem = null;  // Not handling DURATION, IMAGE, PAGE_BREAK, SCALE, SECTION_HEADER, TIME
            break;
        }
        if (respItem) {// Add this answer to form
            formResponse.withItemResponse(respItem);
        }
        else {
          Logger.log("Skipping i="+i+", question="+items[i]+" type:"+items[i].getType());//skip any other type of response
        }
      }
    }
}

function testFindNextEvent() {
  var name = "Schedule intro meetings with Katlyn and Michael to Join Team";
  var events = findNextEventsInCalendar();
  event = events[name];
}

function testExtractGuidFromDescription() {
  var description = "Some stuff... [WorkitemEventGen]abc-1234[WorkitemEventGen] Other stuff";
  var guid = extractGuidFromDescription(description);
  if (guid !== "abc-1234") {
    Logger.log("Guid was not right - it is " + guid);
  } else {
    Logger.log("Success");
  }
  
  var description2 = "Some stuff... [WorkitemEventGen]<span>abc-1234</span>[WorkitemEventGen] Other stuff";
  var guid2 = extractGuidFromDescription(description2);
  if (guid2 !== "abc-1234") {
    Logger.log("Guid was not right - it is " + guid2);
  } else {
    Logger.log("Success");
  }
}

function testGetWorkitemsFromGuids() {
  var workItems =  getWorkitemsFromUuids({"6ff92911-ed22-4c45-926b-7bbc40b77f3c":""});
  Logger.log("Success: " + JSON.stringify(workItems));
}

function getWorkitemsFromUuids(guids) {
  return __getWorkitemsFromUuids(guids, false);
}

function getAllWorkitems() {
  return __getWorkitemsFromUuids({}, true);
}

function __getWorkitemsFromUuids(guids, includeAll) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AT List");
  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var nameColumnIndex = header.indexOf("Name");
  var createdColumnIndex = header.indexOf("Created");
  var timestampColumnIndex = header.indexOf("Updated");
  var editColumnIndex = header.indexOf("Edit Link");
  var commentColumnIndex = header.indexOf("Comment");
  var doneColumnIndex = header.indexOf("Done");
  var loeColumnIndex = header.indexOf("Time Remaining [Hours]");
  var originalLoeColumnIndex = header.indexOf("Original LOE");
  var completionDateColumnIndex = header.indexOf("Completed Date");
  var milestoneColumnIndex = header.indexOf("Milestone");
  var nextScheduledEventColumnIndex = header.indexOf("Edit Event");
  var nextScheduledEventLinkColumnIndex = header.indexOf("Edit Event Link");
  var UuidColumnIndex = header.indexOf("UUID");
  var OrderColumnIndex = header.indexOf("Order");
  var DomainColumnIndex = header.indexOf("Domain");
  var externalLinkAnchorColumnIndex = header.indexOf("Ext Link");
  var externalLinkColumnIndex = header.indexOf("Links");
  var scheduleNewLinkColumnIndex = header.indexOf("Custom Scheduler");
  var dueDateColumnIndex = header.indexOf("Due Date");
  var categoriesColumnIndex = header.indexOf("Categories");

  rowsByUuid = {};

  for(var row = 1; row < data.length; row++) {
    
    // Make sure the current row has a valid response and get it
    if(data[row][nameColumnIndex] === '') {
      continue;
    }
    var timestamp = data[row][timestampColumnIndex];
    if (!timestamp || timestamp === '') {
      continue;
    }
    var uuid = data[row][UuidColumnIndex];
    if (!uuid || !(uuid in guids) && !includeAll) {
      continue;
    }
    // We eventually might want to see closed items, but not to start
    if (includeAll && data[row][doneColumnIndex] === "Y") {
      continue;
    }

    rowCopy = {};
    // Need to make a deep copy so we convert all these to strings
    rowCopy["name"] = data[row][nameColumnIndex] + "";
    rowCopy["createdTime"] =  data[row][createdColumnIndex] + "";
    rowCopy["editedTime"] =  data[row][timestampColumnIndex] + "";
    rowCopy["editLink"] =  data[row][editColumnIndex] + "";
    rowCopy["comment"] =  data[row][commentColumnIndex] + "";
    rowCopy["status"] =  data[row][doneColumnIndex] + "";
    rowCopy["LOE"] =  data[row][loeColumnIndex] + ""; 
    rowCopy["originalLOE"] =  data[row][originalLoeColumnIndex] + ""; 
    rowCopy["completionDate"] =  data[row][completionDateColumnIndex] + "" ; 
    rowCopy["milestoneName"] =  data[row][milestoneColumnIndex] + "";
    rowCopy["nextScheduledTime"] =  data[row][nextScheduledEventColumnIndex] + "";
    rowCopy["editEventLink"] =  data[row][nextScheduledEventLinkColumnIndex] + "";
    rowCopy["uuid"] =  data[row][UuidColumnIndex] + "";
    rowCopy["order"] =  data[row][OrderColumnIndex] + "";
    rowCopy["domain"] =  data[row][DomainColumnIndex] + "";
    rowCopy["externalLinkAnchor"] = data[row][externalLinkAnchorColumnIndex] + "";
    rowCopy["externalLink"] = data[row][externalLinkColumnIndex] + "";
    rowCopy["scheduleNewLink"] = data[row][scheduleNewLinkColumnIndex] + "";
    rowCopy["dueDate"] = data[row][dueDateColumnIndex] + "";
    rowCopy["categories"] = data[row][categoriesColumnIndex] + "";

    rowsByUuid[uuid] = rowCopy;
  }
  return rowsByUuid;
}

function extractGuidFromDescription(description) {
  var arr = description.match(/\[WorkitemEventGen\](.*)\[WorkitemEventGen\]/m);
  if (arr && arr.length > 1) {
    var guid = arr[1].replace("<span>","").replace("</span>","");
    return guid;
  }
  return "";
}

function findNextEventsInCalendarWrapper() {
  var events = findNextEventsInCalendar();
  var eventsWrapper = {};
  for (eventUid in events) {
    var myEvent = events[eventUid];
    eventsWrapper[eventUid] = wrapEvent(myEvent);
  }
  return eventsWrapper;
}

function wrapEvent(event) {
    var wrapper = {};
    if (event) {
      wrapper['title'] = event.getTitle() + '';
      wrapper['startTime'] = event.getStartTime() + ''; 
      wrapper['endTime'] = event.getEndTime() + ''; 
      wrapper['uuid'] = extractGuidFromDescription(event.getDescription());
      wrapper['description'] = event.getDescription() + '';
      wrapper['editLink'] = getEventEditUrl(event);
    }
    return wrapper;
}

function findNextEventsInCalendar() {
  var keyword = "WorkitemEventGen";
  var nextScheduledEvent = null;
  var eventsByUuid = {};
  var startDate = new Date();
  startDate.setTime(startDate.getTime() - 1000*60*60*startDate.getHours());
  var endDate = new Date();
  endDate.setTime(endDate.getTime() + 1000*60*60*24*30);
  var events = CalendarApp.getDefaultCalendar().getEvents(startDate, endDate, {search: keyword});
  if (events.length > 0) {
    for (var event = 0; event < events.length; event++ ) {
      var eventUuid = extractGuidFromDescription(events[event].getDescription());
      if (!(eventUuid in eventsByUuid) || events[event].getStartTime() < eventsByUuid[eventUuid].getStartTime()) {
        eventsByUuid[eventUuid] = events[event];
        var name = events[event].getTitle();
        var startTime = events[event].getStartTime();
        Logger.log("Uid returned is " + eventUuid);
      }
    }
  }
  return eventsByUuid;
}

function rescheduleRecurringEvents() {

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(formSheetName);
  var data = sheet.getDataRange().getValues();
  var form = FormApp.openByUrl(formURL);
  var formItems = form.getItems();
  var defaultCalendar = CalendarApp.getDefaultCalendar();
  var header = data[0];
  var nameColumnIndex = header.indexOf("Name");  // not used - just for debugging
  var timestampColumnIndex = header.indexOf("Timestamp");
  var createdColumnIndex = header.indexOf("Created");
  var doneColumnIndex = header.indexOf("Done");
  var UuidColumnIndex = header.indexOf("UUID");
  
  var currentMilestones = []
  var eventsByUuid = findNextEventsInCalendar();
  var recurringEventsByGuid = {};  
  
  var startOfToday = new Date();
  startOfToday.setTime(startOfToday.getTime() - 1000*60*60*startOfToday.getHours());
  var tomorrowDate = new Date();
  tomorrowDate.setTime(tomorrowDate.getTime() + 1000*60*60*24 - 1000*60*60*tomorrowDate.getHours());
  var recurringEventCount = 0;
  
  for (const [uuid, event] of Object.entries(eventsByUuid)) {
    // If we have a recurring event today check to see if there's already an open workitem tracking it
    if (event.isRecurringEvent() && event.getStartTime() < tomorrowDate) {
      recurringEventsByGuid[uuid] = event;
      recurringEventCount++;
    }
  }
  
  for(var row = 1; row < data.length; row++) {
    if (data[row][timestampColumnIndex] === '') {
      continue;
    }
    
    var done = data[row][doneColumnIndex];
    var uuid = data[row][UuidColumnIndex];
    var createdDate = data[row][createdColumnIndex];
    var name = data[row][nameColumnIndex];
    
    // If the prior workitem is already done, and wasn't created today and 
    // is actually tied to one of the recurring events
    if (done == 'Y' && createdDate < startOfToday && uuid in recurringEventsByGuid) {
      var event = recurringEventsByGuid[uuid];
      // create new workItem
      var response = form.createResponse();
      // for all columns in the current row, add responses and submit
      for(var columnIndex = 0; columnIndex < header.length; columnIndex++) {
        var columnName = header[columnIndex];
        var columnValue = data[row][columnIndex];
        if (columnName === 'Done'){
          columnValue = 'N';
        } else if (columnName === 'Comment') {
          columnValue = columnValue.replace(/[ ]*\[WorkitemEventGen\].*\[WorkitemEventGen\]/,"");
          columnValue = columnValue + ' [WorkitemEventGen]' + uuid + '[WorkitemEventGen]';
        }
        if (columnValue) {
          updatePollResponseWithData(columnName, columnValue, formItems, response);
        }
      }
      var result = response.submit();
      Utilities.sleep(5);
    }
  }
}

// from https://webapps.stackexchange.com/questions/28154/importing-data-into-a-google-forms-response-sheet
// Only run manually

function FillFormfromSpreadSheetForUnsubmittedRows() {
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(formSheetName);
 var form = FormApp.openByUrl(formURL); 
 var data = sheet.getDataRange().getValues();  // Data to fill
 var EmptyString = '';
 var items = form.getItems();
 var header = data[0];
 var indexOfTimestamp = header.indexOf("Timestamp");
  for (var row = 1; row < data.length; row++ ) { //jumps first row, containing headers
    if (data[row][indexOfTimestamp] !== EmptyString) {
      continue;
    }
    try{
      var response = form.createResponse();
      // for all columns in the current row, add responses and submit
      response.submit();
      Utilities.sleep(5);
    } 
    catch (exception) { 
      Logger.log("Error adding row " + i + " due to " + exception);
    }
  }
}
