import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove remaining SEO blocks starting at sport-evolution
seo_regex = re.compile(r"\} else if \(cleanPath\.startsWith\('/cars/bmw/m3/e30/sport-evolution'\).*?(?=\} else if \(cleanPath\.startsWith\('/entity/'\)\) \{)", re.DOTALL)
content = seo_regex.sub("", content)

with open('server.ts', 'w') as f:
    f.write(content)
