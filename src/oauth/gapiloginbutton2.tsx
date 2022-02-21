// SignIn.jsx
import React from 'react';
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

const GApiLoginButton2 = ({ children }) => {
  // The `GoogleAuth` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#authentication 
  const { googleAuth } = useGoogleAuth();
  // The `GoogleUser` object described here:
  // https://developers.google.com/identity/sign-in/web/reference#users
  const { currentUser } = useGoogleUser();

  if (googleAuth.isSignedIn) {
    return (
      <>
        <p>Welcome user {currentUser.getBasicProfile().getName()}</p>
        <button onClick={() => googleAuth.signOut()}>Sign Out</button>
      </>
    )
  }
  
  return (
    <>
      <p>Click here to sign in:</p>
      <button onClick={() => googleAuth.signIn()}>Sign In</button>
    </>
  )
};

export default GApiLoginButton2