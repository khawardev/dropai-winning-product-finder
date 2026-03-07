# Landing Page UI/UX Prompt

## Objective
Design and implement new pages using the dark, neon-glowing modern aesthetic of the primary landing page (`app/page.tsx`). Do not use light modes or generic shadcn light theme defaults. 

## Core Characteristics

### 1. Color Palette & Theming
- **Background**: Deep space dark background, primarily `bg-[#030014]`.
- **Text Primary**: `text-white` or `text-slate-200` for primary reading.
- **Text Secondary**: `text-slate-400` or `text-slate-500` for descriptions and secondary text.
- **Accents**: Neon gradients using Tailwind colors `violet` (`violet-400`, `violet-500`, `violet-600`), `fuchsia`, `emerald`, and `indigo`.
- **Gradients**: Text gradients like `text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400`.
- **Selection**: `selection:bg-violet-500/30`.

### 2. Glows & Blurs
- Use absolute positioning with negative `z-index` to place blurred shapes behind components to create an ambient glowing effect.
- Example: `<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px]" />`.
- Cards and active elements can have subtle intrinsic glows: `shadow-[0_0_30px_rgba(124,58,237,0.15)]`.
- On-hover glow effects for primary buttons: `hover:shadow-[0_0_60px_rgba(124,58,237,0.6)]`.

### 3. Glassmorphism & Components
- **Cards/Containers**: Use semi-transparent backgrounds with thin borders and structural blurs.
  - Example wrapper: `bg-[#0d0a2b]/80 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden backdrop-blur-xl` OR `bg-white/[0.03] border-white/10 backdrop-blur-sm`.
- **Buttons**:
  - Primary Action: `bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] transition-all border border-violet-400/20`.
  - Secondary/Ghost: `text-slate-300 hover:text-white hover:bg-white/5` or `bg-white/10 text-white hover:bg-white/20`.
- **Inputs**:
  - `bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50`.

### 4. Animations
- Smooth transitions on opacity and position using `framer-motion` or Tailwind `animate-in fade-in duration-500`.
- Pulse animations for glow elements (`animate-pulse`).
- Transitions on interactive components (`transition-all duration-300`, `hover:scale-105`, `hover:-translate-y-1`).

## Implementation Checklist for New Pages

1. **Page Wrapper**: Inherit the global theme wrapper.
   ```tsx
   <div className="min-h-screen bg-[#030014] text-slate-200 relative overflow-hidden selection:bg-violet-500/30">
   ```
2. **Background Orbs**: Add the ambient background blurs behind everything by positioning them absolutely.
3. **Form Containers/Cards**: Use the glassmorphism aesthetic for the form container (`bg-[#0d0a2b]/80 border-white/10 backdrop-blur-xl shadow-2xl`).
4. **Icons & Controls**: Update default icons and input fields to follow the dark glass motif. Replace primary classes with dark mode equivalents explicitly if components don't magically adapt.
5. **Brand Logo**: Ensure the brand logo points home and uses the same scale/hover animations as the landing layout.
