import React, { useMemo, useState, useEffect } from "react";
import { Contacts } from "@capacitor-community/contacts";
import {
  DeepProvider,
  useDeep,
} from "@deep-foundation/deeplinks/imports/client";
import { Provider } from "../imports/provider";

function Content() {
  const deep = useDeep();

  async function getContact() {
    await Contacts.getPermissions();
    const contacts = await Contacts.getContacts();
    console.log(JSON.stringify(contacts));
  }

  const authUser = async () => {
    await deep.guest();
    const { linkId, token, error } = await deep.login({
      linkId: await deep.id("deep", 'admin')
    })
    console.log(linkId, token, error);
  };

  async function addContactDeep() {
    await addLink("contact", "", 362);
  }

  const addLink = async (
    containName: string,
    value: string,
    from_id: number
  ) => {
    const new_list = await deep.insert({
      type_id: 1,
      in: {
        data: {
          type_id: 3,
          from_id: from_id, // 362
          string: { data: { value: containName } },
        },
      },
    });

    console.log(JSON.stringify(new_list));
  };

  return (
    <>
      <button onClick={() => authUser()}>Auth User</button>
      <button onClick={getContact}>Get Contact</button>
      <button onClick={() => addContactDeep()}>add Contact</button>
    </>
  );
}
import { ChakraProvider } from "@chakra-ui/react";

export default function Index() {
  return (
    <>
      <ChakraProvider>
        <Provider>
          <DeepProvider>
            <Content />
          </DeepProvider>
        </Provider>
      </ChakraProvider>
    </>
  );
}