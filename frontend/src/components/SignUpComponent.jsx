/* eslint-disable no-unused-vars */
import React, { useEffect,useState } from "react";
import google from '../assets/google-icon.png';
import { Box, Button, Center, Divider, Image, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";

function SignUpComponent() {

  // useEffect(() => {
  //   const getUser = async () => {
  //     const response = await fetch('http://localhost:3000/auth/login/success');

  //     if(!response.ok) {
  //       throw new Error('Network not responding');
  //     }

  //     const json = await response.json();
  //     console.log(json)
  //   }
  //   getUser();
  // },[])

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  const handleChange = (event) => {
    setName(event.target.value)
    setPassword(event.target.value)
  }

  return (
    <Center h='78vh'>
      <Box p='50px' border='1px solid black' borderRadius='20px'>
        <Text mb='8px'>Name: {name}</Text>
        <InputGroup size='md' mb='40px'>
          <Input
            pr='4.5rem'
            type='text'
            placeholder='Enter password'
          />
        </InputGroup>
        <Text mb='8px'>Password: {password}</Text>
        <InputGroup size='md' mb='40px'>
          <Input
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Enter password'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick} bg='purple.400' color='white'>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Center p='10px'>
          <strong>
            OR
          </strong>
        </Center>
        <Divider/>
        <Center p='10px'>
          Sign In With Google
        </Center>
        <Center mt='20px'>
          <a className="google-btn" href="/auth/google">
            <Image src={google} boxSize='44px' border='1px solid gray' borderRadius='5px' p='5px'/>
          </a>
        </Center>
      </Box>
    </Center>
  );
}

export default SignUpComponent;