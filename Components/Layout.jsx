import Navbar from "./SiteNav.jsx";
import { createContext } from "react";
import { useSession } from "next-auth/client";
import {SessionContext} from '../contexts/contexts.js'

export default function Layout(props) {

  const session = props.session ? props.session : useSession();
  return (
    <SessionContext.Provider value={session}>
      <Navbar />
      {props.children}
    </SessionContext.Provider>
  );
}
