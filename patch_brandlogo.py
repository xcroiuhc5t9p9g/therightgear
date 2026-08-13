import re

with open("src/components/BrandLogo.tsx", "r") as f:
    content = f.read()

# Just use the master for both variants for now, since we couldn't create variants reliably via bash.
# Wait, the prompt says: "update the Header logo source to: /brand/the-right-gear-logo-master.png
# Do NOT use fallback"
new_src = "const src = '/brand/the-right-gear-logo-master.png';"
content = re.sub(r"const src = variant === 'light-bg'.*?: '/brand/the-right-gear-logo-on-dark\.png';", new_src, content, flags=re.DOTALL)

with open("src/components/BrandLogo.tsx", "w") as f:
    f.write(content)
