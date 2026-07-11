const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  'bg-[#5b657a]': 'bg-[var(--bg-secondary)]',
  'bg-[#F4F7FE]': 'bg-[var(--bg-secondary)]',
  'bg-slate-900': 'bg-[var(--bg-primary)]',
  'bg-white': 'bg-[var(--bg-primary)]',
  'text-slate-800': 'text-[var(--text-primary)]',
  'text-slate-700': 'text-[var(--text-primary)]',
  'text-slate-600': 'text-[var(--text-secondary)]',
  'text-slate-500': 'text-[var(--text-secondary)]',
  'text-slate-400': 'text-[var(--text-tertiary)]',
  'text-slate-300': 'text-[var(--text-tertiary)]',
  'border-slate-200': 'border-[var(--border-default)]',
  'border-slate-100': 'border-[var(--border-subtle)]',
  'border-slate-50': 'border-[var(--border-subtle)]',
  'bg-slate-50': 'bg-[var(--bg-secondary)]',
  'bg-slate-100': 'bg-[var(--bg-tertiary)]',
  'hover:bg-slate-50': 'hover:bg-[var(--bg-secondary)]',
  'hover:bg-slate-100': 'hover:bg-[var(--bg-tertiary)]',
  'hover:text-slate-900': 'hover:text-[var(--text-primary)]',
  'hover:text-slate-500': 'hover:text-[var(--text-secondary)]',
  'text-indigo-600': 'text-[var(--brand-500)]',
  'text-indigo-500': 'text-[var(--brand-500)]',
  'bg-indigo-600': 'bg-[var(--brand-500)]',
  'bg-indigo-500': 'bg-[var(--brand-500)]',
  'bg-indigo-100': 'bg-[var(--brand-100)]',
  'bg-indigo-50': 'bg-[var(--brand-50)]',
  'border-indigo-600': 'border-[var(--brand-500)]',
  'border-indigo-500': 'border-[var(--brand-500)]',
  'border-indigo-200': 'border-[var(--brand-200)]',
  'border-indigo-100': 'border-[var(--brand-100)]',
  'hover:bg-indigo-700': 'hover:bg-[var(--brand-600)]',
  'focus:ring-indigo-500/20': 'focus:ring-[var(--brand-500)]',
  'focus:border-indigo-500': 'focus:border-[var(--brand-500)]',
  'shadow-indigo-500/20': 'shadow-[var(--brand-glow)]',
  'text-blue-600': 'text-[var(--info)]',
  'bg-blue-600': 'bg-[var(--info)]',
  'text-emerald-500': 'text-[var(--success)]',
  'bg-emerald-50': 'bg-[var(--success-light)]',
  'text-emerald-600': 'text-[var(--success)]',
  'text-rose-500': 'text-[var(--error)]',
  'bg-rose-50': 'bg-[var(--error-light)]',
  'text-rose-600': 'text-[var(--error)]',
  'text-amber-500': 'text-[var(--warning)]',
  'text-amber-600': 'text-[var(--warning)]',
  'bg-amber-50': 'bg-[var(--warning-light)]',
  'bg-amber-100': 'bg-[var(--warning-light)]',
  'border-rose-100': 'border-[var(--error-light)]',
  'shadow-blue-500/30': 'shadow-md',
  'shadow-blue-500/20': 'shadow-sm',
  'focus:ring-blue-500/20': 'focus:border-[var(--info)]',
};

// Also replace generic strings
for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

// Special fixes
content = content.replace(/stroke="#6366f1"/g, 'stroke="var(--brand-500)"');
content = content.replace(/fill="#6366f1"/g, 'fill="var(--brand-500)"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements complete');
