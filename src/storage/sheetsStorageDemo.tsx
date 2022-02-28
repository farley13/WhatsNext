// SignIn.jsx
import React from 'react';
// This library is terrible.... stop using it
// maybe try https://github.com/partnerhero/gapi-script ?
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

import listMajors from "./sheetsStorage"


const SheetsStorageDemo = ({ children }) => {
  // The `GoogleAuth` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#authentication 
  const { googleAuth } = useGoogleAuth();
  // The `GoogleUser` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#users
  // const { currentUser } = useGoogleUser();

  if (!!googleAuth && googleAuth.isSignedIn) {
    return (
      <>
        <p>You seem to be signed in</p>
        <button onClick={() => googleAuth.signOut()}>Sign Out</button>
	<div>{listMajors()}</div>
      </>
    )
  }
  if (!!googleAuth) {
  return (
    <>
      <p>Click here to sign in:</p>
      <button onClick={() => googleAuth.signIn()}>Sign In</button>
    </>
  )
}
  return (
    <>
      <p>We failed to load google OAUTH2. Please try later.</p>
    </>
  )
};

export default SheetsStorageDemo
     
    