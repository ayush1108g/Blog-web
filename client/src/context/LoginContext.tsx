"use client";
import React, { createContext, useEffect, useState,ReactNode,useContext } from "react";
import {API } from '@/utils/api';

interface User {
    name: string;
    email: string;
    phone: number;
    password: string;
    photo: string;
}

interface LoginContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}
interface LoginProviderProps {
    children: ReactNode;
  }
const LoginContext = createContext<LoginContextType>({
  user: null,
  isLoggedIn: false,
  login: (data:User,remember:boolean) => {},
  logout: () => {},
});

const LoginContextProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const verifyUser = async () => {
        const user = localStorage.getItem("user");
        if(!user){
          return;
        }
        try {
          const parsedUser = JSON.parse(user);
          const resp = await API.get('/api/v1/auth/verify/'+parsedUser._id);
          if(resp.status === 200){
            setUser(parsedUser);
          }
          } catch (error) {
            console.log(error);
          }
    };
  verifyUser();
  }, []);

  // function to handle login
  const loginHandler = (userData: User,remember:boolean) => {
    if(remember){
        localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
    setIsLoggedIn(true);
  };

  // function to handle logout
  const logoutHandler = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // check if user is logged in
  useEffect(() => {
    if(!user) return;
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  const contextValue: LoginContextType = {
    user,
    isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};

const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};


export { LoginContextProvider, useLogin};
