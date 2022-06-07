import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import $ from "jquery";
import { socket, name } from "../App";
import { roomPlayersConst, roomCode, startQuestion } from "./Lobby";
import { Text, Button, Box, Grid, Center } from '@chakra-ui/react'

function Game() {
  const navigate = useNavigate();
  const [roomPlayers, setRoomPlayers] = useState(roomPlayersConst);
  const [question, setQuestion] = useState(startQuestion);
  const [count, setCount] = useState(1);
  const [disabled, setDisabled] = useState(false);

  const uniquePlayers = [...new Set(roomPlayersConst)];

  const changeQuestion = () => {
    socket.emit("set-question", {roomCode, count});
  }

  useEffect(() => {
    changeQuestion();
  }, [])

  const votePlayer =(toVotePlayerSid) => { 
    const size=[...new Set(roomPlayers)].length;
    socket.emit("vote-player", {name, toVotePlayerSid, roomCode, size, count, question});

    setDisabled(true);
  }


    useEffect(() => {
      socket.on("change-question", question => {

        if (count>=10){
          socket.emit("to-showcase", roomCode);
        }

        setQuestion(question);
        setCount(count+1);
        setDisabled(false);
      })
  
      socket.on("to-showcase", () => {
        navigate("/showcase");
      })

    }, [socket, count])

  return (
    <>
      <Center mt={10}>
        <Text fontSize={"3xl"}>Q{count}. {question}</Text>
      </Center>

      <Box w={"700px"} mx={"auto"} mt={20}>
        <Grid templateColumns='repeat(4, 1fr)' gap={6}>

        {[...new Set(roomPlayersConst)].map(item => (
          <Button key={item} id={item} colorScheme={"purple"} onClick={function(){votePlayer(item)}} isDisabled={disabled}>{item}</Button>
        ))}

        </Grid>
      </Box>
    </>
  )
}

export default Game;