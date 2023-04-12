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
					src={image.Base64 ? `data:${image.Format};base64, ${image.Base64}` : `data:text/html;base64,PCFET0NUWVBFIGh0bWw+PGh0bWw+PGhlYWQ+PHN0eWxlIGRhdGEtbmV4dC1oaWRlLWZvdWM9InRydWUiPmJvZHl7ZGlzcGxheTpub25lfTwvc3R5bGU+PG5vc2NyaXB0IGRhdGEtbmV4dC1oaWRlLWZvdWM9InRydWUiPjxzdHlsZT5ib2R5e2Rpc3BsYXk6YmxvY2t9PC9zdHlsZT48L25vc2NyaXB0PjxtZXRhIGNoYXJTZXQ9InV0Zi04Ii8+PG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCIvPjx0aXRsZT40MDQ6IFRoaXMgcGFnZSBjb3VsZCBub3QgYmUgZm91bmQ8L3RpdGxlPjxtZXRhIG5hbWU9Im5leHQtaGVhZC1jb3VudCIgY29udGVudD0iMyIvPjxub3NjcmlwdCBkYXRhLW4tY3NzPSIiPjwvbm9zY3JpcHQ+PHNjcmlwdCBkZWZlcj0iIiBub21vZHVsZT0iIiBzcmM9Ii9fbmV4dC9zdGF0aWMvY2h1bmtzL3BvbHlmaWxscy5qcz90cz0xNjgxMzM5NjA2NjQ2Ij48L3NjcmlwdD48c2NyaXB0IHNyYz0iL19uZXh0L3N0YXRpYy9jaHVua3Mvd2VicGFjay5qcz90cz0xNjgxMzM5NjA2NjQ2IiBkZWZlcj0iIj48L3NjcmlwdD48c2NyaXB0IHNyYz0iL19uZXh0L3N0YXRpYy9jaHVua3MvbWFpbi5qcz90cz0xNjgxMzM5NjA2NjQ2IiBkZWZlcj0iIj48L3NjcmlwdD48c2NyaXB0IHNyYz0iL19uZXh0L3N0YXRpYy9jaHVua3MvcGFnZXMvX2FwcC5qcz90cz0xNjgxMzM5NjA2NjQ2IiBkZWZlcj0iIj48L3NjcmlwdD48c2NyaXB0IHNyYz0iL19uZXh0L3N0YXRpYy9jaHVua3MvcGFnZXMvX2Vycm9yLmpzP3RzPTE2ODEzMzk2MDY2NDYiIGRlZmVyPSIiPjwvc2NyaXB0PjxzY3JpcHQgc3JjPSIvX25leHQvc3RhdGljL2RldmVsb3BtZW50L19idWlsZE1hbmlmZXN0LmpzP3RzPTE2ODEzMzk2MDY2NDYiIGRlZmVyPSIiPjwvc2NyaXB0PjxzY3JpcHQgc3JjPSIvX25leHQvc3RhdGljL2RldmVsb3BtZW50L19zc2dNYW5pZmVzdC5qcz90cz0xNjgxMzM5NjA2NjQ2IiBkZWZlcj0iIj48L3NjcmlwdD48bm9zY3JpcHQgaWQ9Il9fbmV4dF9jc3NfX0RPX05PVF9VU0VfXyI+PC9ub3NjcmlwdD48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iX19uZXh0Ij48ZGl2IHN0eWxlPSJmb250LWZhbWlseTotYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFJvYm90bywgJnF1b3Q7U2Vnb2UgVUkmcXVvdDssICZxdW90O0ZpcmEgU2FucyZxdW90OywgQXZlbmlyLCAmcXVvdDtIZWx2ZXRpY2EgTmV1ZSZxdW90OywgJnF1b3Q7THVjaWRhIEdyYW5kZSZxdW90Oywgc2Fucy1zZXJpZjtoZWlnaHQ6MTAwdmg7dGV4dC1hbGlnbjpjZW50ZXI7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlciI+PGRpdj48c3R5bGU+CiAgICAgICAgICAgICAgICBib2R5IHsgbWFyZ2luOiAwOyBjb2xvcjogIzAwMDsgYmFja2dyb3VuZDogI2ZmZjsgfQogICAgICAgICAgICAgICAgLm5leHQtZXJyb3ItaDEgewogICAgICAgICAgICAgICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIC4zKTsKICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICBAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7CiAgICAgICAgICAgICAgICAgIGJvZHkgeyBjb2xvcjogI2ZmZjsgYmFja2dyb3VuZDogIzAwMDsgfQogICAgICAgICAgICAgICAgICAubmV4dC1lcnJvci1oMSB7CiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAuMyk7CiAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH08L3N0eWxlPjxoMSBjbGFzcz0ibmV4dC1lcnJvci1oMSIgc3R5bGU9ImRpc3BsYXk6aW5saW5lLWJsb2NrO21hcmdpbjowO21hcmdpbi1yaWdodDoyMHB4O3BhZGRpbmc6MCAyM3B4IDAgMDtmb250LXNpemU6MjRweDtmb250LXdlaWdodDo1MDA7dmVydGljYWwtYWxpZ246dG9wO2xpbmUtaGVpZ2h0OjQ5cHgiPjQwNDwvaDE+PGRpdiBzdHlsZT0iZGlzcGxheTppbmxpbmUtYmxvY2s7dGV4dC1hbGlnbjpsZWZ0O2xpbmUtaGVpZ2h0OjQ5cHg7aGVpZ2h0OjQ5cHg7dmVydGljYWwtYWxpZ246bWlkZGxlIj48aDIgc3R5bGU9ImZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0Om5vcm1hbDtsaW5lLWhlaWdodDo0OXB4O21hcmdpbjowO3BhZGRpbmc6MCI+VGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZDwhLS0gLS0+LjwvaDI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PHNjcmlwdCBzcmM9Ii9fbmV4dC9zdGF0aWMvY2h1bmtzL3JlYWN0LXJlZnJlc2guanM/dHM9MTY4MTMzOTYwNjY0NiI+PC9zY3JpcHQ+PHNjcmlwdCBpZD0iX19ORVhUX0RBVEFfXyIgdHlwZT0iYXBwbGljYXRpb24vanNvbiI+eyJwcm9wcyI6eyJwYWdlUHJvcHMiOnsic3RhdHVzQ29kZSI6NDA0fX0sInBhZ2UiOiIvX2Vycm9yIiwicXVlcnkiOnt9LCJidWlsZElkIjoiZGV2ZWxvcG1lbnQiLCJydW50aW1lQ29uZmlnIjp7Ik5FWFRfUFVCTElDX0dRTF9QQVRIIjoiMzAwNi1kZWVwZm91bmRhdGlvbi1kZXYtNHBvenExZWNxdjIud3MtZXU5My5naXRwb2QuaW8vZ3FsIiwiTkVYVF9QVUJMSUNfR1FMX1NTTCI6IjEifSwiaXNGYWxsYmFjayI6ZmFsc2UsImdpcCI6dHJ1ZSwic2NyaXB0TG9hZGVyIjpbXX08L3NjcmlwdD48L2JvZHk+PC9odG1sPg==`}
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