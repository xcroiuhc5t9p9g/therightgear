import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Update the condition for ExplorePage
content = re.sub(
    r"\{\(currentPage === 'explore' \|\| currentPage === 'catalog' \|\| currentPage === 'templates'\) && \(",
    r"{(currentPage === 'explore' || currentPage === 'catalog' || currentPage === 'templates' || currentPage === 'brands' || currentPage === 'maker' || currentPage === 'model' || currentPage === 'generation') && (",
    content
)

with open("src/App.tsx", "w") as f:
    f.write(content)

