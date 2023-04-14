import { Button, Stack, StackDivider, Box, Text, Image, Card, CardHeader, CardBody, Heading, Flex } from "@chakra-ui/react";

const readAsBase64 = async (webPath) => {
	// Fetch the photo, read as a blob, then convert to base64 format
	const response = await fetch(webPath!);
	const blob = await response.blob();
	return await convertBlobToBase64(blob) as string;
}

const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onerror = reject;
	reader.onload = () => {
		resolve(reader.result);
	};
	reader.readAsDataURL(blob);
});

export default function ImageCard({ image }) {

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