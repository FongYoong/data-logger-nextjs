import { getUserProfile, updateConfig } from '../lib/db';
import { Switch, Flex, Text, useToast } from "@chakra-ui/react";
import { JackInTheBox } from "react-awesome-reveal";
import { HoverableBox } from '../components/MotionElements';
import Loading from './Loading';

export default function LogControls({auth, fetching, initialConfig, ...props}) {
    const toast = useToast();
    const enableLoggingState = fetching ? false : (initialConfig.enableLogging === "true" || initialConfig.enableLogging === true);
    const demoModeState = fetching ? false : (initialConfig.demoMode === "true" || initialConfig.demoMode === true);

    return (
        <> {fetching ?
        <Loading />
        :
        <JackInTheBox triggerOnce >
            <HoverableBox>
                <Flex align="center" justify="center" wrap="wrap" >
                    <Flex m="2" p="4" align="center" justify="center" borderWidth="2" borderRadius="lg" boxShadow="lg" {...props} >
                        <Text as="b" >
                            Log Data
                        </Text>
                        <Switch ml="2" isChecked={enableLoggingState} colorScheme="teal" size="lg" onChange={() => {
                            getUserProfile(false, auth.uid, (result) => {
                                updateConfig(auth.uid, result.username, {enableLogging: !enableLoggingState}, () => {
                                    console.log(`Successfully ${enableLoggingState?'disabled':'enabled'} logging`);
                                    toast({
                                        title: `Successfully ${enableLoggingState?'disabled':'enabled'} logging`,
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
                    </Flex>
                    <Flex m="2" p="4" align="center" justify="center" borderWidth="2" borderRadius="lg" boxShadow="lg" {...props} >
                        <Text as="b" >
                            Demo Mode
                        </Text>
                        <Switch ml="2" isChecked={demoModeState} colorScheme="teal" size="lg" onChange={() => {
                            getUserProfile(false, auth.uid, (result) => {
                                updateConfig(auth.uid, result.username, {demoMode: !demoModeState}, () => {
                                    console.log(`Successfully ${demoModeState?'disabled':'enabled'} demo mode`);
                                    toast({
                                        title: `Successfully ${demoModeState?'disabled':'enabled'} demo mode`,
                                        description: "Cheers! 😃",
                                        status: "success",
                                        duration: 2000,
                                        isClosable: true,
                                    });
                                }, ()=> {
                                    toast({
                                        title: "Failed to change demo mode!",
                                        description: "You may be disconnected from the Internet.",
                                        status: "error",
                                        duration: 3000,
                                        isClosable: true,
                                    });
                                });
                            });
                        }} />
                    </Flex>
                </Flex>
            </HoverableBox>
        </JackInTheBox>
        }</>
    )
}