#!/bin/bash
awk '
/^[ \t]*<button[ \t]*$/ {
  if (in_dropdown) {
    print "              {suggestions.length > 0 ? (";
    print "                suggestions.map((suggestion, idx) => (";
    in_dropdown = 0;
  }
}
/<div className="absolute top-full left-0 right-0 mt-2 bg-white/ {
  in_dropdown = 1;
}
/<div className="absolute left-4 right-4 mt-2 bg-white/ {
  in_dropdown = 1;
}
{ print $0 }
' src/components/Header.tsx > src/components/Header.tsx.fixed
mv src/components/Header.tsx.fixed src/components/Header.tsx
