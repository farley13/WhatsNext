import React, { Component } from "react";
import { AuthorizationCodeCallback } from "react-oauth2-auth-code-flow";
import ClientOAuth2 from "client-oauth2";

const apiRoot = "definitelyWontWork";

const oauthClient = new ClientOAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  accessTokenUri: `${apiRoot}/oauth/token/`,
  authorizationUri: "https://www.dropbox.com/oauth2/authorize",
  redirectUri: "https://www.yourapp.com/auth/dropbox",
  scopes: ["read"],
});

export default class ReceiveFromDropbox extends Component<any> {
  handleSuccess = async (accessToken:any, { response, state }:any) => {
    console.log("Successfully authorized");
    //await setProfileFromDropbox(accessToken);
    //await redirect(state.from);
  };

  handleError = (error:any) => {
    console.error("An error occurred");
    console.error(error.message);
  };

  render() {
    return (
      <AuthorizationCodeCallback
        oauthClient={oauthClient}
        onAuthSuccess={this.handleSuccess}
        onAuthError={this.handleError}
        render={({ processing, state, error }:any) => (
          <div>
            {processing && <p>Authorizing now...</p>}
            {error && (
              <p className="error">An error occurred: {error.message}</p>
            )}
          </div>
        )}
      />
    );
  }
}