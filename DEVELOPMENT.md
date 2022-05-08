# Whats Next Development Notes

## Works in Progress

### Storage
Work on storage is very early. In theory there should be 4 to start, a trivial hardcoded storage option, an in memory storage that disappears when non-running, a stub / mock storage for automated testing and a fully functional git storage using local disk space and a remote git repo.

### UI
Need to create basic new / edit UIs and a list UI for viewing and selecting workitems

### Add component tests
Using mocha, enzyme, chai and jest. For both UI and non-ui. Pretty much everything can be a component. Part of this
is going to be eventually break the code base up into components.

#### Next Items
[] Create New / Edit UI
[] Create List UI
[] Finish up and cleanup hardcoded storage
[] Add component tests
[] Break major parts up into packages
