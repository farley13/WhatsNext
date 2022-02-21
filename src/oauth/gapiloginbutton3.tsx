import React from 'react';

class GApiLoginButton3 extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
       isSignedIn: false
    }
  }

  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        client_id: '739562176687-ulfvc1apkjj9i0hs9i0qoirf9f0pkqnv.apps.googleusercontent.com',
	cookie_policy: 'single_host_origin', 
	scope: 'https://www.googleapis.com/auth/spreadsheets',
      })
      .then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
      });
    });
  }

  renderAuthButton() {
    if (this.state.isSignedIn === null) {
      return <div>I dont know if I am signed in</div>;
    } else if (this.state.isSignedIn) {
      return <div>I am signed in!</div>;
    } else {
      return <div>I am not signed in</div>;
    }
  }

  render() {
    return <>      
    	   <script src="https://apis.google.com/js/api.js"/> 
	   <div>{this.renderAuthButton()}</div>
           </>
  }
}

export default GApiLoginButton3;