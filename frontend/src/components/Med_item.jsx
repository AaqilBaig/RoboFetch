import PropTypes from 'prop-types';
import { useState,useEffect } from 'react';
import ESPHandler from './ESPHandler';
import Robot from '../assets/dolo_650.webp'
import { 
  WrapItem,
  Card,
  CardHeader,
  Divider,
  CardBody,
  Center,
  Image, 
  CardFooter, 
  ButtonGroup, 
  IconButton, 
  Button, 
  Flex,
  Badge,
  Heading 
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

const MedicineCard = ({ medicine }) => {

  const [count, setCount] = useState(0)

  const addToCart = () => {
    setCount(count+1)
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

  const removeFromCart = () => {
    count === 0 ? setCount(count) : setCount(count-1)
    const cartArr = JSON.parse(localStorage.getItem('cart')) || [];
    
    for (let index = 0; index < cartArr.length; index++) {
      if (cartArr[index].quantity === 1) {
        cartArr.splice(index,1)
        localStorage.setItem('cart', JSON.stringify(cartArr));
        return;
      }
      if (cartArr[index].rackNo === medicine.rackNo) {
        cartArr[index].quantity = (cartArr[index].quantity)-1;
        localStorage.setItem('cart', JSON.stringify(cartArr));
        return;
      }
    }
    cartArr.push(medicine);
    localStorage.setItem('cart', JSON.stringify(cartArr));
  }

  return (
    <WrapItem m='20px'>
      <Card borderTop='6px solid' borderColor='purple.400'>
          <CardHeader>
            <Flex justifyContent='space-between'>
            <Heading size='md'>{medicine.name}</Heading>
            <Badge colorScheme='purple' size='xs' borderRadius='md' p='5px'>Tablet</Badge>
            </Flex>
          </CardHeader>
          <Divider borderColor='gray' />
          <CardBody>
            <Center><Image src={Robot} boxSize='150px' alt="robot"/></Center>
          </CardBody>
          <CardFooter>
            <Center>
              <ButtonGroup size='md' isAttached variant='outline' w='200px' >
                <IconButton aria-label='Add to friends' icon={<MinusIcon />} onClick={removeFromCart} />
                {count>0 ? <Button w='200px' color='navy'>{count}</Button> : <Button>Add To Cart</Button>}
                <IconButton aria-label='Add to friends' icon={<AddIcon />} onClick={addToCart}/>
              </ButtonGroup>
            </Center>
          </CardFooter>
        </Card>
      </WrapItem>
  );
};

export default MedicineCard;
