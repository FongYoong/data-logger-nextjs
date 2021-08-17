import { memo, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../lib/auth';
import { getUserProfile } from '../lib/db';
import { useColorMode, useColorModeValue, useBreakpointValue, Avatar, AvatarBadge, HStack, Button, IconButton, Flex, Heading,
AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
Menu, MenuButton, MenuList, MenuItem, MenuGroup, MenuDivider,
} from '@chakra-ui/react';
import { motion } from "framer-motion";
import { MotionButton } from "./MotionElements";
import { BsSun, BsMoon } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { IoLogoGithub } from 'react-icons/io5';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineUser } from 'react-icons/ai';
 
const Navbar = ({loginState}) => {
    const { auth, loading, signOut } = useAuth();
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("purple.100", "purple.800");
    // Logout
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const onLogoutClose = () => setIsLogoutOpen(false);
    const cancelRef = useRef();
    // Profile
    const [profile, setProfile] = useState({username:'', email:'', profile_picture:''});
    useEffect(() => {
        if (auth) {
            getUserProfile(true, auth.uid, (result) => {setProfile(result)});
        }
    }, [auth]);

    const breakpoint = useBreakpointValue({ base: "base", md: "base", lg: "lg" });

    return (
        <>
        <Flex zIndex={1000} bg={bg} position="fixed" w="100%" align="center" justify="space-between" p={breakpoint==="base"? "0.4em": "1.5em"}>
            <HStack spacing={4}>
                <IconButton icon={<IoLogoGithub size={25} />} onClick={() => router.push('https://github.com/FongYoong/data-logger-nextjs')}/>
                <Heading fontSize={["sm", "md", "lg", "2xl"]} onClick={() => router.push('/')} as="button">
                    <Link href='/' >
                        Data Logger
                    </Link>
                </Heading>
                <IconButton variant="outline" colorScheme="yellow" icon={colorMode === "light" ? <BsSun /> : <BsMoon />} onClick={toggleColorMode} />
            </HStack>
            <HStack>
                {!loading && <>
                    {auth ?(<>
                        <Menu autoSelect={false} isLazy={true} >
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <MenuButton mr={2} as={Avatar} cursor="pointer" _hover={{ boxShadow:"outline" }} boxShadow="lg" name={profile.username} src={profile.profile_picture}>
                                    <AvatarBadge boxSize="1.25em" bg="green.500" />
                                </MenuButton>
                            </motion.button>
                            <MenuList>
                                <MenuGroup title="Profile">
                                    <MenuItem icon={<AiOutlineUser />} >
                                        {profile.username}
                                    </MenuItem>
                                    <MenuItem icon={<HiOutlineMail />} >
                                        {profile.email}
                                    </MenuItem>
                                </MenuGroup>
                                <MenuDivider />
                            </MenuList>
                        </Menu>
                        <MotionButton icon={<FiLogOut />} onClick={() => setIsLogoutOpen(true)} p={2} size={breakpoint==="base"?'sm':'md'} colorScheme="red" >
                            Logout
                        </MotionButton>
                        </>):
                        <MotionButton ml={2} p={2} size={breakpoint==="base"?'sm':'md'} colorScheme="pink" onClick={()=> {loginState.onOpen()}} >
                            Login/Register
                        </MotionButton>
                    }
                </>}
            </HStack>
        </Flex>

        <AlertDialog
            isOpen={isLogoutOpen}
            leastDestructiveRef={cancelRef}
            onClose={onLogoutClose}
        >
            <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                     Logout
                </AlertDialogHeader>
                <AlertDialogBody>
                    Are you sure?
                </AlertDialogBody>
                <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onLogoutClose}>
                    No
                </Button>
                <Button colorScheme="red" onClick={() => {
                    signOut();
                    onLogoutClose();
                }} ml={3}>
                    Yes
                </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    </>
    );
};

export default memo(Navbar);