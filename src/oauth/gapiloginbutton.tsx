import React from 'react';
import { SignInButton } from 'react-gapi-auth2';

type Theme = "dark" | "light" | undefined;
const darkTheme: Theme = "dark";
// The same options object in the signature of `gapi.signin2.render`
// https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid_options
const options = {
  id: "react-gapi-auth2-sign-in-button",
  width: 200,
  height: 50,
  theme: darkTheme,
  onsuccess: () => console.log('Successfully logged in'),
  onfailure: () => console.error('Error logging in'),
};

const GapiLoginButton = () => (
  <SignInButton options={options} />
);

export default GapiLoginButton;