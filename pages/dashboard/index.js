import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getConfig, getEssentialData, getConfigChanges } from '../../lib/db';
import { Zoom, Slide } from "react-awesome-reveal";
import { MotionGetAttention } from '../../components/MotionElements';
import { useBreakpointValue, useDisclosure, useColorModeValue, Heading, VStack, Box } from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Log from '../../components/Log';
import LogControls from '../../components/LogControls';
import LogForm from '../../components/LogForm';
import Login from '../../components/Login';
import LineChart from '../../components/charts/LineChart';

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
    const [temperatureChartData, setTemperatureChartData] = useState(null);
    const bg_color = useColorModeValue('white', 'purple.700');

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
                    console.log(data);
                    if (data) {
                        const array = Object.keys(data).map((key) => ({
                            ...data[key]
                        }));
                        array.reverse();
                        setEssentialData(array);
                        setTemperatureChartData({
                            labels: array.map((item) => new Date(item.dateCreated)),
                            datasets: [
                                {
                                    label: 'Temperature',
                                    data: array.map((item) => item.temperature),
                                    borderWidth: 1,
                                    fill: false,
                                    backgroundColor: 'rgb(255, 99, 132)',
                                    borderColor: 'rgba(255, 99, 132, 0.2)',
                                },
                            ],
                        });
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
    const essentialDataReducer = (data) => {
        const dateCreated = new Date(data.dateCreated);
        return `${dateCreated.toLocaleString()} 🌡 ${data.temperature}°C`;
    }

    const configChangesReducer = (data) => {
        let action = '';
        if ('enableLogging' in data) {
            action = data.enableLogging ? 'Logging Enabled ✅' : 'Logging Disabled ❌';
        }
        else if ('logInterval' in data) {
            action = `Temp. Limit: ${data.temperatureLimit}, Log Interval: ${data.logInterval}`;
        }
        const dateCreated = new Date(data.dateCreated);
        return `${dateCreated.toLocaleString()} 😬 ${data.username} 🔨 ${action}`; // 😃
    }

    const endEssentialDataCallback = () => {

    }

    const endConfigChangesCallback = () => {

    }

    const breakpoint = useBreakpointValue({ base: "base", sm: "base", md: "base", lg: "lg" });
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
                                    alt="Angry cat"
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
                        <LogControls backgroundColor={bg_color} auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <LogForm backgroundColor={bg_color} auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'xl':'3xl'} fontWeight="bold" >
                            Past Data
                        </Heading>
                        <LineChart
                            h="20em" w={breakpoint==='base'?'80vw':'40vw'}
                            data={temperatureChartData} fetching={fetchingEssentialData} callback={(value) => {
                                return value + '°C';
                            }}
                            backgroundColor="white" p={2} borderWidth={2} borderRadius="lg" boxShadow="lg"
                        />
                        <Log
                            h="10em" w={breakpoint==='base'?'90vw':'50vw'} backgroundColor={bg_color}
                            data={essentialData} fetching={fetchingEssentialData} reducer={essentialDataReducer} endCallback={endEssentialDataCallback}
                        />
                        <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'xl':'3xl'} fontWeight="bold" >
                            Past Changes
                        </Heading>
                        <Log
                            h="10em" w={breakpoint==='base'?'90vw':'50vw'} backgroundColor={bg_color}
                            data={configChanges} fetching={fetchingConfigChanges} reducer={configChangesReducer} endCallback={endConfigChangesCallback}
                        />
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
