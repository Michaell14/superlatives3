import React, {useEffect, useState} from 'react'
import { socket } from "../App";
import PieChart from "../ResponseChart";
import { Text, Center, Box, Grid  } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

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
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <Center>
                        <TabList mt={10}>
                            <Tab>Question 1</Tab>
                            <Tab>Question 2</Tab>
                            <Tab>Question 3</Tab>
                            <Tab>Question 4</Tab>
                            <Tab>Question 5</Tab>
                            <Tab>Question 6</Tab>
                            <Tab>Question 7</Tab>
                            <Tab>Question 8</Tab>
                            <Tab>Question 9</Tab>
                            <Tab>Question 10</Tab>
                        </TabList>
                    </Center>
                    
                    <TabPanels mt={20}>
                        
                        {result.map((item, index) => (
                            <TabPanel key={item}>
                                <Center>
                                    <Text>{item}</Text>
                                </Center>
                                
                                <Center>
                                    <PieChart list={votedPeople[index]} weight={votes[index]}/>
                                </Center>
                            </TabPanel>
                            
                        ))}
                    </TabPanels>
                </Tabs>

            </Box>
        </>
    
    )
}


export default Showcase;