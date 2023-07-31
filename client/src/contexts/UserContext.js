import {createContext, useContext, useEffect, useState} from 'react'
import cookies from 'js-cookies';



const UserContext = createContext()

function UserProvider({children}){

  const [loggedInUser, setLoggedInUser] = useState(null);

  // This gets checks if an user is logged in
  // TODO: learn to use global state
  useEffect(function () {
    async function checkUserExists() {
      // check for cookie with jwt
      if (!cookies.getItem('jwt')) return;

      // check jwt validity
      const res = await fetch(`http://localhost:8000/auth/checkUser`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.status === 'ok') setLoggedInUser(data.user);
    }
    checkUserExists();
  }, []);


if (loggedInUser) return <UserContext.Provider value={{loggedInUser, setLoggedInUser}}>
{children}
</UserContext.Provider>

}

function useLoggedInUser(){
  const context = useContext(UserContext)
  if(context === undefined) throw new Error('UserContext was used outside the UserProvider')
  return context;
}

export {UserProvider, useLoggedInUser}