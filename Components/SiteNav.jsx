import React, { useContext, useState } from "react";
import  NextLink from "next/link";

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
  NavbarText,
} from "reactstrap";
import { SessionContext } from "./Layout.jsx";
//this is used to avoid a bug with Next/Link. Delete and use default when issue
export function LinkWrap({ children, refAs, ...props }, ref) {
  if (refAs) {
    props[refAs] = ref;
  }
  return (
    <>
      {React.isValidElement(children)
        ? React.cloneElement(children, props)
        : 'invalid'}
    </>
  );
}

const LinkWrapper = React.forwardRef(LinkWrap);

function Link({ refAs, children, ...props }) {
  return (
    <NextLink {...props}>
      <LinkWrapper refAs={refAs}>{children}</LinkWrapper>
    </NextLink>
  );
}

const SiteNav = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const session = props.session ? props.session : useContext(SessionContext);
  var userIcon =  session ? session.user.image ? <img src={session.user.image} height="32px" /> : <h4>{session.user.name}</h4> : (<Link href="/api/auth/signin/">
  <NavLink href="/api/auth/signin/">login</NavLink>
</Link>)
  if (session) {
    if (session.user.image) {
      userIcon = <img src={session.user.image} height="32px" alt='user image'/>;
    } else {
      userIcon = <h4>{session.user.name}</h4>;
    }
  }

  return (
    <div>
      <Navbar color="white" light expand="md" id='main_nav'>
        <Link href="/">
          <NavbarBrand href="/">campaignMaps</NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            
            <NavItem>
              <Link href="/api/auth/signout/">
                <NavLink href="/api/auth/signout/">signout</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/map/">
                <NavLink href="/map/">map</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>

        {userIcon}
      </Navbar>
    </div>
  );
};

export default SiteNav;
