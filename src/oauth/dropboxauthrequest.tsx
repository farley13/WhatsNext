import React, { Component } from "react";
import {RequestAuthorizationCode} from "react-oauth2-auth-code-flow";
import ClientOAuth2 from "client-oauth2";

const apiRoot = "definitelyWontWork";

const oauthClient = new ClientOAuth2({
  clientId: "thing1", //process.env.CLIENT_ID,
  clientSecret: "thing2", //process.env.CLIENT_SECRET,
  accessTokenUri: `${apiRoot}/oauth/token/`,
  authorizationUri: "https://www.dropbox.com/oauth2/authorize",
  redirectUri: "https://www.yourapp.com/auth/dropbox",
  scopes: ["read"],
});
// todo - the same for https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow
class SendToDropbox extends Component<any> {
  render() {
    return (
      <RequestAuthorizationCode
        oauthClient={oauthClient}
        state={{ from: "/settings" }}
        render={({ url }:{url:string}) => <a href={url}>Connect to Dropbox</a>}
      />
    );
  }
}

export {SendToDropbox};
export default SendToDropbox;
