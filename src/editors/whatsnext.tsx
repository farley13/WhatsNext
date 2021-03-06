    <style>
      /* Make mobile half decent */
      @media screen and (max-width: 70em) { 
        * { 
        font-size:4vw;
        max-width:100%;
        } 
        button {
          font-size: 3vw;
        }
        a {
          font-size: 3vw;
        }
        p {
          max-height: 9vw;
      }
      }
      
      td {
         border-width: 1px;
         border-style: solid;
         padding: 10px;
      }
      p {
        overflow: clip;
        overflow: hidden;
        word-wrap:break-word;
        max-height: 2vw;
      }
      .currentEvent {
        font-weight: bold;
      }
    </style>
    <h1>
      Next Items <button onclick="reloadWithFullDay();">Full Day </button><button onclick="reloadWithoutFullDay();">Refresh</button><button><a target="__blank" href="https://script.google.com/macros/s/AKfycbyZREQgftIDsYyV_tkEuIahowwYCiD8CVTMWftneIrc/dev?organizeView=true">Organize</a></button>
    </h1>
    <!--<table>
    <tbody id=nextEventsTable>
    <tr>
    <td> Mark In Progress</td>
    <td> Reschedule</td>
    <td>Status</td>
    <td>  Name</td>
    <td>  Ext Link</td>
    <td> Due Date</td>
    <td>  Comment</td>
    <td>  Milestone</td>
     <td> Time Remaining [Hours]</td>
    <td> Importance</td>
    <td> Fun?</td>
    <td> Domain</td>
    <td> 2nd Party</td>
    <td> Cost</td>
    <td> Created</td>
    <td> Updated</td>
     <td> Categories</td>
    </tr>
    </tbody>
    </table>-->
    <div id="currentPeriod">Loading current period...</div>
    <div><a target="__blank" href="https://docs.google.com/document/d/103LCJULzJZdaF1QMXetqdYI3eFoepLM-Ynt5vMMcfMw/edit">How to get started</a></div>
    <button><a target="__blank" href="https://docs.google.com/forms/d/e/1FAIpQLScFfscOqt8TnLc6PiLWc8qwTY03A33fQfabXFLQzdWbtjoAtg/viewform?usp=pp_url&entry.756313724=N&entry.1283930567=2021-06-06">Create NEW Item</a></button>
    <div id="nextEvents">Loading Events...</div>
    <div id="eventBlocks">Loading CurrentTimeBlock...</div>

      function formatDateToPaddedHumanReadable(dateToFormat) {
        var d = dateToFormat;
        year = d.getFullYear();
        month = ('' + (d.getMonth() + 1)).padStart(2, "0");
        day = ('' + d.getDate()).padStart(2, "0");
        hour = ('' + d.getHours()).padStart(2, "0");
        minute = ('' + d.getMinutes()).padStart(2, "0");
        var dateObj = {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute
        };
        return dateObj;
    }
    
      function formatDateToClockPlusDay(dateToFormat) {
        var dateObj = formatDateToPaddedHumanReadable(dateToFormat);
        return dateObj.day + ' '+ dateObj.hour + ":" + dateObj.minute;
      }
      
      function formatDateToClockPlusFullDate(dateToFormat) {
        var dateObj = formatDateToPaddedHumanReadable(dateToFormat);
        return dateObj.month + '/'+ dateObj.day + ' '+ dateObj.hour + ":" + dateObj.minute;
      }  

      function formatDateToClock(dateToFormat) {
        var dateObj = formatDateToPaddedHumanReadable(dateToFormat);
        return dateObj.hour + ":" + dateObj.minute;
      }
 
      function openEditWorkitem(editLink, newStatus) {
        if (newStatus && newStatus.trim() !== '') {
          window.open(editLink + "&entry.756313724="+ newStatus);
        } else {
          window.open(editLink);
        }
      }

      function reloadWithFullDay() {
        showAllEventsPP = true;
        google.script.run.withSuccessHandler(onNextEventsSuccess)
          .findEventsInCalendarForDay(dateStartOfDay  + '');
      }

      function reloadWithoutFullDay() {
        showAllEventsPP = false;
        google.script.run.withSuccessHandler(onNextEventsSuccess)
          .findEventsInCalendarForDay(dateStartOfDay  + '');
      }

      function expandParagraph(elmnt) {
        if(elmnt.style.maxHeight === "100vw") {
          elmnt.style.maxHeight = "9vw"
        } else {
          elmnt.style.maxHeight = "100vw";
        }
      }

      function filterEventsToGuids(nextEvents) {
        currentDateAndTime = new Date();
        currentHours = currentDateAndTime.getHours() + currentDateAndTime.getMinutes() / 60;
        currentHours = currentHours - .75; // helpful to see a little bit back
        var tomorrow = new Date(currentDateAndTime.valueOf() + 1000*3600 *24);
        var eventCount = 0;
        var uuidsForEvents = {};
        for (const [index, myEvent] of Object.entries(nextEvents)) {
            var startTime = new Date(myEvent['startTime']);
            var startHours = startTime.getHours() + startTime.getMinutes() / 60;
            var endTime = new Date(myEvent['endTime']);
            var endHours = endTime.getHours() + endTime.getMinutes() / 60;
            var uuid = myEvent["uuid"];
            if (showAllEventsPP === true || 
                startHours < currentHours && endHours > currentHours || // current event
                startHours > currentHours && startTime.getDate() === currentDateAndTime.getDate() || // next event
                startTime.getDate() === tomorrow.getDate() || // tomorrow event
                endHours > currentHours && startTime.getDate() !== currentDateAndTime.getDate() ) { // past event
                uuidsForEvents[uuid] = "";
                eventCount = eventCount + 1;
             
            if (eventCount > 8 && showAllEventsPP === false) {
              break;
            }
            }
        }
        return uuidsForEvents;
      }
      function workItemsToHtml(workitemsByUuid, nextEvents) {
        currentDateAndTime = new Date();
        currentHours = currentDateAndTime.getHours() + currentDateAndTime.getMinutes() / 60;
        lookbackHours = currentHours - .75; // helpful to see a little bit back
        var htmlOutput = "";
        var eventCount = 0;

        for (const [eventUuid, myEvent] of Object.entries(nextEvents)) { 

          var startTime = new Date(myEvent['startTime']);
          var startHours = startTime.getHours() + startTime.getMinutes() / 60;
          var endTime = new Date(myEvent['endTime']);
          var endHours = endTime.getHours() + endTime.getMinutes() / 60;

          console.log('current time:' + currentDateAndTime + 'event:' + JSON.stringify(myEvent));
          console.log('currentHours: ' + currentHours + ' startHours ' + startHours + ' endHours ' + endHours)

          if (showAllEventsPP === true || 
            startHours < lookbackHours && endHours > lookbackHours || // current event
            startHours > lookbackHours && startTime.getDate() === currentDateAndTime.getDate() || // next event
            endHours > lookbackHours && startTime.getDate() !== currentDateAndTime.getDate() ) { // past event

            var isCurrentEvent = startHours < currentHours && endHours > currentHours;

            console.log('showing event...');

            var uuid = myEvent["uuid"];
            var description = myEvent["description"];
            var workItem = workitemsByUuid[uuid];

            if (isCurrentEvent) {
	          htmlOutput += "<div class='currentEvent'>";
            } else {
              htmlOutput += "<div>";
            }

              htmlOutput +="&nbsp;<a href='" + myEvent['editLink'] + "'> " + formatDateToClock(startTime) + " - " + formatDateToClock(endTime) +
              "</a> " + "</td>" + "<span>" + myEvent["title"] +"<span>";
    if (workItem) {
      var workItemEditLink = workItem['editLink'];
              htmlOutput += '&nbsp;<a target="_blank" href="' + workItem["externalLink"] + '"> ' + workItem["externalLinkAnchor"] + "</a> " + "</td>" ;
      htmlOutput += "<div>&nbsp;" + workItem['LOE'] + " of " + workItem['originalLOE'] + " hours left. " + " ";
  if (workItem['status'] === "N") {
  htmlOutput += '<button onClick="openEditWorkitem(\'' + workItemEditLink + '\', \'In Progress\')">mark in progress</button>';
  } else if (workItem['status'] === "In Progress"){
  htmlOutput += 'In Progress<button onClick="openEditWorkitem(\''+workItemEditLink + '\', \'N\')">stop progress</button>';
  }
  if (workItem['status'] === "Y") {
  htmlOutput += 'Done<button onClick="openEditWorkitem(\'' + workItemEditLink + '\', \'In Progress\')">mark as not done</button>';
  } else {
  htmlOutput += '<button onClick="openEditWorkitem(\'' + workItemEditLink + '\', \'Y\')">mark complete</button>';
  }
              htmlOutput += '<p onclick="expandParagraph(this)"> -- Notes: <button onClick="openEditWorkitem(\'' + workItemEditLink + '\', \'\')">edit</button> ' + workItem["comment"] + "</p>";
      htmlOutput += "</div>";
/*
status = workItem['status'];
loe = workItem['LOE'];
originalLOE = workItem['originalLOE'];
milestoneName = workItem['milestoneName'];
statusInProgress = "<btn>mark in progress</btn>";
statusComplete = "<btn>mark complete</btn>";*/
    }
eventCount = eventCount + 1;
    htmlOutput += "</div>";
    if (eventCount > 8 && showAllEventsPP === false) {
          break;
        }
      }
                
          /*rowCopy["name"] = data[row][nameColumnIndex];
          rowCopy["createdTime"] =  data[row][createdColumnIndex];
          rowCopy["editedTime"] =  data[row][timestampColumnIndex];
          rowCopy["editLink"] =  data[row][editColumnIndex];
          rowCopy["comment"] =  data[row][commentColumnIndex];
          rowCopy["status"] =  data[row][doneColumnIndex];
          rowCopy["LOE"] =  data[row][loeColumnIndex]; 
          rowCopy["originalLOE"] =  data[row][originalLoeColumnIndex]; 
          rowCopy["completionDate"] =  data[row][completionDateColumnIndex]; 
          rowCopy["milestoneName"] =  data[row][milestoneColumnIndex];
          rowCopy["nextScheduledTime"] =  data[row][nextScheduledEventColumnIndex];
          rowCopy["editEventLink"] =  data[row][nextScheduledEventLinkColumnIndex];
          rowCopy["uuid"] =  data[row][UuidColumnIndex];*/
        }
        var bottonPadding;
        for (bottonPadding = 0; bottonPadding < 10; bottonPadding++) {
          htmlOutput += "<br> -";
        }
        return htmlOutput;
      }

      function timeBlocksToHtml(events) {
        return ""; //JSON.stringify(events)
      }

      function onNextEventsSuccess(nextEventsArgs) {
        var uids = filterEventsToGuids(nextEventsArgs.events);
        console.log("nextEventArgs " + JSON.stringify(nextEventsArgs));
        console.log("uids to lookup are" + JSON.stringify(uids));
        google.script.run.withSuccessHandler(onWorkItemsSuccess)
          .getWorkitemsFromUuidsWrapper(uids, nextEventsArgs.events);
      }

      function onWorkItemsSuccess(workItemsArgs) {
        console.log("workItemsArgs " + JSON.stringify(workItemsArgs));
        var eventsDiv = document.getElementById("nextEvents");
        var eventsTable = document.getElementById("nextEventsTable");
        eventsDiv.innerHTML = workItemsToHtml(workItemsArgs.workitems, workItemsArgs.events);
      }

      function onTimeBlockSuccess(nextEventsArgs) {
        var blocksDiv = document.getElementById("eventBlocks");
        blocksDiv.innerHTML = timeBlocksToHtml(nextEventsArgs.events);
      }

      function onIntervalFire() {
        var currentPeriodDiv = document.getElementById("currentPeriod");
        var currentDateAndTime = new Date();
        currentPeriodDiv.innerHTML = "Current:  " + formatDateToClockPlusFullDate(currentDateAndTime) + "<br><br>";
      }

      var date = new Date();
      dateStartOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      var showAllEventsPP = false;

        google.script.run.withSuccessHandler(onNextEventsSuccess)
          .findEventsInCalendarForDay(dateStartOfDay  + '');
          
        google.script.run.withSuccessHandler(onTimeBlockSuccess)
          .findTimeblocksInCalendarForDay(dateStartOfDay  + '');

      onIntervalFire();
      setInterval(onIntervalFire, 10000);
