/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dotenv from "dotenv";
import styled from "styled-components";
import process from "process";
import NavBar from "./NavBar";
import Robot from "../assets/robot4.jpg";
import '../index.css';
import ESPHandler from "./ESPHandler";
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { AbsoluteCenter, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Container, Divider, Heading, IconButton, Image, Wrap, WrapItem } from "@chakra-ui/react";
import MedicineCard from "./Med_item";

// function Home(userDetails) {
function Home() {

  const [meds, setMeds] = useState(null)

  useEffect(() => {
    const fetchMedicines = async () => {
      const response = await fetch('http://localhost:3000/api/medical');

      if (!response.ok) {
        throw new Error("Network Error: Med");
      }

      const json = await response.json();
      setMeds(json);
    }
    fetchMedicines();
  },[])

  const handleBuy = () => {
    const itemArr = JSON.parse(localStorage.getItem('cart'))
    if (itemArr == null) {
      alert("No items added to cart")
    }
    else {
      let rackArr = ""
      let quanArr = ""
      itemArr.forEach((item) => {
        rackArr = rackArr + item.rackNo + ","
        quanArr = quanArr + item.quantity + ","
        const url = `${user.googleId}`
        const cartRef = ref(database, url);
        // const itemRef = push(cartRef)
        // console.log(itemRef)
        set(cartRef, {
          rackNo: rackArr, // Use your appropriate fields
          quantity: quanArr
        })
        .then(() => {
          console.log("Item added to Firebase successfully.");
        })
        .catch((error) => {
          console.error("Error adding item to Firebase: ", error);
        });
        
        // deduct quantity from mongoDB
        deductQuantity(item);
      });
    }
  }

  const deductQuantity = async (item) => {
    
    item.stock = item.stock - item.quantity

    const response = await fetch(`http://localhost:3000/api/medical/${item._id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json' 
      }
    })

    if (!response.ok) {
      throw new Error("response false")
    }
  }

  return (
    <Container maxW='6xl'>
      <Wrap>
        {meds && meds.length > 0 ? (
        meds.map((med) => (
          <MedicineCard key={med._id} medicine={med}/>    
        ))
      ) : (
        <div>
          <strong className="NA">Loading...</strong>
        </div>
      )}
          
        
      </Wrap>
      
    </Container>
  );
}

export default Home;