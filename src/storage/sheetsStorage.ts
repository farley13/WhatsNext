
// Use https://dev.to/nicomartin/the-right-way-to-fetch-data-with-react-hooks-48gc as the example...
import apiStates from './apiStates';

export default function listMajors() {
	var prodSheetId = "14sUfq5wu3IjBtiLOjBA_AnoThIVLAEs0DLwj_tLKzxI";
	var devSheetId = "1AKFYuBbuUE6vlz2zO3DtSN52PNMbysridLEaSc3CmzY";
	
	if (window.gapi.client.sheets) {
	   console.log("window.gapi.client.sheets loaded")
    } else {
      	   return "window.gapi.client.sheets not loaded";
      }

	window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: devSheetId,
          range: 'AT List!A1:AN100',
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
	  console.log("Got sheets data in react " + result);
        }, function(response) {
          return 'Error: ' + response.result.error.message;
        });

	return "See console for info...";

      }