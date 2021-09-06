//import { useState, useRef, useEffect } from 'react';
//import { useRouter } from 'next/router';
import { VStack } from "@chakra-ui/react";
import { Zoom } from "react-awesome-reveal";
import { motion, AnimateSharedLayout } from "framer-motion";
import { HoverableBox } from '../components/MotionElements';
//import TextTransition, { presets } from "react-text-transition";
//import Typewriter from 'typewriter-effect';
import Loading from './Loading';

export default function Log({data, fetching, reducer, endCallback, ...props}) {
    endCallback(); // REMOVE ThIS

    return (
        <> {fetching ?
        <Loading />
        :
        <Zoom triggerOnce>
            <HoverableBox>
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
                        }} m={2} py={4} px={10} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg" {...props} >
                    <AnimateSharedLayout>
                        <motion.ul layout>
                            {data ? data.map(item => (
                                item.dateCreated &&
                                <motion.li key={item.dateCreated} layout>
                                    {reducer(item)}
                                </motion.li>
                                
                            ))
                            :
                                <motion.li key={0} layout>
                                    Wow, such empty
                                </motion.li>
                            }
                        </motion.ul>
                    </AnimateSharedLayout>
                </VStack>
            </HoverableBox>
        </Zoom>
        } </>
    )
}
/*
                <MotionButton colorScheme='purple'>
                    bla
                </MotionButton>
*/