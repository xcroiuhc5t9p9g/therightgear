import re

with open('server.ts', 'r') as f:
    content = f.read()

# SEO fallbacks
seo_regex = re.compile(r"\} else if \(cleanPath\.startsWith\('/cars/bmw/m3/e30/sport-evolution'\).*?\} else if \(cleanPath === '/brands/bmw' \|\| cleanPath === '/manufacturer/bmw'\) \{.*?\}\s*(// Fallback for missing routes)", re.DOTALL)
content = seo_regex.sub(r"} \1", content)

with open('server.ts', 'w') as f:
    f.write(content)
