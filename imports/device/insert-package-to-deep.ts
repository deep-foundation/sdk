import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { PACKAGE_NAME } from "./package-name";

export async function insertPackageToDeep({deep}: {deep: DeepClient}) {

  const typeTypeLinkId = await deep.id("@deep-foundation/core", "Type");
  const anyTypeLinkId = await deep.id("@deep-foundation/core", "Any");
  const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
  const packageTypeLinkId = await deep.id("@deep-foundation/core", "Package");
  const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
  const valueTypeLinkId = await deep.id("@deep-foundation/core", "Value");
  const stringTypeLinkId = await deep.id("@deep-foundation/core", "String");
  const numberTypeLinkId = await deep.id("@deep-foundation/core", "Number");

  const { data: [{ id: packageLinkId }] } = await deep.insert({
    type_id: packageTypeLinkId,
    string: { data: { value: PACKAGE_NAME } },
    in: { data: [
      {
        type_id: containTypeLinkId,
        from_id: deep.linkId
      },
    ] },
    out: { data: [
      {
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'users', 'packages'),
      },
      {
        type_id: joinTypeLinkId,
        to_id: await deep.id('deep', 'admin'),
      },
    ] },
  });


  const { data: [{ id: deviceTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Device' } },
    } },
  });

  const { data: [{ id: uuidTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'UUID' } },
    } },
  });

  const { data: [{ id: nameTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Name' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: modelTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Model' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: platformTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Platform' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: operatingSystemTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Operating System' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: osVersionTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'OS Version' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: manufacturerTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'Manufacturer' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: isVirtualTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'IsVirtual' } },
    } },
  });
  
  const { data: [{ id: memUsedTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'MemUsed' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: numberTypeLinkId
      }
    }
  });
  
  const { data: [{ id: realDiskFreeTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'RealDiskFree' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: numberTypeLinkId
      }
    }
  });


  const { data: [{ id: webViewVersionTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'WebViewVersion' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: batteryLevelTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'BatteryLevel' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: numberTypeLinkId
      }
    }
  });

  const { data: [{ id: isChargingTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'IsCharging' } },
    } },
  });

  const { data: [{ id: isNotChargingTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'IsNotCharging' } },
    } },
  });

  const { data: [{ id: languageCodeTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'LanguageCode' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });

  const { data: [{ id: languageTagTypeLinkId }] } = await deep.insert({
    type_id: typeTypeLinkId,
    from_id: anyTypeLinkId,
    to_id: anyTypeLinkId,
    in: { data: {
      type_id: containTypeLinkId,
      from_id: packageLinkId,
      string: { data: { value: 'LanguageTag' } },
    } },
    out: {
      data: {
        type_id: valueTypeLinkId,
        to_id: stringTypeLinkId
      }
    }
  });
}