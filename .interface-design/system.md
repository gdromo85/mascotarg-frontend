Direction and Feel
- Clinical vet interface with calm, precise hierarchy.
- Surfaces feel matte and layered; color palette evokes scrubs, antiseptic teal, and warm amber accents.
- Emphasis on fast reading of patient state and actions.

Depth Strategy
- Borders + subtle shadow only (no heavy gradients as primary surfaces).
- Cards use `border border-slate-200` with `shadow-sm` and hover `shadow-md`.
- Modals use `bg-black/40` overlay with `backdrop-blur-sm` and bordered containers.

Spacing Base Unit
- 4px base; common paddings: 16, 24, 32.

Palette (Tailwind)
- Primary actions: `bg-emerald-600` hover `bg-emerald-700`
- Secondary actions: `bg-teal-700` hover `bg-teal-800`
- Neutral actions: `bg-slate-800` hover `bg-slate-900`
- Alerts/notes: `bg-amber-600` hover `bg-amber-700`
- Background: `bg-gradient-to-br from-emerald-50 via-slate-50 to-amber-50`
- Panels: `bg-white/90` with `border-slate-200`

Key Component Patterns
- Page header: gradient `from-emerald-700 to-teal-700`, `rounded-2xl`, `border border-white/10`, icon capsule `bg-white/15 ring-1 ring-white/20`.
- Cards: `bg-white/90 rounded-2xl border border-slate-200 shadow-sm` with hover `shadow-md`.
- Filters/inputs: `bg-slate-50 border border-slate-200` with focus `border-emerald-500` and `bg-white`.
- Tables: borders `border-slate-200`, row hover `hover:bg-slate-50`, tags `bg-emerald-100 text-emerald-800`.
