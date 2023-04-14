import { Button, Stack, StackDivider, Box, Text, Image, Card, CardHeader, CardBody, Heading, Flex } from "@chakra-ui/react";

export default function Tab({ title, url, id, favIconUrl, type }) {

  function createDiv() {
    const injectElement = document.createElement('div'); injectElement.innerHTML = 'XXXXXXXXXXXXXXXXXXXXX'; document.body.appendChild(injectElement);
  }

  const injectDiv = (id) => {
    if (typeof (window) === 'object') {
      chrome.scripting.executeScript({ target: { tabId: id }, func: createDiv, }, null);
    }
  }

  return <Card>
    <CardHeader>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Image src={favIconUrl} />
        <Heading size='md'>
          TAB ID:{id}
        </Heading>
      </Flex>
    </CardHeader>
    <CardBody>
      <Stack divider={<StackDivider />} spacing='2'>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Title:
          </Heading>
          <Text pt='2' fontSize='sm'>
            {title}
          </Text>
        </Box>
        <Box>
          <Heading size='xs' textTransform='uppercase'>
            Url:
          </Heading>
          <Text pt='2' fontSize='sm'>
            {url}
          </Text>
        </Box>
        {type === "page" ? null : (
        <Box>
          <Button onClick={() => injectDiv(id)} style={{
            height: "40px",
            width: "200px",
            background: "pink",
            display: "flex"
          }}>
            INJECT DIV
          </Button>
        </Box>
        )}
      </Stack>
    </CardBody>
  </Card>
}