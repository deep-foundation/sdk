import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";
import { generateApolloClient } from '@deep-foundation/hasura/client';
import * as dotenv from 'dotenv';
dotenv.config();

async function installPackage() {
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

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");

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

  // Unable to create sub-types cause of type constraints
  // await deep.insert({
  //   type_id: typeTypeLinkId,
  //   from_id: anyTypeLinkId,
  //   to_id: anyTypeLinkId,
  //   in: { data: {
  //     type_id: containTypeLinkId,
  //     from_id: packageLinkId,
  //     string: { data: { value: 'Notification' } },
  //   } },
  //   out: {
  //     data: [
  //       {
  //         type_id: typeTypeLinkId,
  //         to_id: anyTypeLinkId,
  //         in: { data: {
  //           type_id: containTypeLinkId,
  //           from_id: packageLinkId,
  //           string: { data: { value: 'Title' } },
  //         } },
  //       },
  //       {
  //         type_id: typeTypeLinkId,
  //         to_id: anyTypeLinkId,
  //         in: { data: {
  //           type_id: containTypeLinkId,
  //           from_id: packageLinkId,
  //           string: { data: { value: 'Body' } },
  //         } },
  //       },
  //       {
  //         type_id: typeTypeLinkId,
  //         to_id: anyTypeLinkId,
  //         in: { data: {
  //           type_id: containTypeLinkId,
  //           from_id: packageLinkId,
  //           string: { data: { value: 'IconUrl' } },
  //         } },
  //       },
  //       {
  //         type_id: typeTypeLinkId,
  //         to_id: anyTypeLinkId,
  //         in: { data: {
  //           type_id: containTypeLinkId,
  //           from_id: packageLinkId,
  //           string: { data: { value: 'ImageUrl' } },
  //         } },
  //       },
  //       {
  //         type_id: typeTypeLinkId,
  //         to_id: deviceTypeLinkId,
  //         in: { data: {
  //           type_id: containTypeLinkId,
  //           from_id: packageLinkId,
  //           string: { data: { value: 'Notify' } },
  //         } },
  //         out: {
  //           data: [
  //             {
  //               type_id: typeTypeLinkId,
  //               to_id: deviceTypeLinkId,
  //               in: { data: {
  //                 type_id: containTypeLinkId,
  //                 from_id: packageLinkId,
  //                 string: { data: { value: 'Notified' } },
  //               } }
  //             }
  //           ]
  //         }
  //       },
  //     ]
  //   }
  // });

  await deep.insert([
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Notification' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Title' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Body' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'IconUrl' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'ImageUrl' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Notify' } },
        }
      },
    },
    {
      type_id: typeTypeLinkId,
      from_id: anyTypeLinkId,
      to_id: anyTypeLinkId,
      in: {
        data: {
          type_id: containTypeLinkId,
          from_id: packageLinkId,
          string: { data: { value: 'Notified' } },
        }
      },
    }
  ]);
}

installPackage();