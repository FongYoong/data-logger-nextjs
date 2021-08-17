import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { Zoom, JackInTheBox, Slide } from "react-awesome-reveal";
import { MotionGetAttention, MotionButton } from '../components/MotionElements';
import { useBreakpointValue, useDisclosure, Divider, Heading, VStack, Button } from "@chakra-ui/react";
import Navbar from '../components/Navbar';
import NavbarSpace from '../components/NavbarSpace';
import Login from '../components/Login';
import { MdNavigateNext } from 'react-icons/md';
import Typewriter from 'typewriter-effect';

export default function Home() {
    const { auth, loading } = useAuth();
    const router = useRouter();
    const loginState = useDisclosure();
    const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });
    return (
        <div>
            <Head>
                <title>Data Logger - Home</title>
            </Head>
            <main>
              <Navbar loginState={loginState} />
              <VStack>
                <NavbarSpace />
                <VStack mb={24} spacing={4} w="100%" h='100%' align="center" justify="center">
                  <Zoom style={{width:'100%'}} triggerOnce >
                  <VStack p={4} w='100%' bgGradient="linear(to-r, #cc2b5e, #753a88)" >
                    <Heading textAlign='center' px={8} m={4} color='white' fontSize={breakpoint==='base'?'2xl':'6xl'} fontWeight="extrabold" >
                      <Typewriter
                          onInit={(typewriter) => {
                            typewriter
                              .typeString('Data Logger')
                              .pauseFor(1500)
                              .deleteChars(11)
                              .start();
                          }}
                          options={{
                            autoStart: true,
                            loop: true,
                          }}
                        />
                    </Heading>
                    <Divider borderWidth={1} borderColor='gray.50' />
                    <MotionGetAttention attentionType='expand' >
                      <Button mt={4} rightIcon={<MdNavigateNext />} colorScheme={"purple"} onClick={() => {
                        if (!loading && auth) {
                          router.push('/dashboard');
                        }
                        else {
                          loginState.onOpen();
                        }
                      } } >
                        Get Started
                      </Button>
                    </MotionGetAttention>
                  </VStack>
                  </Zoom>
  
                </VStack>
              </VStack>
              {!auth && <Login loginState={loginState} /> }
            </main>
            <footer>

            </footer>
        </div>
  )
}