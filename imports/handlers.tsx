import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
export const insertHandler = async (deep: DeepClient ,handleOperationTypeId: number, typeId: number, code: string, forceOwnerId?: number, supportsId?: number) => {
    const syncTextFileTypeId = await deep.id('@deep-foundation/core', 'SyncTextFile');
    const handlerJSFile = (await deep.insert({
      type_id: syncTextFileTypeId,
    }, { name: 'INSERT_HANDLER_JS_FILE' })).data[0];
    const handlerJSFileValue = (await deep.insert({ link_id: handlerJSFile?.id, value: code }, { table: 'strings' })).data[0];
    const handlerTypeId = await deep.id('@deep-foundation/core', 'Handler');
    const handler = (await deep.insert({
      from_id: supportsId || await deep.id('@deep-foundation/core', 'dockerSupportsJs'),
      type_id: handlerTypeId,
      to_id: handlerJSFile?.id,
    }, { name: 'INSERT_HANDLER' })).data[0];
    const containTypeId = await deep.id('@deep-foundation/core', 'Contain');
    const ownerId = forceOwnerId || (await deep.id('deep', 'admin'));
    const ownerContainHandler = (await deep.insert({
      from_id: ownerId,
      type_id: containTypeId,
      to_id: handler?.id,
    }, { name: 'INSERT_ADMIN_CONTAIN_HANDLER' })).data[0];
    const handleOperation = (await deep.insert({
      from_id: typeId,
      type_id: handleOperationTypeId,
      to_id: handler?.id,
    }, { name: 'INSERT_INSERT_HANDLER' })).data[0];
    return {
      handlerId: handler?.id,
      handleOperationId: handleOperation?.id,
      handlerJSFileId: handlerJSFile?.id,
      handlerJSFileValueId: handlerJSFileValue?.id,
      ownerContainHandlerId: ownerContainHandler?.id,
    };
  };