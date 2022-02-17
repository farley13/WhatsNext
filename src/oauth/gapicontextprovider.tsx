import React from 'react';
import { GApiProvider } from 'react-gapi-auth2';

// Same config object passed to `gapi.auth2.init`
// https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
const clientConfig = {
  client_id: 'whatsnext.apps.googleusercontent.com',
  cookie_policy: 'single_host_origin', 
  scope: 'https://www.googleapis.com/auth/<POLICY>'
  // etc...
};

const GapiContextProvider = ({ children }) => (
<GApiProvider clientConfig={clientConfig}>
    {children}
  </GApiProvider>
);

export default GapiContextProvider;