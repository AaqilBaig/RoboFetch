/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import { PiToggleRightFill, PiToggleLeftFill } from "react-icons/pi";

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update the window width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <NavComponent>
      {windowWidth <= 700 && (
        <IconWrapper>
          <ImageButton className="image">
            <a href="/" style={{ cursor: "pointer" }}>
              RoboFetch
            </a>
          </ImageButton>
          <FaBars onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </IconWrapper>
      )}
      {isMenuOpen && windowWidth <= 700 && (
        <>
          <ul>
            <List>
              <a href="/"> Home</a>
            </List>
            <List>
              <a href="/">About</a>
            </List>
            <List>
              <a href="/"> Contact</a>
            </List>
            <List>
              <a href="/"> Login</a>
            </List>
          </ul>
        </>
      )}
      {windowWidth > 700 && (
        <>
          <ImageButton className="image">
            <a href="/" style={{ cursor: "pointer" }}>
              RoboFetch
            </a>
          </ImageButton>
          <ul>
            <List>
              <a href="/"> Home</a>
            </List>
            <List>
              <a href="/">About</a>
            </List>
            <List>
              <a href="/"> Contact</a>
            </List>
            <List>
              <a href="/"> Login</a>
            </List>
          </ul>
        </>
      )}
    </NavComponent>
  );
};

export default NavBar;

const NavComponent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: "Roboto", sans-serif;
  padding: 10px 0;
  width: 80%;
  margin: 10px;
  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    width: 40%;
    max-width: 1200px;
    padding: 0 20px;
    // margin: 10px;
    font-size: 1.1rem;
  }

  img {
    width: 5em;
    height: 5em;
    border-radius: 50%;
    padding: 10px;
  }

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ul {
      width: 100%;
      margin: 0;
      padding: 0;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
    img {
      width: 3em;
      height: 3em;
    }
  }
`;

const List = styled.li`
  cursor: pointer;
  margin: 10px;
  a {
    color: black;
    text-decoration: none;
  }
  @media (max-width: 700px) and (min-width: 280px) {

    a {
      font-size: 1rem;
      text-decoration: none;
      color: black;
    }
    
  }
}
`;

const IconWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  align-items: center;

  svg {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: black;
  }
`;

const ImageButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  a{
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;
