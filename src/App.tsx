import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import {ErrorBoundary} from './ErrorBoundary';
//import logo from '../public/logo.png'; 
import {SendToDropbox} from "./oauth/dropboxauthrequest";
import GapiContextProvider from "./oauth/gapicontextprovider"
import GapiLoginButton2 from "./oauth/gapiloginbutton2"

class App extends React.Component {	
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
   <GapiLoginButton2>Login to Google</GapiLoginButton2>
     </GapiContextProvider> 
    </div>
    )
  }
}

ReactDOM.render(<ErrorBoundary><h1>Hello</h1><App/></ErrorBoundary>, document.getElementById('root'));

export default App;
