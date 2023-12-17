/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
import styled from "styled-components";
import process from "process";
import NavBar from "./NavBar";
import Robot from "../assets/robot4.jpg";
import { useNavigate } from "react-router-dom";

// function Home(userDetails) {
function Home() {
  // const user = userDetails.user;
  const navigate = useNavigate();
  const gotoPharma = () => navigate("/pharmacy");
  return (
    <Container>
      <NavBar />
      <HomePage>
        <div className="content">
          <h2>Revolutionizing Retail: Where Automation Meets Innovation!</h2>
          <h4>
            At RoboFetch, we aim to redefine the way stores operate, leveraging
            advanced robotics and automation to create efficient, error-free,
            and customer-centric shopping environments.
          </h4>
          <button onClick={gotoPharma}>Explore now</button>
        </div>
        <div className="img">
          <img src={Robot} alt="" />
        </div>
      </HomePage>
    </Container>
  );
}

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  background-color: azure;

  h1 {
    margin: 15px;
  }
`;

const HomePage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 90%;
  min-height: 80vh;
  background: white;
  // width: 100%;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    width: 80%;
    h2 {
      margin: 10px;
      font-size: 2rem;
      font-weight: 600;
      text-align: left;
    }
    h4 {
      font-weight: 400;
      width: 100%;
      text-align: left;
      line-height: 2rem;
    }
    button {
      padding: 10px 20px;
      margin: 15px;
      border-radius: 5px;
      border: 1px solid black;
      background: white;
      cursor: pointer;
    }
  }
  .img {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;

    img {
      max-width: 100%;
      height: 100%;
      object-fit: ;

      aspect-ratio: 16/9;
      border-radius: 10px;
    }
  }
`;
