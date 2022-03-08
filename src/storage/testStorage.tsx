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
    listMajors()
      .then((result) => {
        setPartData({
          state: apiStates.SUCCESS,
          result
        });
      })
      .catch(() => {
       setPartData({
          state: apiStates.ERROR,
          error: 'fetch failed'
        });
      });
 }, [apiAvailableInput]);

  return data;
};

function listMajors() {

    var promisedResult = const myPromise = new Promise((resolve, reject) => {
      const header = ["name", createdTimelumnIndex = header.indexOf("Created");
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
  var importanceColumnIndex = header.indexOf("Importance");
  var costColumnIndex = header.indexOf("Cost");

      const rows = header.append(data);
      const range = { values: rows };
      resolve('foo');
}).then(function(response) {
	  var result = "";
          var range = response.result;
          if (range.values.length > 0) {
            result += 'Name, Major: ||';
            for (var i = 0; i < range.values.length; i++) {
              var row = range.values[i];
              // Print columns A and E, which correspond to indices 0 and 4.
              result += (row[0] + ', ' + row[4]) + "||";
            }
          } else {
            result += 'No data found.';
          }
	  return result;
        }, function(response) {
          return 'Error: ' + response.result.error.message;
        });

	return promisedResult;
      }