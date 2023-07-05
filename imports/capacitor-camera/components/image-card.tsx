import { Stack, StackDivider, Box, Text, Image, Card, CardBody, Heading } from "@chakra-ui/react";


export function ImageCard({ image }: any) {

  return <Card>
    <CardBody>
      <Stack divider={<StackDivider />} spacing='2'>
        <Image
          src={image.Base64}
          alt={image.url}
          borderRadius='lg'
        />
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Format:
          </Heading>
          <Text pt='2' fontSize='sm'>
            {image.Format}
          </Text>
        </Box>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            TimeStamp:
          </Heading>
          <Text pt='2' fontSize='sm'>
            {image.TimeStamp}
          </Text>
        </Box>
      </Stack>
    </CardBody>
  </Card>
}