import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { signIn, signOut, useSession } from 'next-auth/client'

const SiteNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ session, loading ] = useSession()
  if(session){console.log(session)}
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">campaignMaps</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="/api/auth/signin/">signin</NavLink>  
            </NavItem>
            
            
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default SiteNav;