import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_nav = """    } else if (page === 'search-result') {
      newPath = params.url;
"""

if "page === 'search-result'" not in content:
    content = content.replace("    } else if (page === 'brands') {", new_nav + "    } else if (page === 'brands') {")

with open("src/App.tsx", "w") as f:
    f.write(content)
