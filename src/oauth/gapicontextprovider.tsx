import React, { useEffect } from 'react';
import { GApiProvider } from 'react-gapi-auth2';

// maybe use https://www.npmjs.com/package/gapi-script ?
// Same config object passed to `gapi.auth2.init`
// https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams
const clientConfig = {
  client_id: '739562176687-ulfvc1apkjj9i0hs9i0qoirf9f0pkqnv.apps.googleusercontent.com',
  cookie_policy: 'single_host_origin', 
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4",
		  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
		  "https://www.googleapis.com/discovery/v1/apis/people/v1/rest"]

  // etc...
};

const GapiContextProvider = ({ children }: { children: any }) => {
 
  useEffect(() => {
    console.log('loaded init via GAPI Context Provider');
  }, [])

  return (<GApiProvider clientConfig={clientConfig}>
    {children}
  </GApiProvider>
);
}

export default GapiContextProvider;