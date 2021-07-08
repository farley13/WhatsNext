
function getWorkitemsFromUuidsWrapper(guids, events) {
    var workitemsByUuid = getWorkitemsFromUuids(guids);
  return {"events": events, "workitems": workitemsByUuid };
}
