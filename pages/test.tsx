import { useEffect, useState } from "react";
import { Button, ChakraProvider, Stack, Text } from '@chakra-ui/react';
import { useLocalStore } from '@deep-foundation/store/local';
import { DeepProvider, useDeep, } from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";

export function Test() {

    return (
        <>YOOOOOOO
        </>
    )
}

export default function Index() {
    return (
        <>
            <ChakraProvider>
                <Provider>
                    <DeepProvider>
                        <Test />
                    </DeepProvider>
                </Provider>
            </ChakraProvider>
        </>
    );
}