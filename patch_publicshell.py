import re

with open("src/components/PublicShell.tsx", "r") as f:
    content = f.read()

content = re.sub(r'activeRole=\{activeRole\}\s*setActiveRole=\{setActiveRole\}', '', content)

with open("src/components/PublicShell.tsx", "w") as f:
    f.write(content)
