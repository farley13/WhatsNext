// SignIn.jsx
import React from 'react';
// This library is terrible.... stop using it
// maybe try https://github.com/partnerhero/gapi-script ?
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

const GApiLoginButton2 = ({ children }) => {
  // The `GoogleAuth` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#authentication 
  const { googleAuth } = useGoogleAuth();
  // The `GoogleUser` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#users
  const { currentUser } = useGoogleUser();

  if (!!googleAuth && googleAuth.isSignedIn) {
    return (
      <>
        <p>Welcome user {currentUser.getBasicProfile().getName()}</p>
        <button onClick={() => googleAuth.signOut()}>Sign Out</button>
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

export default GApiLoginButton2