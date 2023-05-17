## Prerequisitions
- Install and use nodejs version from .nvmrc
```
nvm install && nvm use
```
- Install dependencyes
```
npm-install
```

- Install `@deep-foundation/deep-memo`
Install https://www.npmjs.com/package/@deep-foundation/deep-memo by using npm-packager

- Give permissions
```ts
const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
const packageLinkId = await deep.id("@freephoenix888/object-to-links-async-converter");
await deep.insert([
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id('deep', 'users', 'packages'),
  },
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id('deep', 'admin'),
  },
])
```

- Run by using [How to run](#how-to-run)
- Pass graphql url and token
To easily get token you can use `Copy token` button in the menu of deepcas. Also in the same menu you can find `gql` button where you can get graphql path


## How to run?
### Web
```
npm run build &&
npm run start
```

### Android
```
npm run android-build &&
npm run android-run
```

### IOS
```
npm run ios-build &&
npm run ios-run
```


# deep sdk

- [x] deep example
- [x] message/reply model https://runkit.com/ivansglazunov/deep-create-messaging-package
- [ ] linux deb app solution
- [ ] window exe app solution
- [ ] mac app build solution
- [ ] ios app build solution
- [ ] android app build solution
- [ ] google chrome extension solution
- [ ] firefox extension solution
- [ ] docker solution
- [ ] heroku solution
- [ ] gh-pages client solution
- [ ] standalone os build solution
