/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import { Button, Flex, Divider, HStack, Heading, Link, Tag, Avatar, TagLabel } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { AuthContext } from "../Contexts/AuthContext";



const NavBar = () => {
  const { user,dispatch } = useContext(AuthContext)

  const logout = async () => {
    try {
      await axios.get('https://robofetch-server.onrender.com/auth/logout', { withCredentials: true });
      console.log("logged out");
      dispatch({type: 'LOGOUT', payload: null})
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  return (
    <Flex justifyContent='space-between' p='15px' >
            <Heading 
                size='lg' 
                // bgGradient="linear(to-r, purple.400, blue.300)" 
                // bgClip="text"
                color='blackAlpha.700'
                fontSize="4xl"
                fontWeight="bold" 
            >
                RoboFetch
            </Heading>
            <HStack gap='20px'>
                {user ? (
                <HStack>
                    
                    <Tag size='lg' colorScheme='purple' borderRadius='full' p='10px' mr='20px'>
                        <Avatar
                            src={user.picture}
                            size='xs'
                            name='Segun'
                            ml={-1}
                            mr={2}
                        />
                        <TagLabel>{user.username}</TagLabel>
                    </Tag>
                    <Button
                        as={ReactRouterLink}
                        to='/signup'
                        colorScheme='blackAlpha' 
                        variant='solid'
                        bg='blackAlpha.800'
                        onClick={logout}
                    >
                        Log out
                    </Button>
                </HStack>): (
                <>
                    <Button
                        as={ReactRouterLink}
                        to='/signup'
                        colorScheme='blackAlpha' 
                        variant='ghost' 
                        fontWeight='bold' 
                        _hover={{bg: 'lightgrey'}} 
                        color='black'
                    >
                        Log In
                    </Button>
                    <Button
                        as={ReactRouterLink}
                        to='/signup'
                        colorScheme='blackAlpha' 
                        variant='solid'
                        bg='blackAlpha.800'
                    >
                        Sign Up
                    </Button>
                </>)}
            </HStack>
        </Flex>
  );
};

export default NavBar;