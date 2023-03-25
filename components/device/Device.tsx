import { DeviceInfo } from "@capacitor/device";
import { Card, CardHeader, Heading, CardBody, Stack, StackDivider, Box, Text, Image } from "@chakra-ui/react";
import { Device } from "../../imports/device/device";

export function Device({ device }: { device: Device }) {
  return <Card >
    <CardHeader>
      <Heading >
        {
          device.model
        }
      </Heading>
    </CardHeader>
    <CardBody>
      <Text>
        {
          device.name
        }
      </Text>
    </CardBody>
  </Card>
}