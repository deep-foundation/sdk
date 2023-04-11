import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
const { generateApolloClient } = require('@deep-foundation/hasura/client');
const PACKAGE_NAME = "@flakeed/openai";
require('dotenv').config();
export async function installPackage() {
  const apolloClient = generateApolloClient({
    path: process.env.NEXT_PUBLIC_GQL_PATH || '', // <<= HERE PATH TO UPDATE
    ssl: !!~process.env.NEXT_PUBLIC_GQL_PATH.indexOf('localhost')
      ? false
      : true,
    // admin token in prealpha deep secret key
    // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsibGluayJdLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJsaW5rIiwieC1oYXN1cmEtdXNlci1pZCI6IjI2MiJ9LCJpYXQiOjE2NTYxMzYyMTl9.dmyWwtQu9GLdS7ClSLxcXgQiKxmaG-JPDjQVxRXOpxs',
  });

  const unloginedDeep = new DeepClient({ apolloClient });
  const guest = await unloginedDeep.guest();
  const guestDeep = new DeepClient({ deep: unloginedDeep, ...guest });
  const admin = await guestDeep.login({
    linkId: await guestDeep.id('deep', 'admin'),
  });
  const deep = new DeepClient({ deep: guestDeep, ...admin });

  const userTypeLinkId = await deep.id('@deep-foundation/core', "User");
  const anyTypeLinkId = await deep.id('@deep-foundation/core', "Any");
  const typeTypeLinkId = await deep.id('@deep-foundation/core', "Type");
  const containTypeLinkId = await deep.id('@deep-foundation/core', "Contain");
  const packageTypeLinkId = await deep.id('@deep-foundation/core', "Package");
  const joinTypeLinkId = await deep.id('@deep-foundation/core', "Join");
  const typeStringLinkId = await deep.id('@deep-foundation/core', "String");
  const typeValueLinkId = await deep.id('@deep-foundation/core', "Value");

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: {
      data: [
        {
          type_id: containTypeLinkId,
          from_id: deep.linkId
        },
      ]
    },
    out: {
      data: [
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'users', 'packages'),
        },
        {
          type_id: joinTypeLinkId,
          to_id: await deep.id('deep', 'admin'),
        },
      ]
    },
  });

  const { data: [{ id: apiKeyTypeLinkId, }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: "ApiKey" } }
      },
    },
    out: {
      data: {
        type_id: typeValueLinkId,
        to_id: typeStringLinkId,
        in: {
          data: {
            from_id: packageLinkId,
            type_id: containTypeLinkId,
            string: { data: { value: 'ApiKeyValue' } },
          }
        }
      }
    }
  });

  const { data: [{ id: usesApiKeyTypeLinkId, }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: userTypeLinkId,
    to_id: apiKeyTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: "UsesApiKey" } }
      },
    }
  });

  const { data: [{ id: modelTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: "Model" } },
      },
    },
    out: {
      data: {
        type_id: typeValueLinkId,
        to_id: typeStringLinkId,
        in: {
          data: {
            from_id: packageLinkId,
            type_id: containTypeLinkId,
            string: { data: { value: 'ModelValue' } },
          }
        }
      }
    }
  });

  const { data: [{ id: usesModelTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: modelTypeLinkId,
    in: {
      data: {
        type_id: containTypeLinkId,
        from_id: packageLinkId,
        string: { data: { value: "UsesModel" } },
      },
    },
  });
}

installPackage();