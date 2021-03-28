import Navbar from "./SiteNav.jsx";
import { createContext } from "react";
import { useSession } from "next-auth/client";

export const SessionContext = createContext(false);

export default function Layout(props) {

  const session = props.session ? props.session : useSession();
  const SessionCont = props.context ? <div/> : SessionContext
  return (
    <SessionCont.Provider value={session}>
      <Navbar />
      {props.children}
    </SessionCont.Provider>
  );
}
