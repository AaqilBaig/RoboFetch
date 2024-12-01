import { useContext, useEffect, useState } from "react";
import Med_item from "./Med_item";
import { database } from '../firebase-config';
import { ref, set, push } from "firebase/database";
import { AuthContext } from "../Contexts/AuthContext";
import { Button } from "@chakra-ui/react";

const Pharma = () => {

  const [meds, setMeds] = useState()

  

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

    const response = await fetch(`https://robofetch-server.onrender.com/api/medical/${item._id}`, {
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
    <div className="pharma-container">
      {meds && meds.length > 0 ? (
        meds.map((med) => (
          <Med_item key={med._id} medicine={med} />
        ))
      ) : (
        <div>
          <strong className="NA">Loading...</strong>
        </div>
      )}
    </div>
  );
  
};

export default Pharma;