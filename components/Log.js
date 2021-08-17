//import { useState, useRef, useEffect } from 'react';
//import { useRouter } from 'next/router';
import { VStack } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";
import { motion, AnimateSharedLayout } from "framer-motion"
//import TextTransition, { presets } from "react-text-transition";
//import Typewriter from 'typewriter-effect';
import Loading from './Loading';

export default function Log({data, fetching, reducer, endCallback}) {
    endCallback();
    return (
        <> {fetching ?
        <Loading />
        :
        <Zoom triggerOnce>
            <VStack overflowX='hidden' css={{
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            borderRadius: '20px',
                            border: '3px solid gray'
                        },
                    }} h="10em" w='50vw' m={2} py={4} px={10} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg">
                <AnimateSharedLayout>
                    <motion.ul layout>
                        {data.map(item => (
                            <motion.li key={item.dateCreated} layout>
                                {reducer(item)}
                            </motion.li>
                        ))}
                    </motion.ul>
                </AnimateSharedLayout>
            </VStack>
        </Zoom>
        } </>
    )
}
/*
                <MotionButton colorScheme='purple'>
                    bla
                </MotionButton>
*/