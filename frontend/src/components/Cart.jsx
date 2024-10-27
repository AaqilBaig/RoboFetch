import { Container,Card,Image,Stack,Text,CardBody,Heading, CardFooter, Button, Box, Wrap, WrapItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MedicineCard from "./Med_item";


const Cart = () => {

    const [cartItems, setCartItems] = useState()

    useEffect(() => {
    const fetchCartMeds = () => {
            setCartItems(JSON.parse(localStorage.getItem('cart')))
            console.log(cartItems)
        }
        fetchCartMeds();
    },[])

    return ( 
        <Wrap h='100vh'>
            {cartItems && cartItems.length>0 ? (
                cartItems.map((item) => {
                    <MedicineCard key={item._id} medicine={item}/>
                })
            ) : (
                <strong>
                    No Medicines in cart.
                </strong>
            )}
        </Wrap>
    );
}
 
export default Cart;