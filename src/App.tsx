import React from 'react';
import ReactDOM from 'react-dom';
import './app.css';
import logo from '../public/logo.png'; 

class App extends React.Component {	
  render() {
    interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}
    
    const user:User = {
  firstName: "Angela",
  lastName: "Davis",
  role: "Professor",
}
 
console.log(user.name)
    let b:Intbb = "thing"
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          No! need to Edit <code>src/app.jsx</code> and tap.... on the play button.
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
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
