//import { useState, useRef, useEffect } from 'react';
//import { useRouter } from 'next/router';
import { VStack } from "@chakra-ui/react";
//import { Zoom, JackInTheBox, Slide } from "react-awesome-reveal";
import { MotionButton } from './MotionElements';
//import TextTransition, { presets } from "react-text-transition";
//import Typewriter from 'typewriter-effect';
// {data, fetching, endCallback}
export default function Log() {
    return (
        <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
            <MotionButton colorScheme='purple'>
                bla
            </MotionButton>
        </VStack>
    )
}
