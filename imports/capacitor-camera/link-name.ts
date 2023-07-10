/**
 * Contains the names of all links within this package. 
 * 
 * @example
```ts
const camaraTypeLinkId = await deep.id(
   PACKAGE_NAME,
   LinkName[LinkName.Camera]
)
```
 */
export enum LinkName {
    Camera,
    Photo,
    Base64,
    WebPath,
    Exif,
    Format,
    TimeStamp,
 }