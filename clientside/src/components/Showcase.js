import React, {useEffect, useState} from 'react'
import { socket } from "../App";
import PieChart from "../ResponseChart";
import { Text, Center, Box, Grid, Input, Icon  } from '@chakra-ui/react'


function Showcase() {
    const [result, setResult] = useState([]);
    const [votedPeople, setVotedPeople] = useState([]);
    const [votes, setVotes] = useState([]);

    useEffect(() => {
        socket.on("final-result", (data) => {
            const lst=[];
            for (let i=0; i<data.response.length; i++){
                const toAdd=[];
                for (let x=0; x<data.response[i].length; x++){
                    if (!lst.includes(data.response[i][x][1])){
                        toAdd.push(data.response[i][x][1]);
                    }
                }
                lst.push(toAdd);
            }

            for (let i=0; i<lst.length;i++){
                const s = new Set(lst[i]);
                const sArr = Array.from(s);
                sArr.sort();
                const votesArr = Array(sArr.length).fill(0);
                setVotedPeople(votedPeople => [...votedPeople, sArr]);                

                for (let x=0; x<lst[i].length; x++){

                    for (let j=0; j<sArr.length; j++){
                        if (sArr[j]==lst[i][x]){
                            votesArr[j]++;
                            break;
                        }
                    }
                }
                setVotes(votes => [...votes, votesArr])
            }

            setResult(data.question);
        })
    
      }, [socket])

    return (
        <>
            <Center mt={10}>
                <Text fontSize={"55px"}>Showcase</Text>
            </Center>
            <Box mx={"auto"}>
                <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                    {result.map((item, index) => (
                    <Box key={item} mt={20}>

                        <Center>
                            <Text>{item}</Text>
                        </Center>
                        
                        <Center>
                            <PieChart list={votedPeople[index]} weight={votes[index]}/>
                        </Center>
                    
                    </Box>
                ))}
                </Grid>

            </Box>
        </>
    
    )
}


export default Showcase;