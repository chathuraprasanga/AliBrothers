import { Button, Group, Modal, Text } from '@mantine/core'

interface ConfirmModalProps {
  opened: boolean
  title?: string
  message: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  opened,
  title = 'Confirm delete',
  message,
  confirmLabel = 'Delete',
  onCancel,
  onConfirm
}: ConfirmModalProps): React.JSX.Element {
  return (
    <Modal opened={opened} onClose={onCancel} title={title} centered>
      <Text>{message}</Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  )
}
