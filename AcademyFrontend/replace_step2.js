const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/onboarding/components/Step2.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  'bg-white/5 border-white/10': 'bg-[var(--bg-secondary)] border-[var(--border-default)]',
  'bg-white/5 border border-white/10': 'bg-[var(--bg-secondary)] border border-[var(--border-default)]',
  'text-white': 'text-[var(--text-primary)]',
  'text-slate-500': 'text-[var(--text-secondary)]',
  'text-slate-400': 'text-[var(--text-secondary)]',
  'bg-white/10': 'bg-[var(--bg-tertiary)]',
  'bg-[#0A0F1C]': 'bg-[var(--bg-primary)]',
  'border-white/5': 'border-[var(--border-default)]',
  'text-indigo-400': 'text-[var(--brand-500)]',
  'border-indigo-500': 'border-[var(--brand-500)]',
  'bg-indigo-500/20': 'bg-[var(--brand-50)]',
  'focus:border-indigo-500': 'focus:border-[var(--brand-500)]',
  'focus:ring-indigo-500/50': 'focus:ring-[var(--brand-500)]',
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Step2 replacements complete');
