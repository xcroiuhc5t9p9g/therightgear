with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Make the header background white
content = content.replace('bg-[#0B0D10]', 'bg-trg-warm-white')
content = content.replace('border-[#2B303B]', 'border-trg-gray-200')
content = content.replace('text-white', 'text-trg-carbon')
content = content.replace('text-slate-400', 'text-trg-gray-500')
content = content.replace('text-slate-300', 'text-trg-carbon')
content = content.replace('bg-[#171A1F]', 'bg-white')
content = content.replace('logo_light.svg', 'logo_dark.svg')

with open("src/components/Header.tsx", "w") as f:
    f.write(content)

