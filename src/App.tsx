import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import {ErrorBoundary} from './ErrorBoundary';
//import logo from '../public/logo.png'; 
import {SendToDropbox} from "./oauth/dropboxauthrequest";
import GapiContextProvider from "./oauth/gapicontextprovider"
import GApiLoginButton from "./oauth/gapiloginbutton"
import TestStorageDemo from "./storage/testStorageDemo"
import Editor from "./uicomponents/editor"
import OrganizeList from "./uicomponents/organize_list"

class App extends React.Component {	

  handleClientLoad() {
	console.log("Loading gapi via script tag");
        // gapi.load('client:auth2', initClient);
  }


  render() {
    return (
      <div className="App">
      <header className="App-header">
    //    <img src='logo' className="App-logo" alt="logo" />
        <p>
          No! need to Edit <code>src/app.tsx</code> and tap.... on the play button.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
     <SendToDropbox/>
     <GapiContextProvider>
       <GApiLoginButton/>
       <OrganizeList/>
       <Editor/>
     </GapiContextProvider> 
    </div>
    )
  }
}

ReactDOM.render(<React.StrictMode><ErrorBoundary><h1>Hello</h1><App/></ErrorBoundary></React.StrictMode>, document.getElementById('root'));

export default App;
