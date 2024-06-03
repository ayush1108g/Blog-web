"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import Alert from "@/components/Alert";

interface AlertContextType {
  showAlert: (type: string, message: string) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

interface AlertProviderProps {
  children: ReactNode;
}

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  // function to show alert
  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
  };

  // function to hide alert
  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && <Alert type={alert.type} message={alert.message} />}
    </AlertContext.Provider>
  );
};

const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export { AlertProvider, useAlert };
