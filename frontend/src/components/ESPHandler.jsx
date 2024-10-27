/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthContext';
// import { database } from '../firebase-config';
// import { ref, set, get, update } from "firebase/database";

function ESPHandler({ medicine }) {

  const { user } = useContext(AuthContext)

  const addToCart = () => {
    const cartArr = JSON.parse(localStorage.getItem('cart')) || [];
    
    for (let index = 0; index < cartArr.length; index++) {
      if (cartArr[index].rackNo === medicine.rackNo) {
        cartArr[index].quantity = (cartArr[index].quantity)+1
        localStorage.setItem('cart', JSON.stringify(cartArr));
        return;
      }
    }
    cartArr.push(medicine);
    localStorage.setItem('cart', JSON.stringify(cartArr));
  }

  return (
    <button className="toggle-btn" onClick={addToCart}>
      Add to Cart
    </button>
  );
}

export default ESPHandler;

