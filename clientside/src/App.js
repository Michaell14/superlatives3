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
import { ListItem, OrderedList } from '@chakra-ui/react'
import Carousel from "./components/Carousel";
let name="";

//Creating random room code
const keys="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let roomC="";
for (let i=0; i<6; i++){
  roomC += keys[Math.floor(Math.random() * (keys.length-1) )];
}

//production
var socket = io.connect("https://superlatives1.herokuapp.com/");

//testing
//var socket = io.connect("http://localhost:3001");

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
                <Center mt={"10vh"}>
                    <VStack className="title">
                        <Text fontWeight={600} fontSize={65} color={"#392F5A"}>Superlatives</Text>
                        <Text fontSize={"27px"} color={"#392F5A"} pt={"5vh"} className="fancy">Enter a nickname: </Text>
                    </VStack>
                </Center>
                
                <Center>
                    <HStack mt={2}>
                        <Input borderColor={"#392F5A"} variant={"filled"} w={"340px"} bg={"#FFF8F0"} value={showName} placeholder="nickname..." onChange={(e) => {setName(e.target.value)}}/>
                        <Button onClick={toLobby} rightIcon={<ArrowForwardIcon />} bg="#392F5A" color={"#FFF8F0"} _hover={{bg:"rgba(57, 47, 90, .68)"}}>Continue</Button>
                    </HStack>
                </Center>
                

                <Box mt={"13vh"}>
                    <Center>
                        <Text fontSize={"2xl"} color={"#392F5A"}>How to play!</Text>
                    </Center>  
                    <Carousel/>
                </Box>
                

                <Box position="fixed" bottom={10} right={10} w={"550px"} className="footer">
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
