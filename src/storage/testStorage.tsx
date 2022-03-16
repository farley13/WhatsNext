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

function listMajors() {

    var promisedResult = new Promise((resolve, reject) => {
      const header = ["Name","Created","Updated","Edit Link", "Comment", "Done", "Time Remaining [Hours]","Original LOE", "Completed Date","Milestone","Edit Event","Edit Event Link","UUID","Order", "Domain", "Ext Link", "Links", "Custom Scheduler", "Due Date","Categories", "Importance","Cost"];
  
  var nameColumnIndex = header.indexOf("Name")
  var createdTimeColumnIndex = header.indexOf("Created");
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
      const data = generateData();
      const rows = [header];
      [].push.apply(rows,data);
      const range = { values: rows };
      const result = { result: range };
      resolve(result);
}).then(function(response) {
          var result = response;
           
	   return {response: result};
        }, function(response) {
          return 'Error: ' + response.result.error.message;
        });

	return promisedResult;
      }
