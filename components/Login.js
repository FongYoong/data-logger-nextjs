import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { EmailLogin, EmailRegister } from './EmailForm';
import { Button, Container, HStack, VStack,
Modal,
ModalOverlay,
ModalContent,
ModalBody,
ModalCloseButton,
} from "@chakra-ui/react";
import TextTransition, { presets } from "react-text-transition";
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineMail } from 'react-icons/hi';
import { useAuth } from '../lib/auth';

export default function Login({loginState}) {
    const { auth, loading, signInWithAuthProvider, signInWithEmail, signUpWithEmail } = useAuth();
    const router = useRouter();
    useEffect(() => {
    if (!loading && auth) {
        router.replace('/dashboard');
    }
    }, [auth, loading, router]);

    const emailFlipRef = useRef();
    const [mode, setMode] = useState("Login");
    // style={{'backdrop-filter': 'blur(2px)', transform: 'translateZ(0)'}}
    return (
        <Modal size='md' autoFocus={false} isOpen={loginState.isOpen} onClose={loginState.onClose}>
        <ModalOverlay />
        <ModalContent boxShadow='' backgroundColor='transparent' >
            <ModalCloseButton size='lg' borderWidth={2} borderColor='gray' style={{position:'absolute', zIndex:1000, backgroundColor:'#ffebeb'}} />
            <ModalBody>
            <Container>
                <Flippy
                    flipOnHover={false}
                    flipOnClick={false}
                    flipDirection="horizontal"
                    ref={emailFlipRef}
                >
                    <FrontSide style={{height: '2em', padding: 0}}>
                    <VStack p={4} spacing={4} backgroundColor='white' borderWidth={2} borderRadius="lg" boxShadow="lg">
                        <HStack spacing={2} align="center" justify="center">
                        <Button variant={mode==="Login"?"solid":"outline"} colorScheme="teal" onClick={() => setMode("Login")}>
                            Login
                        </Button>
                            <Button variant={mode!=="Login"?"solid":"outline"} colorScheme="teal" onClick={() => setMode("Register")}>
                            Register
                        </Button>
                        </HStack>
                        <VStack spacing={4} >
                        <Button leftIcon={<FcGoogle />} colorScheme="blue" onClick={() => {
                            signInWithAuthProvider("google.com")}}>
                            <TextTransition text={mode} springConfig={ presets.gentle } /> &nbsp;with Google
                        </Button>
                        <Button leftIcon={<HiOutlineMail />} colorScheme="blue" onClick={() => emailFlipRef.current.toggle()}>
                            <TextTransition text={mode} springConfig={ presets.gentle } /> &nbsp;with Email
                        </Button>
                        </VStack>
                    </VStack>
                    </FrontSide>
                    <BackSide style={{height: '0', padding: 0}}>
                    {mode === "Login" && /* Email login */
                        <EmailLogin submitHandler={signInWithEmail} backHandler={() => {emailFlipRef.current.toggle()}} loadingState={loading} />
                    }
                    {mode !== "Login" && /* Email sign up */
                        <EmailRegister submitHandler={signUpWithEmail} backHandler={() => {emailFlipRef.current.toggle()}} loadingState={loading} />
                    }
                    </BackSide>
                </Flippy>
            </Container>
            </ModalBody>
        </ModalContent>
      </Modal>
  )
}