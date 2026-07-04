import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Derived from the AliBrothers logo's red accent (#c8302b)
const brand: MantineColorsTuple = [
  '#fcf3f2',
  '#f5dad9',
  '#ecb9b7',
  '#e49895',
  '#da726f',
  '#d04f4b',
  '#c8302b',
  '#b02a26',
  '#982421',
  '#801f1c'
]

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  defaultRadius: 'sm'
})
