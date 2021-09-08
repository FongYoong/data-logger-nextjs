import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { getConfig, getEssentialData, getConfigChanges } from '../../lib/db';
import { Zoom, Slide } from "react-awesome-reveal";
import { MotionGetAttention } from '../../components/MotionElements';
import { useBreakpointValue, useDisclosure, useColorModeValue, Heading, Text, HStack, VStack, Box, Flex,
Switch, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Divider
} from "@chakra-ui/react";
import Navbar from '../../components/Navbar';
import NavbarSpace from '../../components/NavbarSpace';
import Log from '../../components/Log';
import LogControls from '../../components/LogControls';
import LogForm from '../../components/LogForm';
import Login from '../../components/Login';
import LineChart from '../../components/charts/LineChart';
import TimeStatus from '../../components/TimeStatus';

function formatDecimalPlaces(value, decimal_places) {
    return Math.round((value + Number.EPSILON) *  10 * decimal_places) / (10 * decimal_places);
}

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
    const [limitEssentialData, setLimitEssentialData] = useState(false);
    const [pointsToLimit, setPointsToLimit] = useState(20);
    const bg_color = useColorModeValue('white', 'purple.700');

    const temperatureChartDataCreator = (data) => {
        setTemperatureChartData({
            labels: data.map((item) => new Date(item.dateCreated)),
            datasets: [
                {
                    label: 'Temperature',
                    data: data.map((item) => item.temperature),
                    borderWidth: 3,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
            ],
        });
    };

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
                        let array = Object.keys(data).map((key) => ({
                            ...data[key]
                        })).filter((item) => item.dateCreated);
                        //array.reverse();
                        array.sort((a, b) => (a.dateCreated > b.dateCreated) ? -1 : 1);
                        setEssentialData(array);
                        temperatureChartDataCreator(array);
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

    const essentialDataReducer = (data) => {
        const dateCreated = new Date(data.dateCreated);
        return `${dateCreated.toLocaleString()} 🌡 ${formatDecimalPlaces(data.temperature, 2)}°C`;
    }

    const configChangesReducer = (data) => {
        const dateCreated = new Date(data.dateCreated);
        if (data.uid == "device") {
            const enabled = data.enableLogging ? 'Logging Enabled ✅' : 'Logging Disabled ❌';
            return `${dateCreated.toLocaleString()} 🖥 Device 🔨 ${enabled}, Temp. Limit: ${formatDecimalPlaces(data.temperatureLimit, 2)}°C, Log Interval: ${data.logInterval / 1000} s`;
        }
        else {
            let action = '';
            if ('enableLogging' in data) {
                action = data.enableLogging ? 'Logging Enabled ✅' : 'Logging Disabled ❌';
            }
            else if ('demoMode' in data) {
                action = data.demoMode ? 'Demo Mode Enabled ✅' : 'Demo Mode Disabled ❌';
            }
            else if ('logInterval' in data) {
                action = `Temp. Limit: ${formatDecimalPlaces(data.temperatureLimit, 2)}°C, Log Interval: ${data.logInterval / 1000} s`;
            }
            return `${dateCreated.toLocaleString()} 😬 ${data.username} 🔨 ${action}`; // 😃
        }
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
                        <Heading textAlign='center' px={8} mt={6} fontSize={breakpoint==='base'?'4xl':'6xl'} fontWeight="extrabold" >
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
                        {essentialData &&
                            <Zoom style={{width:'100%'}} triggerOnce >
                                <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'xl':'3xl'} fontWeight="bold" >
                                    Last Log: <TimeStatus latestTime={new Date(essentialData[0].dateCreated)} />
                                </Heading>
                            </Zoom>
                        }
                        <LogControls backgroundColor={bg_color} auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <LogForm backgroundColor={bg_color} auth={auth} fetching={fetchingConfig} initialConfig={config} />
                        <Divider w='70%' borderWidth={1} borderColor='gray.500' />
                        <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'xl':'3xl'} fontWeight="bold" >
                            Past Data
                        </Heading>
                        <Flex align="center" justify="center" wrap='wrap' >
                            <LineChart
                                h="20em" w={breakpoint==='base'?'80vw':'40vw'}
                                data={temperatureChartData} fetching={fetchingEssentialData} callback={(value) => {
                                    return value + '°C';
                                }}
                                annotations={[{
                                    id: "slo",
                                    type: 'line',
                                    mode: 'horizontal',
                                    value: config ? config.temperatureLimit : 0,
                                    scaleID: "y",
                                    borderWidth: 2,
                                    borderDash: [10, 5],
                                    label: {
                                        enabled: true,
                                        content: `Temp. Limit`,
                                        position: 'end',
                                    }
                                }]}
                                backgroundColor="white" p={2} borderWidth={2} borderRadius="lg" boxShadow="lg"
                            />
                            <Flex m="4" align="center" justify="center" >
                                <VStack align="center" justify="center" >
                                    <Text as="b" >Limit to first</Text>
                                    <NumberInput defaultValue={20} pattern="^([+,0-9.]+)" min={1} step={1} precision={0} allowMouseWheel
                                        onChange={(_, number) => {
                                            if (number && number > 0) {
                                                setPointsToLimit(number);
                                                if (limitEssentialData && essentialData.length > number) {
                                                    temperatureChartDataCreator(essentialData.slice(0, number));
                                                }
                                            }
                                        }}
                                    >
                                        <HStack>
                                            <NumberInputField />
                                            <NumberInputStepper h='100%' >
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </HStack>
                                    </NumberInput>
                                    <Text as="b" >values</Text>
                                </VStack>
                                <Switch isChecked={limitEssentialData} ml="2" colorScheme="teal" size="lg" onChange={() => {
                                    setLimitEssentialData(!limitEssentialData);
                                    if (!limitEssentialData && essentialData.length > pointsToLimit) {
                                        temperatureChartDataCreator(essentialData.slice(0, pointsToLimit));
                                    }
                                    else {
                                        temperatureChartDataCreator(essentialData);
                                    }
                                }} />
                            </Flex>
                        </Flex>
                        <Log
                            h="15em" w={breakpoint==='base'?'90vw':'50vw'} backgroundColor={bg_color}
                            data={limitEssentialData ? essentialData.slice(0, pointsToLimit) : essentialData}
                            fetching={fetchingEssentialData} reducer={essentialDataReducer} endCallback={endEssentialDataCallback}
                        />
                        <Divider w='70%' borderWidth={1} borderColor='gray.500' />
                        <Heading textAlign='center' px={8} m={4} fontSize={breakpoint==='base'?'xl':'3xl'} fontWeight="bold" >
                            Past Changes
                        </Heading>
                        <Log
                            h="15em" w={breakpoint==='base'?'90vw':'70vw'} backgroundColor={bg_color}
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
/*

                            options={{
                                annotation: {
                                    annotations: [{
                                        type: 'line',
                                        mode: 'horizontal',
                                        scaleID: 'y-axis-0',
                                        value: config ? config.temperatureLimit : 0,
                                        borderColor: 'rgb(75, 192, 192)',
                                        borderWidth: 4,
                                        label: {
                                            enabled: true,
                                            content: 'Test label'
                                        }
                                    }]
                                }
                            }}
                            */