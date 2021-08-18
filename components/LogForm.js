import { useState } from 'react';
import { getUserProfile, updateConfig } from '../lib/db';
import { Text, HStack, VStack, useToast,
NumberInput, NumberInputField, FormControl, FormLabel, FormErrorMessage,
} from "@chakra-ui/react";
import { MotionButton } from './MotionElements';
import { JackInTheBox } from "react-awesome-reveal";
import Loading from './Loading';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const LogSchema = Yup.object().shape({
  temperatureLimit: Yup.number("Must be a number!").required('Required').typeError('Invalid number!'),
  logInterval: Yup.number("Must be a number!").positive('Interval must be positive!').required('Required').typeError('Invalid number!'), // seconds
});

export default function LogForm({auth, fetching, initialConfig}) {
    const toast = useToast();
    const [updating, setUpdating] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(true);
    return ( 
        <> {fetching ?
        <Loading />
        :
        <JackInTheBox triggerOnce >
        <Formik
            initialValues={{
              temperatureLimit: fetching ? 25 : initialConfig.temperatureLimit,
              logInterval: fetching ? 1 : initialConfig.logInterval,
            }}
            validationSchema={LogSchema}
            onSubmit={values => {
                setUpdating(true);
                getUserProfile(false, auth.uid, (result) => {
                    updateConfig(auth.uid, result.username, values, () => {
                        toast({
                            title: "Successly updated!",
                            description: "Cheers! 😃",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                        });
                        setUpdating(false);
                        setDisableSubmitButton(true);
                    }, ()=> {
                        toast({
                            title: "Failed to append to config change!",
                            description: "You may be disconnected from the Internet.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                        setUpdating(false);
                    });
                });
            }}
        >
            {({errors, touched}) => (
            <Form>
                <VStack mx={4} p={4} spacing={4} backgroundColor='white' borderWidth={2} borderRadius="lg" boxShadow="lg">
                    <Field name="temperatureLimit" >
                        {({ field }) => (
                        <FormControl isInvalid={errors.temperatureLimit && touched.temperatureLimit} isRequired>
                        <FormLabel htmlFor="temperatureLimit">Temperature Limit</FormLabel>
                        <NumberInput id="temperatureLimit" defaultValue={initialConfig.temperatureLimit} pattern="^([-+,0-9.]+)" precision={2}
                        onChange={() => {
                            // !touched.temperatureLimit && !touched.logInterval
                            setDisableSubmitButton(false);
                        }}
                        >
                            <HStack>
                                <NumberInputField {...field} />
                                <Text>°C</Text>
                            </HStack>
                        </NumberInput>
                        <FormErrorMessage>{errors.temperatureLimit}</FormErrorMessage>
                        </FormControl>
                        )}
                    </Field>
                    <Field name="logInterval" >
                        {({ field }) => (
                        <FormControl isInvalid={errors.logInterval && touched.logInterval} isRequired>
                        <FormLabel htmlFor="logInterval">Log Interval</FormLabel>
                        <NumberInput id="logInterval" defaultValue={initialConfig.logInterval} min={0.5} precision={2}
                            onChange={() => {
                            // !touched.temperatureLimit && !touched.logInterval
                            setDisableSubmitButton(false);
                        }}
                        >
                            <HStack>
                                <NumberInputField {...field} />
                                <Text>seconds</Text>
                            </HStack>
                        </NumberInput>
                        <FormErrorMessage>{errors.logInterval}</FormErrorMessage>
                        </FormControl>
                        )}
                    </Field>
                    <MotionButton isLoading ={updating} mt={4} colorScheme="purple" type="submit" disabled={disableSubmitButton} >
                        Update
                    </MotionButton>
                </VStack>
            </Form>
            )}
        </Formik>
        </JackInTheBox>
        } </>
    )
}