import { useEffect } from "react";
import { Contacts } from '@capacitor-community/contacts';
import { Device } from '@capacitor/device';
import { Motion } from '@capacitor/motion';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Network } from '@capacitor/network';
import { useToken } from "./use-token";
import { useGqlPath } from "./use-gql-path";

export function useAddDebugFieldsToWindow() { 
  const [gqlPath,setGqlPath] = useGqlPath()
  const [token,setToken] = useToken()

  useEffect(() => {
    self['CapacitorDevice'] = Device
    self['CapacitorMotion'] = Motion
    self['CapacitorGeolocation'] = Geolocation
    self['CapacitorCamera'] = Camera
    self['CapacitorNetwork'] = Network
    self['CapacitorContact'] = Contacts

    self['gqlPath'] = gqlPath
    self['setGqlPath'] = setGqlPath

    self['token'] = token
    self['setToken'] = setToken
  })
}