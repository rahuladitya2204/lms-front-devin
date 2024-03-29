"use client";
import React from "react";
import { BrowserRouter } from "react-router-dom";

export interface RouterProviderProps {
  children: React.ReactNode;
}

const RouterProvider = ({ children }) => {
  return (
    // TODO: remove this BrowserRouter once all the Link/NavLink has been migrated to Next
    // currently having Link/Navlink from react-router-dom in SSR throws error
    <BrowserRouter>{children}</BrowserRouter>
  );
};

export default RouterProvider;
