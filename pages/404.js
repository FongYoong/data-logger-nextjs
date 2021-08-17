import Head from 'next/head';
import { Zoom } from "react-awesome-reveal";
import { Flex, Heading } from "@chakra-ui/react";
import Navbar from '../components/Navbar';
import NavbarSpace from '../components/NavbarSpace';

export default function NotFound() {
    return (
        <div>
            <Head>
                <title>404 - Page Not Found</title>
            </Head>
            <main>
                <Navbar />
                <NavbarSpace />
                <Zoom>
                    <Flex p={2} w="100%" direction="column" align="center" justify="center">
                        <Heading m={4} textAlign='center' lineHeight='normal' bgGradient="linear(to-l, #7928CA,#FF0080)" bgClip="text" fontSize="4xl" fontWeight="extrabold" >
                            Page Not Found!
                        </Heading>
                    </Flex>
                </Zoom>
            </main>
            <footer>

            </footer>
        </div>
  )
}