import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { Clipboard } from '@capacitor/clipboard';

export async function createClipboard({ deep }: { deep: DeepClient }) {
    const { type, value } = await Clipboard.read();
    const clipboardType = await deep.id("@deep-foundation/clipboard", "clipboard");

    const ml = new ManagerLinks(deep);

    const contactLink = await ml.createLink({
        containName: "clipboard",
        value: value,
        contain_from_id: deep.linkId,
        type_id: clipboardType,
    });
}

export async function createClipboardPackage({ deep }: { deep: DeepClient }) {
    const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
    const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");

    const ml = new ManagerLinks(deep);

    const clipbloardPackage = await ml.createLink({
        value: "@deep-foundation/clipboard",
        contain_from_id: deep.linkId,
        type_id: packageTypeLinkId,
    });

    const clipboard = await ml.createLink({
        containName: "clipboard",
        contain_from_id: clipbloardPackage,
        type_id: typeTypeLinkId,
    });

}


class ManagerLinks {
    constructor(private deep: DeepClient) { }

    async createLink({
        containName,
        value,
        contain_from_id,
        type_id,
    }: {
        containName?: string;
        value?: string;
        contain_from_id: number;
        type_id: number;
    }) {
        const {
            data: [{ id }],
        } = await this.deep.insert({
            type_id: type_id,
            ...(value && { string: { data: { value: value } } }),
            in: {
                data: {
                    type_id: 3,
                    from_id: contain_from_id, // 362
                    ...(containName && { string: { data: { value: containName } } }),
                },
            },
        });
        return id;
    }
}
