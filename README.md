A template/boilerplate for creating nextjs applications that use deep. It is recommended to merge with this repository to have its improvements in your nextjs application!

Just erase `pages/index.tsx` `Page` component body.

# Variables

```sh
// Optional
NEXT_PUBLIC_GRAPHQL_URL=DeepPath
NEXT_PUBLIC_DEEP_TOKEN=DeepToken
NEXT_PUBLIC_I18N_DISABLE=1
```

# How to make this repository pullable in your repository
```
git remote add sdk https://github.com/deep-foundation/sdk.git
git fetch sdk
git merge sdk/main --allow-unrelated-histories --strategy ours 
```
Note that we use `ours` strategy during merge to avoid any changed in your existing project
## How to pull some new commits but not old
If you want to get some-commits to your repository - merge with `ours` strategy with old sdk commit that is created before required changes and then merge with main
```
git remote add sdk https://github.com/deep-foundation/sdk.git
git fetch sdk
git merge sdk/some_old_commit_hash --allow-unrelated-histories --strategy ours
git merge sdk/main
```
Note: I am sure that it is not the only way to do this. Possibly you can use `cherry-pick` to do this

Now you can pull changes from this repository by using
```
git pull sdk main
```

## Prerequisitions
- Install and use nodejs version from .nvmrc
```
nvm install && nvm use
```
- Install dependencies
```
npm ci
```
- Run by using [How to run](#how-to-run)
- Pass graphql url and token
To easily get token you can use `Copy token` button in the menu of deepcase. In the same menu you can find `gql` button where you can get graphql path
- Install Homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## How to build

```
npx cap sync
brew install cocoapods
(cd ios/App/App; pod install)
```

### Web
Development
```
npm run dev
```
Build server+client build with ssr
```
npm run build &&
npm run start
```
Export static client without server
```
npm run export
```


### Android
```
npm run build-android &&
npm run open-android
```

### IOS
```
npm run build-ios &&
npm run run-ios
```

### Windows
```
npm run build-windows
```

### Unix
```
npm run build-unix
```

### Mac
```
npm run build-mac
```

# Development
You can use environment variables to set graphql path and token on server instead of setting it on client. See template in [.env.development](https://github.com/deep-foundation/sdk/blob/main/.env.development). Create a file `.env.local` with your values


# Translation i18n
You can edit `/public/locales/*/*.json` files as `/public/locales/en/common.json` and use it inside your components as:
```tsx
const { t } = useTranslation();
<div>{t('connection')}</div>
```
You **must** use this on every page:
```tsx
import { i18nGetStaticProps } from "../src/i18n";
export async function getStaticProps(arg) {
  return await i18nGetStaticProps(arg);
}
```
And this on every dynamc route page (as /path/[variable])
```tsx
export async function getStaticPaths() {
  return {
    paths: ['/path/123'],
    fallback: true
  }
}
```
For support static `npm run export` of nextjs, you can use env variable NEXT_PUBLIC_I18N_DISABLE. But i18n is not available in export nextjs mode.