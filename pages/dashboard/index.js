import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getConfig, getEssentialData, getConfigChanges } from '../../lib/db';
import { Zoom, Slide } from "react-awesome-reveal";
import { MotionGetAttention } from '../../components/MotionElements';
import { useBreakpointValue, useDisclosure, Heading, VStack, Box } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Log from '../../components/Log';
import LogControls from '../../components/LogControls';
import LogForm from '../../components/LogForm';
import Login from '../../components/Login';

export default function Dashboard() {
    const { auth, loading } = useAuth();
    const router = useRouter();
    const loginState = useDisclosure();
    const [fetchingConfig, setFetchingConfig] = useState(true);
    const [fetchingEssentialData, setFetchingEssentialData] = useState(true);
    const [fetchingConfigChanges, setFetchingConfigChanges] = useState(true);
    const [config, setConfig] = useState(null);
    const [essentialData, setEssentialData] = useState(null);
    const [configChanges, setConfigChanges] = useState(null);

    useEffect(() => {
        if (!loading) {
            if (!auth) {
                loginState.onOpen();
            }
            else {
                getConfig(true, (data) => {
                    setConfig(data);
                    setFetchingConfig(false);
                });
                getEssentialData(true, (data) => {
                    if (data) {
                        const array = Object.keys(data).map((key) => ({
                            ...data[key]
                        }));
                        array.reverse();
                        setEssentialData(array);
                    }
                    else {
                        setEssentialData(null);
                    }
                    setFetchingEssentialData(false);
                });
                getConfigChanges(true, (data) => {
                    if (data) {
                        const array = Object.keys(data).map((key) => ({
                            ...data[key]
                        }));
                        array.reverse();
                        setConfigChanges(array);
                    }
                    else {
                        setConfigChanges(null);
                    }
                    setFetchingConfigChanges(false);
                });
            }
        }
    }, [auth, loading, router]);

    //console.log(config);
    //console.log(essentialData);
    //console.log(configChanges);

    const endEssentialDataCallback = () => {

    }

    const endConfigChangesCallback = () => {

    }

    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
        <div>
            <Head>
                <title>Data Logger - Dashboard</title>
            </Head>
            <main>
              <Navbar loginState={loginState} />
              <VStack mb={8} >
                <NavbarSpace />
                <VStack mb={24} spacing={4} w="100%" h='100%' align="center" justify="center">
                    <Slide style={{width:'100%'}} triggerOnce >
                        <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'2xl':'6xl'} fontWeight="extrabold" >
                            Dashboard
                        </Heading>
                    </Slide>
                    {!loading && !auth &&
                        <Zoom>
                            <Box boxShadow="base" borderRadius="lg" overflow="hidden" bg="white" lineHeight="0" >
                                <Image
                                    priority={true}
                                    width='400'
                                    height='300'
                                    src='/images/angry.gif'
                                    alt="404 - Page Not Found"
                                />
                            </Box>
                            <MotionGetAttention attentionType='rotate' >
                                <Heading mb={4} >
                                    Please login/register first!
                                </Heading>
                            </MotionGetAttention>
                        </Zoom>
                    }
                    {!loading && auth && <>
                        <LogControls auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <LogForm auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <Log data={essentialData} fetching={fetchingEssentialData} endCallback={endEssentialDataCallback} />
                        <Log data={configChanges} fetching={fetchingConfigChanges} endCallback={endConfigChangesCallback} />
                    </>}
                </VStack>
              </VStack>
              {!auth && <Login loginState={loginState} /> }
            </main>
            <footer>

            </footer>
        </div>
  )
}
//                         <Divider borderWidth={1} borderColor='gray.500' />
