import { Card, Divider, Group, Image, Stack, Text, Title } from '@mantine/core'
import xcorpionLogo from '../assets/xcorpion.png'

const AGREEMENT_PARAGRAPHS = [
  `This software, "AliBrothers Tracker" (the "Software"), was developed by Chathura Prasanga ("the Developer") at the personal request of Mr. U.M.T.S.L. Abeysinghe ("the Requester"), who engaged the Developer independently to support his work as a part-time associate. This is a private arrangement between the Developer and the Requester; there is no direct contractual relationship between the Developer and any company.`,
  `The Software makes use of a company logo solely for the Requester's convenience and internal use. This does not constitute an endorsement, contractual obligation, or involvement by that company in the development, ownership, or licensing of the Software.`,
  `All intellectual property rights in the Software are owned exclusively by the Developer. The Software is licensed for use solely by the Developer and the Requester. Commercial use, redistribution, sublicensing, or resale of the Software, in whole or in part, is strictly prohibited without the Developer's prior written consent.`,
  `Neither the Developer nor the Requester shall be held liable for any use, misuse, or reliance on the Software by the company or any third party.`,
  `By installing or using this Software, you acknowledge and agree to the terms above.`
]

export function About(): React.JSX.Element {
  return (
    <Stack maw={720}>
      <Title order={2}>About</Title>

      <Card withBorder padding="lg">
        <Group>
          <Image src={xcorpionLogo} alt="xcorpion" w={64} h={64} fit="contain" />
          <div>
            <Text fw={700} size="lg">
              AliBrothers Tracker
            </Text>
            <Text size="sm" c="dimmed">
              Version {__APP_VERSION__}
            </Text>
            <Text size="sm" c="dimmed">
              by xcorpion
            </Text>
          </div>
        </Group>
      </Card>

      <Card withBorder padding="lg">
        <Title order={4} mb="xs">
          Developer
        </Title>
        <Text>Chathura Prasanga</Text>
        <Text size="sm" c="dimmed">
          Phone: 077 925 0108 / 071 135 5531
        </Text>
        <Text size="sm" c="dimmed">
          Email: chathuraprasanga98@gmail.com
        </Text>
      </Card>

      <Card withBorder padding="lg">
        <Title order={4} mb="xs">
          Requested By
        </Title>
        <Text>U.M.T.S.L. Abeysinghe</Text>
        <Text size="sm" c="dimmed">
          Phone: 074 101 4407
        </Text>
        <Text size="sm" c="dimmed">
          Email: sahant383@gmail.com
        </Text>
      </Card>

      <Card withBorder padding="lg">
        <Title order={4} mb="sm">
          Software Ownership &amp; License Notice
        </Title>
        <Stack gap="sm">
          {AGREEMENT_PARAGRAPHS.map((paragraph, index) => (
            <Text key={index} size="sm" c="dimmed">
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Card>

      <Divider />
      <Text size="xs" c="dimmed">
        © {new Date().getFullYear()} xcorpion. All rights reserved.
      </Text>
    </Stack>
  )
}
