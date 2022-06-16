import React, { useEffect, useState } from 'react'
import { Text, Button, Box, Flex, Input, Icon, HStack, Center, InputGroup, InputLeftElement, Tooltip } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import { BiLink } from "react-icons/bi";
import { socket, name, roomC } from "../App";
import { question } from './Questions';

const roomPlayersConst=[];
var roomCode=roomC;
let startQuestion="";
let gameStarted=false;

function Lobby() {
    
    const navigate = useNavigate();
    const [roomPlayers, setRoomPlayers] = useState([name]);
    const [room, setRoom] = useState(roomC);
    const [copyMessage, setCopyMessage] = useState("Copy to Clipboard");
    const [startDisabled, setStartDisabled] = useState(false);

    //Allows a user to join a room
    const joinRoom = () => {
        const newRoom=$("#room").val();
        setRoom(newRoom);
        socket.emit("join-room", {name, newRoom, roomCode});
        roomCode=newRoom;
        setStartDisabled(true);
        
    }

    //Start the game for all players
    const startGame = () => {
        const toSend = [...new Set(roomPlayers)];
        socket.emit("start-game", {room, toSend, question});
        gameStarted=true;
    }

    //Copies the room code onto clipboard
    const copyToClipboard = () => {
        var copyTextarea = document.querySelector('.roomInfo');
        copyTextarea.focus();
        copyTextarea.select();
        document.execCommand('copy');

        try {
            var successful = document.execCommand('copy');
            if (successful){
                setCopyMessage("Copied to Clipboard✅")
            }else{
                setCopyMessage("Unable to copy")
            }

        } catch (err) {
            console.log('Oops, unable to copy');
        }
        
    }

    useEffect(() => {
        //When user joins room
        socket.on("user_joined_room", (newName) => {
            setRoomPlayers(roomPlayers => [...roomPlayers, newName] ); 
            roomPlayersConst.push(newName);
            roomPlayersConst.push(name);

            socket.emit("other-players-in-room", {room, roomPlayersConst});
        })


        socket.on("update-players", (newPlayers) => {
            for (let i=0; i<newPlayers.length; i++){
                setRoomPlayers(roomPlayers => [...roomPlayers, newPlayers[i]]);
            }
        })

        socket.on("redirect-page", (data) => {
            for (let i=0; i<data[0].length; i++){
              roomPlayersConst.push(data[0][i]);
            }
            startQuestion = data[1];
            navigate('/game');
            gameStarted=true;
        })

        socket.on("player-disconnect", (deleteSocketId) => {
            setRoomPlayers(roomPlayers.filter(item => item !== deleteSocketId))
        })

        socket.on("failed-room-join", () => {
            alert("Room game has already started or room does not exist");
        })

    }, [socket])


    return (
        <>

            <Center mt={10}>
                <Box>
                    <Text fontSize={"lg"}>This Room Code:</Text>
                        <InputGroup w={"130px"} borderWidth={3} borderRadius={10} _hover={{borderColor:"#A3C4BC", borderWidth:3, borderRadius:10}}>
                            <InputLeftElement
                                pt={"3.5px"}
                                onClick={copyToClipboard}
                                children={<Tooltip label={copyMessage} closeOnClick={false}>
                                <span>
                                    <Icon as={BiLink}/>
                                </span>
                            </Tooltip>}
                            _hover={{cursor: "pointer"}}
                            />

                        <Input value={room} className="roomInfo" isReadOnly={true} focusBorderColor={"white"} placeholder='Room Code' variant={"filled"}/>
                    </InputGroup>
                </Box>
            </Center>

            <Box pos={"absolute"} top={0} right={10}>
                <Text fontSize={"xl"}>Join New Room</Text>
                <HStack>
                    <Input id="room" placeholder="room..." w={"130px"}/>
                    <Button onClick={joinRoom} bg={"#88498F"} color={"white"}>Join</Button>
                </HStack>
            </Box>
                
            <Box w={"300px"} mx={"auto"} mt={20}>
                <Center>
                    <Text fontSize={"lg"}>Players in room: </Text>
                </Center>
      
                {[...new Set(roomPlayers)].map(item => (
                <Box key={item} borderRadius={5} borderColor={"black"} borderWidth={2} padding={3} mt={2}>


                    <Text textAlign={"center"} fontSize={"lg"}>{item}</Text>
                    
                </Box>
                ))}

                <Center mt={20}>
                    <Button onClick={startGame} bg={"#BFD7B5"} borderColor={"#BFD7B5"} isDisabled={startDisabled}>Start Game</Button>
                </Center>
            </Box>
        </>
    )
}

export { roomPlayersConst, roomCode, startQuestion };

export default Lobby;