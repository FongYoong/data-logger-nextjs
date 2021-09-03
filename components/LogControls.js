import { getUserProfile, updateConfig } from '../lib/db';
import { VStack, Switch, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { JackInTheBox } from "react-awesome-reveal";
import { HoverableBox } from '../components/MotionElements';
//import TextTransition, { presets } from "react-text-transition";
import Loading from './Loading';

export default function LogControls({auth, fetching, initialConfig, ...props}) {
    const toast = useToast();
    const currentState = fetching ? false : (initialConfig.enableLogging === "true" || initialConfig.enableLogging === true);
    return (
        <> {fetching ?
        <Loading />
        :
        <JackInTheBox triggerOnce >
            <HoverableBox>
                <VStack m={2} p={4} spacing="4" borderWidth={2} borderRadius="lg" boxShadow="lg" {...props}>
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-alerts" mb="0">
                            Log Data
                        </FormLabel>
                        <Switch isChecked={currentState} colorScheme="teal" size="lg" onChange={() => {
                            getUserProfile(false, auth.uid, (result) => {
                                updateConfig(auth.uid, result.username, {enableLogging: !currentState}, () => {
                                    console.log(`Successfully ${currentState?'disabled':'enabled'} logging`);
                                    toast({
                                        title: `Successfully ${currentState?'disabled':'enabled'} logging`,
                                        description: "Cheers! 😃",
                                        status: "success",
                                        duration: 2000,
                                        isClosable: true,
                                    });
                                }, ()=> {
                                    toast({
                                        title: "Failed to change logging state!",
                                        description: "You may be disconnected from the Internet.",
                                        status: "error",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                });
                            });
                        }} />
                    </FormControl>
                </VStack>
            </HoverableBox>
        </JackInTheBox>
        }</>
    )
}