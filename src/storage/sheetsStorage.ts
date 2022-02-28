

export function listMajors() {
        var result = "";
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
          range: 'Class Data!A2:E',
        }).then(function(response) {
          var range = response.result;
          if (range.values.length > 0) {
            result += 'Name, Major: ||';
            for (i = 0; i < range.values.length; i++) {
              var row = range.values[i];
              // Print columns A and E, which correspond to indices 0 and 4.
              result += (row[0] + ', ' + row[4]) + "||";
            }
          } else {
            result += 'No data found.';
          }
        }, function(response) {
          result += 'Error: ' + response.result.error.message;
        });
      }