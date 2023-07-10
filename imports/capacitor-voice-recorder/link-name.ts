/**
 * Contains the names of all links within this package. 
 * 
 * @example
```ts
const recordTypeLinkId = await deep.id(
   PACKAGE_NAME,
   LinkName[LinkName.Record]
)
```
 */
export enum LinkName {
    AudioRecords,
    Record,
    StartTime,
    EndTime,
    Sound,
    "MIME/type",
    Format,
    Duration,
 }