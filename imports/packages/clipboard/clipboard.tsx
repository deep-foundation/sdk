import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Clipboard } from '@capacitor/clipboard';


const CAPACITOR_CLIPBOARD_NAME_PACKAGE = "@l4legenda/capacitor-clipboard";
const CORE_NAME_PACKAGE = "@deep-foundation/core";

export async function copyClipboardToDeep({ deep, deviceLinkId }: { deep: DeepClient, deviceLinkId: any }) {


    const { type, value } = await Clipboard.read();
    const typeClipboardLinkId = await deep.id(CAPACITOR_CLIPBOARD_NAME_PACKAGE, "Clipboard");
    const typeContainLinkId = await deep.id(CORE_NAME_PACKAGE, "Contain");

    await deep.insert({
        type_id: typeClipboardLinkId,
        string: { data: { value: value } },
        in: {
            data: {
                type_id: typeContainLinkId,
                from_id: deviceLinkId,
            }
        },
    })
}

export async function initPackageClipboard({ deep }: { deep: DeepClient }) {
    const typeContainLinkId = await deep.id("@deep-foundation/core", "Contain");
    const typePackageQueryLinkId = await deep.id("@deep-foundation/core", "PackageQuery");
    const typeInstallLinkId = await deep.id("@deep-foundation/npm-packager", "Install");

    await deep.insert({
        type_id: typePackageQueryLinkId,
        string: { data: { value: CAPACITOR_CLIPBOARD_NAME_PACKAGE } },
        in: {
            data: [
                {
                    type_id: typeContainLinkId,
                    from_id: deep.linkId,
                },
                {
                    type_id: typeInstallLinkId,
                    from_id: deep.linkId,
                },
            ]
        },
    })

}


