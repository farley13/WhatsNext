function findEventsInCalendarForDayAndCalendar(day, daysOut, calendarName) {
    var startDate = new Date(day);
  startDate.setTime(startDate.getTime() - 1000*60*60*(startDate.getHours()));
  var endDate = new Date(day);
  endDate.setTime(startDate.getTime() + 1000*60*60*24* daysOut);
  var calendars = CalendarApp.getAllCalendars();
  for (i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
    var name = calendar.getName();
    var id = calendar.getId();
    var title = calendar.getTitle();
  }
  var events = CalendarApp.getCalendarsByName(calendarName)[0].getEvents(startDate, endDate);
  var eventsWrapped = [];
  if (events.length > 0) {
    for (var event = 0; event < events.length; event++ ) {
        eventsWrapped.push( wrapEvent(events[event]) );
    }
  }
  return { events: eventsWrapped, startDate: day, daysOut: daysOut, calendarName: calendarName };
}

function findEventsInCalendarForDay(day) {
  var homeEvents = findEventsInCalendarForDayAndCalendar(day, 1, 'Adam Farley');
  var workEvents = findEventsInCalendarForDayAndCalendar(day, 1, 'Calendar');
  for (var i = 0; i < workEvents.events.length; i++) {
    homeEvents.events.push(workEvents.events[i]);
  }
  var eventsDeduped = {}
  for (var i = 0; i < homeEvents.events.length; i++) {
    var cleanedEventName = homeEvents.events[i].title.replace(/^[Updated ]*[Ii]nvitation: /, "");
    cleanedEventName = cleanedEventName.replace(/@ .*/,'');

    homeEvents.events[i].title = cleanedEventName;
    eventKey = cleanedEventName.trim() + "-" + homeEvents.events[i].startTime;
    if (eventsDeduped[eventKey]) {
      if (homeEvents.events[i].uuid) {
        eventsDeduped[eventKey] = homeEvents.events[i];
      }
    } else {
        eventsDeduped[eventKey] = homeEvents.events[i];
    }
  }
  var dedupedEvents = [];
  var count = 0;
  for ([eventKey, event] of Object.entries(eventsDeduped)) {
    dedupedEvents.push(event);
    count += 1;
  }
  homeEvents.events = dedupedEvents;
  homeEvents.events.sort(function(a, b){return new Date(a.startTime).valueOf() - new Date(b.startTime).valueOf()});
  return homeEvents;
}

function findTimeblocksInCalendarForDay(day) {
  return findEventsInCalendarForDayAndCalendar(day, 1, 'Daily Schedule');
}

function testFindTimeblocksInCalendarForDay() {
  findTimeblocksInCalendarForDay('09 19 2020 00:00:00 GMT-0400');
}

