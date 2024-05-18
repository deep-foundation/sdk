A template/boilerplate for creating nextjs applications that use deep. It is recommended to merge with this repository to have its improvements in your nextjs application!

<img src="https://habrastorage.org/r/w1560/getpro/habr/upload_files/640/2ec/360/6402ec360bfb54cf6e6041945efaf514.png"/>

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
git fetch sdk main
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
nvm install 18 && nvm alias default 18; npm use default;
```
- Install dependencies
```
npm ci; (cd electron; npm ci)
```
- Run by using [How to run](#how-to-run)
- Pass graphql url and token
To easily get token you can use `Copy token` button in the menu of deepcase. In the same menu you can find `gql` button where you can get graphql path
- Install Homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## How to build manually

### Web
Development
```
npm run dev
```
<details>
  <summary>screenshot</summary>

  ![dev](https://private-user-images.githubusercontent.com/7591093/323526946-f3b86b4c-8547-4959-8cb9-0de988da8932.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNjk0Ni1mM2I4NmI0Yy04NTQ3LTQ5NTktOGNiOS0wZGU5ODhkYTg5MzIucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZTM1ODE3NzIyYWUyZGRiYjA4MGM1NWY0MTgzNzc2MmVjYWQ4NzBmZjk2MmUxNDAwZGM1MjdjODdlZjJlZDQ0MiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.UFW6QrFdxr6MD4V5JWzTfTUflIc5hNwJn4JRi4sdKF4)
</details>

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
Prepare:
- Install Android Studio.
- Install in (Settings -> Languages & Frameworks -> Android SDK -> SDK Tool):
  - Android SDK Command-line Tools
  - Android Emulator
  - Android SDK Platfrom-Tool
  - Google Play services
- Install in (Settings -> Languages & Frameworks -> Android SDK -> SDK Platforms):
  - Android 14
Build:
```
npm run build-android &&
npm run open-android
```
<details>
  <summary>screenshot</summary>

  ![ios](https://private-user-images.githubusercontent.com/7591093/323526940-51c8fb68-1e47-4d36-b51a-6deaa9266237.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNjk0MC01MWM4ZmI2OC0xZTQ3LTRkMzYtYjUxYS02ZGVhYTkyNjYyMzcucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9OGYwMDIwMDRlOTE4OGYzNzQwMDNhZmJlN2UxYjM5NzQ0YzNhODliMDNkOWMwYjEzMmI3YzY2YTM5YTk1OGQ3MSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.zNXdV6h0oKfoxu6Zhc0Hf3VhHGrWX5vqD7z2JSErfaw)
</details>

### IOS
Prepare:
- Xcode 10 or later installed on your Mac.
- execute this
```
brew install cocoapods
(cd ios/App/App; pod install)
```
Build
```
npm run build-ios &&
npm run run-ios
```
<details>
  <summary>screenshot</summary>

  ![ios](https://private-user-images.githubusercontent.com/7591093/323526924-32fdf661-0258-498f-9816-f78fbfee0459.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNjkyNC0zMmZkZjY2MS0wMjU4LTQ5OGYtOTgxNi1mNzhmYmZlZTA0NTkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YzU5ODIzNzJmNGFjZDQwY2ZiZGJlZTdlZTIxODE0NmY4Mjc3NmQ1ODZmM2FkMDRhMWMzZjk4MDVjZTdmZjNhOSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.Qo6ndiyTTSoKR2NB8r7mcf8ttU1yaITxFyt6UYiZkPI)
</details>

### Windows
```
npm run build-windows
```

### Unix
```
npm run build-unix
```

### Mac
Prepare:
- Xcode 10 or later installed on your Mac.
- An [Apple Developer](https://developer.apple.com/) account.
- [An app-specific password for your ADC account’s Apple ID](https://support.apple.com/HT204397)
- `security add-generic-password -l "sdk" -a "YOUR-APPLEID-EMAIL" -s "keychain" -T "" -w "APP-PASSWORD-FROM-APPLE"`
- [Generate teamId](https://github.com/electron/notarize?tab=readme-ov-file#notes-on-your-teamid)
- update APPLEIDPASS, APPLEID, CSC_NAME, APPLETEAMID in `package.json`.`scripts`.`build-mac`
```
npm run build-mac
```
<details>
  <summary>screenshot</summary>

  ![mac](https://private-user-images.githubusercontent.com/7591093/323526893-255e550b-619b-4e0a-bc0c-cc56875c5b95.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNjg5My0yNTVlNTUwYi02MTliLTRlMGEtYmMwYy1jYzU2ODc1YzViOTUucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZDRlYjIxY2UxNWU0M2ZiZjRlZDM3N2M3ZGI0YmI4ZmFhZGYxMDRhNzU3NzY4MDdjMGFmYzJkNDhlZWVhY2FjYSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.hae0zaplZWXoxE6DxN4mKrGWjC0-rYPXzzcOi5guZ4Q)
</details>

### Chrome extension
```
npm run build-chrome-extension
```
Result path: `sdk/extension.crx` and `sdk/extension.pem`
<details>
  <summary>screenshot</summary>

  ![chrome](https://private-user-images.githubusercontent.com/7591093/323526950-8f887f44-4ddf-48ad-aaef-e29a1886de39.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNjk1MC04Zjg4N2Y0NC00ZGRmLTQ4YWQtYWFlZi1lMjlhMTg4NmRlMzkucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ODlkNjI5MWVmZDlmOWE4NTAxNjg1NGFhNTQ5YzFhZGUxOWIzM2Q2MzE2MTQ3YWNkZWYyODFhZGI5MDE0YzExNCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.dN4z1V4dkKxCODh_YuSeDZUzufz_mZNesVbJoXXusYM)
</details>

### Github Pages
Only activate GitHub Pages for Your Repository

(Settings -> Pages -> Source -> Deploy from branch main -> Github Actions)

> There is no need to make any changes to the code.
<details>
  <summary>screenshot</summary>

  ![gh-pages](https://private-user-images.githubusercontent.com/7591093/323527149-899e10e7-6ccb-4af9-9e16-33398f695e30.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTM0MjkzNzUsIm5iZiI6MTcxMzQyOTA3NSwicGF0aCI6Ii83NTkxMDkzLzMyMzUyNzE0OS04OTllMTBlNy02Y2NiLTRhZjktOWUxNi0zMzM5OGY2OTVlMzAucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQxOCUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MThUMDgzMTE1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NzI5NTM5ZGMyOGM1NDVkMjYyMTkzODUwOTcyYjRlNmI5YTBmOTFhYWNkNWUxNWJhYjFjYzk1ZjI0MzQzYjYzOCZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.jPIxsWFV2uwMR_0hVuc-8M8gp6jKWoZuQOBNeWBKPiI)
</details>

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

## Restart

### GitPod

SDK app is started together with Deep.Links and other services in GitPod. So to restart it from GitPod you should do the following:

1. Find terminal there `npm run gitpod-start` command was executed.
![IMG_1490](https://github.com/deep-foundation/deepcase-app/assets/1431904/81ecd4d4-f4d2-4812-8948-0a155347218d)

2. Press `CTRL+C` in terminal to stop a Deep instance (Deep.Links and SDK).
![IMG_1491](https://github.com/deep-foundation/deepcase-app/assets/1431904/39966c49-b8fd-4030-bcac-d8a0e4ff4e17)

3. Press `↑` button on your keyboard to get last executed command.
![IMG_1492](https://github.com/deep-foundation/deepcase-app/assets/1431904/9ef60c58-ca70-43f3-be91-91966d85dddc)

4. Press `Enter` to execute that command again, that will finish restart sequence.
![IMG_1493](https://github.com/deep-foundation/deepcase-app/assets/1431904/56f48dad-d751-44c7-8871-164f824f122b)

## NPM

If you want launch your repo from npx as `npx @deep-foundation/sdk` you must change name in package.json, manually `npm adduser` and first publish `npm publish --access public` yout fork.

For publish new version, just update package.json version field and then git commit && publish to github.

This app can be launched as builded web server with `npx @deep-foundation/sdk`
