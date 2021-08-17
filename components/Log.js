import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { HStack, VStack } from "@chakra-ui/react";
import { Zoom, JackInTheBox, Slide } from "react-awesome-reveal";
import { MotionGetAttention, MotionButton } from './MotionElements';
import TextTransition, { presets } from "react-text-transition";
//import Typewriter from 'typewriter-effect';

export default function Log({data, fetching, endCallback}) {

    return (
        <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
            <MotionButton colorScheme='purple'>
                bla
            </MotionButton>
        </VStack>
    )
}
