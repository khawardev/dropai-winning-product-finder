import sys
import glob

replacements = {
    # Backgrounds
    "bg-[#030014]": "bg-background",
    "bg-[#0d0a2b]/80": "bg-card/80",
    "bg-[#0d0a2b]": "bg-card",
    "bg-white/5": "bg-secondary",
    "bg-white/10": "bg-accent",
    "bg-white/[0.02]": "bg-muted",
    "bg-white/[0.03]": "bg-muted",
    "hover:bg-white/5": "hover:bg-secondary",
    "hover:bg-white/10": "hover:bg-accent",
    
    # Text colors
    "text-white": "text-foreground",
    "text-slate-200": "text-foreground",
    "text-slate-300": "text-muted-foreground",
    "text-slate-400": "text-muted-foreground",
    "text-slate-500": "text-muted-foreground",
    "text-slate-600": "text-muted-foreground",
    "placeholder:text-slate-600": "placeholder:text-muted-foreground",
    "hover:text-white": "hover:text-foreground",
    
    # Theme colors for accents
    "text-violet-400": "text-primary",
    "text-violet-500": "text-primary",
    "hover:text-violet-300": "hover:text-primary/80",
    "group-focus-within:text-violet-400": "group-focus-within:text-primary",
    "bg-violet-600": "bg-primary",
    "hover:bg-violet-500": "hover:bg-primary/90",
    "border-violet-400/20": "border-primary/20",
    "border-violet-500/30": "border-primary/30",
    "focus-visible:ring-violet-500": "focus-visible:ring-ring",
    "focus-visible:border-violet-500": "focus-visible:border-primary",
    
    # Borders
    "border-white/10": "border-border",
    "border-white/5": "border-border",
    
    # Destructive
    "bg-red-500/10": "bg-destructive/10",
    "border-red-500/20": "border-destructive/20",
    "text-red-400": "text-destructive",
    
    # Shadows
    "shadow-[0_0_20px_rgba(124,58,237,0.3)]": "shadow-lg shadow-primary/20",
    "shadow-[0_0_30px_rgba(124,58,237,0.5)]": "shadow-xl shadow-primary/30",
    "shadow-[0_0_40px_rgba(124,58,237,0.4)]": "shadow-xl shadow-primary/40",
    "shadow-[0_0_60px_rgba(124,58,237,0.6)]": "shadow-2xl shadow-primary/50",
    
    # Selection
    "selection:bg-violet-500/30": "selection:bg-primary/30",
}

files_to_check = [
    "app/login/page.tsx",
    "app/signup/page.tsx",
    "app/page.tsx"
]

for filepath in files_to_check:
    with open(filepath, "r") as f:
        content = f.read()
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(filepath, "w") as f:
        f.write(content)
        
print("Replacements done for auth and landing pages.")
