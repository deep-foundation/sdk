## Run
### .env
```
NEXT_PUBLIC_GQL_PATH=<gql-client-path>/gql     
NEXT_PUBLIC_GQL_SSL=0/1 for local/remote
```
### Make sure to use nodejs version 14.15.0

```bash
npm ci
```
```bash
npm run bbel    // build-browser-extension-linux
```
```bash
npm run bbem    // build-browser-extension-mac
```

## Use

### Init

Go to chrome://extensions/ and load extension folder via "Load unpacked" button:

![Image](https://user-images.githubusercontent.com/44348954/212568038-6d3dd7e9-8099-4284-8b9f-40572c31567f.png)

Then open extension page in extensions list:

![Image](https://user-images.githubusercontent.com/44348954/212568077-86708bc1-7d35-4d73-9ead-f64fcecdf348.png)

You will see this menu:

![Image](https://user-images.githubusercontent.com/44348954/212566561-9bde6359-b884-4014-8b7b-0b1b789c8b88.png)

Press ADMIN to login as your admin link. Button turns green on success.

![Image](https://user-images.githubusercontent.com/44348954/212566768-0779965a-e4ab-4f21-b660-8ae47ddf229d.png)

I don't know why but first deep.id() call always fails with an error "id not found by ..."

![Image](https://user-images.githubusercontent.com/44348954/212566858-5410d0f4-b257-4a51-9e05-430d81b2919d.png)

So press twice. Then INITIALIZE PACKAGE button. 

### Inside your deep:

![Image](https://user-images.githubusercontent.com/44348954/212566987-baca0565-6ccc-4e23-9980-360562204920.png)


There is BrowserHistory link serving as a container for history pages. You can delete down from its contain link to flush all uploaded history in one click and create new container with CREATE NEW BROWSER HISTORY LINK button. That is for utility purposes only.  

### MAKE SURE YOU HAVE ONLY ONE CONTAINER LINK AT A TIME!

### Tabs

![Image](https://user-images.githubusercontent.com/44348954/212567313-f3f91280-3c3a-4367-a307-8d8c350753b1.png)

This subscription fires update cycle with chrome.tabs() api call inside and custom delay function.

You will see your active tabs as nice cards:

![Image](https://user-images.githubusercontent.com/44348954/212567537-05a70f5b-bebe-4fce-abe1-c99c6c763502.png)

And you can inject <div> with INJECT DIV button.


### History

UPLOAD HISTORY button uploads 10 last pages of your chrome history as Page links inside BrowserHistory container.


![Image](https://user-images.githubusercontent.com/44348954/212567872-80b7c54b-1cd3-4762-a144-a862441baaf4.png)


