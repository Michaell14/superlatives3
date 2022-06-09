/*
SUPERLATIVES
Michael Li
A word game where you and a group of friends are given a series of superlatives and you vote for who it is
*/

import './App.css';
import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import { Text, Button, Box, Flex, Input, HStack, VStack, Center } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import io from "socket.io-client";

import {
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react'

let name="";

//Creating random room code
const keys="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let roomC="";
for (let i=0; i<6; i++){
  roomC += keys[Math.floor(Math.random() * (keys.length-1) )];
}

var socket = io.connect("http://localhost:3001");

//https://superlatives1.herokuapp.com/
function App() {
    const navigate = useNavigate();
    const [showName, setName] = useState("");

    const toLobby = () => {
        name=showName;
        socket.emit("new-user", {name, roomC});
        navigate("/lobby");
    }
  
    useEffect(() => {

      //When the socket connects
      socket.on("connect", function(){
          socket.emit("join-room", roomC);
      })

  }, [socket])

    return (
        <>
            <Box w={"550px"} mx={"auto"}>
                <Center mt={40}>
                    <VStack className="title">
                        <Text fontWeight={600} fontSize={65}>Superlatives</Text>
                        <Text fontSize={"27px"}>Enter your name: </Text>
                    </VStack>
                </Center>
                
                <HStack mt={1}>
                    <Input value={showName} placeholder="nickname..." onChange={(e) => {setName(e.target.value)}}/>
                    <Button onClick={toLobby} rightIcon={<ArrowForwardIcon />} borderColor="#88498F" color='#88498F' variant='outline'>Continue</Button>
                </HStack>

                
                <Box borderColor={"black"} borderRadius={5} borderWidth={2} padding={5} mt={20}>
                    <Text fontSize={"xl"}>How to play</Text>
                    <OrderedList>
                        <ListItem fontWeight={500}>Gather a group of friends (best to have at least 4)</ListItem>
                        <ListItem fontWeight={500}>Vote for who is most likely to do the shown activity</ListItem>
                        <ListItem fontWeight={500}>Do this for a total of 10 rounds</ListItem>
                        <ListItem fontWeight={500}>Wait for the results!</ListItem>
                    </OrderedList>
                </Box>
                <Box position="fixed" bottom={5} float={"right"} w={"550px"} className="footer">
                    <Text fontSize="sm" fontWeight={550} mb={"5px"}>About</Text>
                    <Text fontSize="xs">Made by <a href="https://www.itsmichael.dev/" target="_blank" rel="noreferrer"><u>Michael Li</u></a></Text>
                    <Flex justify={"flex-end"}>
                        <Text fontSize="xs">Built with&#160;</Text><Text fontSize="xs" color="#779FA1">React</Text>
                    </Flex>
             
                    
                </Box>
            </Box>
        </>
    );
}
export { socket, name, roomC };

export default App;
