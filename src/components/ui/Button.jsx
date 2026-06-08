const BASE =
  'inline-flex items-center justify-center rounded-full font-semibold cursor-pointer transition hover:-translate-y-0.5'

const VARIANTS = {
  gold:  'px-7 py-3.5 text-[15px] text-[#2a1a00] bg-[linear-gradient(135deg,#ffd166,#f4a836)] shadow-[0_10px_30px_rgba(244,168,54,0.35)]',
  ghost: 'px-7 py-3.5 text-[15px] text-slate-100 border border-white/10 hover:bg-white/5',
  small: 'px-[18px] py-2.5 text-sm text-[#2a1a00] bg-[linear-gradient(135deg,#ffd166,#f4a836)]',
}

export default function Button({ as = 'a', variant = 'gold', full = false, className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag className={`${BASE} ${VARIANTS[variant]} ${full ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  )
}