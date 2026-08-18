import re
import os

files = ["src/pages/VehicleDetailPage.tsx", "src/pages/EntityDetailPage.tsx"]

replacements = [
    (r'bg-\[#121520\]', 'bg-[#171A1F]'),
    (r'bg-\[#121622\]', 'bg-[#171A1F]'),
    (r'bg-\[#161b29\]', 'bg-[#0B0D10]'),
    (r'bg-\[#181f30\]', 'bg-[#0B0D10]'),
    (r'bg-\[#182030\]', 'bg-[#0B0D10]'),
    (r'bg-\[#181d2a\]', 'bg-[#0B0D10]'),
    (r'bg-\[#1a2130\]', 'bg-[#0B0D10]'),
    (r'bg-\[#171b29\]', 'bg-[#171A1F]'),
    (r'bg-\[#111420\]', 'bg-[#0B0D10]'),
    (r'bg-\[#0d101a\]', 'bg-[#0B0D10]'),
    (r'bg-\[#1a2030\]', 'bg-[#0B0D10]'),
    (r'bg-\[#1d2232\]', 'bg-[#171A1F]'),
    (r'bg-\[#171b28\]', 'bg-[#0B0D10]'),
    (r'bg-\[#161a26\]', 'bg-[#0B0D10]'),
    
    (r'border-\[#22293a\]', 'border-[#2B303B]'),
    (r'border-\[#23293a\]', 'border-[#2B303B]'),
    (r'border-\[#232d42\]', 'border-[#2B303B]'),
    (r'border-\[#29344c\]', 'border-[#2B303B]'),
    (r'border-\[#2b364e\]', 'border-[#2B303B]'),
    (r'border-\[#2b354d\]', 'border-[#2B303B]'),
    (r'border-\[#2a344a\]', 'border-[#2B303B]'),
    (r'border-\[#232a3d\]', 'border-[#2B303B]'),
    (r'border-\[#283248\]', 'border-[#2B303B]'),
    (r'border-\[#222838\]', 'border-[#2B303B]'),
    (r'border-\[#303950\]', 'border-[#2B303B]'),
    (r'border-\[#252e42\]', 'border-[#2B303B]'),
    (r'border-\[#242c3f\]', 'border-[#2B303B]'),
    (r'border-\[#202738\]', 'border-[#2B303B]'),
    (r'border-\[#1c2233\]', 'border-[#2B303B]'),
    
    (r'hover:bg-\[#222a3d\]', 'hover:bg-[#1C2029]'),
    (r'hover:bg-\[#252c42\]', 'hover:bg-[#1C2029]'),
    (r'hover:bg-\[#1f2536\]', 'hover:bg-[#1C2029]'),
    
    (r'text-red-400', 'text-[#D71920]'),
    (r'text-red-300', 'text-[#D71920]'),
    (r'text-red-500', 'text-[#D71920]'),
    (r'bg-red-500', 'bg-[#D71920]'),
    (r'bg-red-600', 'bg-[#D71920]'),
    (r'hover:bg-red-500', 'hover:bg-[#E63B44]'),
    (r'hover:text-red-400', 'hover:text-[#E63B44]'),
    (r'border-red-500/50', 'border-[#D71920]/50'),
    (r'border-red-500/30', 'border-[#D71920]/30'),
    (r'border-red-500/40', 'border-[#D71920]/40'),
    (r'shadow-red-600/10', 'shadow-[#D71920]/10'),
    (r'shadow-red-600/20', 'shadow-[#D71920]/20'),
]

for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        with open(filepath, 'w') as f:
            f.write(content)

