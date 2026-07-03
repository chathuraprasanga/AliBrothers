const [major, minor] = process.versions.node.split('.').map(Number)

const satisfies = (major === 20 && minor >= 19) || (major === 22 && minor >= 12) || major > 22

if (!satisfies) {
  console.error(`
✖ This project requires Node ^20.19.0 or >=22.12.0 (Vite 7's minimum).
  You're running Node ${process.versions.node}.

  This repo pins Node 22.19.0 via .nvmrc. Switch to it with:

    nvm use

  (or: export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use)
`)
  process.exit(1)
}