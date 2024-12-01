import { AtSignIcon, CalendarIcon, EditIcon } from "@chakra-ui/icons";
import { List,ListItem,ListIcon, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { database } from '../firebase-config';
import { ref, set, push } from "firebase/database";

const MenuBar = () => {

  const { user } = useContext(AuthContext)
  const toast = useToast()

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
          toast({
            title: 'Item Bought.',
            description: "Item added to Database",
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
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
        <List color="white" fontSize="1.2em" spacing={4} >
          <ListItem>
            <NavLink to="/cart">
              <ListIcon as={CalendarIcon} color="white" />
              Cart
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/">
              <ListIcon as={EditIcon} color="white" />
              Store
            </NavLink>
          </ListItem>
          <ListItem onClick={handleBuy}>
              <ListIcon as={AtSignIcon} color="white" />
                Buy Now
          </ListItem>
        </List>
    );
}
 
export default MenuBar;