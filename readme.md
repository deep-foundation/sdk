## Prerequisitions
```
npm-install
```
Add `.env` file with these environment variables:
```
NEXT_PUBLIC_GQL_PATH=3006-deepfoundation-dev-urovmzfl8a1.ws-eu85.gitpod.io/gql
NEXT_PUBLIC_GQL_SSL=1
```
And do not forget to change NEXT_PUBLIC_GQL_PATH to your graphql address

## Package installation
```
package_name="device" # Replace to any package name
npx ts-node "./imports/${package_name}/install-package.ts"
```

## Web
```
npm run build &&
npm run start
```

## Android
```
npm run android-build &&
npm run android-run
```

## IOS
```
npm run ios-build &&
npm run ios-run
```


## Documentation

### startRecording()

This function is responsible for starting the voice recording process. When called, it initiates the VoiceRecorder.startRecording() function and stores the start time of the recording. It returns the startTime variable which is of format toLocaleDateString().

### stopRecording(deep, containerLinkId, startTime)

This function stops the ongoing voice recording and uploads the recorded data.

Parameters:

- deep: A DeepClient instance that is responsible for making API calls.
- containerLinkId: An identifier representing the AudioRecords type link used as container for records.
- startTime: The start time of the recording, returned by the startRecording() function.

### useRecordingCycle({deep, recording, duration})

This function is a custom React Hook that manages the recording cycle.

Parameters:

- deep: A DeepClient instance that is responsible for making API calls.
- recording: A boolean value indicating the state of recording. Cycle fires while true.
- duration: The duration for the recording cycle.

### createContainer(deep)

This function creates AudioRecords type link used as container for records.

### loadRecords(deep)

This function returns array of records [{ sound: base64string, mimetype: string}].