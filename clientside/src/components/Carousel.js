import React, {useState} from 'react';
import {
  Box,
  IconButton,
  useBreakpointValue,
  Center,
  Image,
  Text,
  Container,
  Badge 
} from '@chakra-ui/react';
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
// And react-slick as our Carousel Lib
import Slider from 'react-slick';

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 3500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function Carousel() {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = useState(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '5px' });

  // This list contains all the data for carousels
  // This can be static or loaded from a server
  const cards = [
    {
      title: '1',
      text:
        "Gather a group of friends (Recommended 3+)",
      image:
        'friends.svg',
    },
    {
      title: '2',
      text:
        "Vote for who is most likely to do the shown activity",
      image:
        'vote.svg',
    },
    {
      title: '3',
      text:
        "Do this for a total of 10 rounds",
      image:
        'repeat.svg',
    },
    {
        title: '4',
        text:
          "Wait for the results!",
        image:
          'results.svg',
      },
  ];

  return (
    <Box
      position={'relative'}
      height={'200px'}
      width={'full'}>
      {/* CSS files for react-slick */}
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}>
        <BiLeftArrowAlt size="30px" />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}>
        <BiRightArrowAlt size="30px" />
      </IconButton>
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
          <Box key={index} position="relative">
            {/* components */}
            <Container position="relative" centerContent mt={10}>
                <Image src={card.image} h={"150"} objectFit={"full"}/>
               
                <Text fontSize="lg" color="#392F5A" w={"340px"} mt={8} textAlign={"center"}>
                    <Badge fontSize={".8em"} mb={1} mr={1} bg={"#9DD9D2"}>{card.title}</Badge>{" "}{card.text}
                </Text>

                
            </Container>
            
          </Box>
        ))}
      </Slider>
    </Box>
  );
}