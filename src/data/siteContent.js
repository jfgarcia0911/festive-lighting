// All editable site content lives here — separated from the components that
// render it. Change copy or pricing here without touching any component.

export const SERVICES = [
  { icon: '🎄', title: 'Holiday Lighting', text: 'Festive seasonal displays installed, maintained, and removed — you enjoy, we handle everything.' },
  { icon: '🏡', title: 'Permanent Lighting', text: 'Year-round programmable lighting that looks built-in. Control colors and scenes from your phone.' },
  { icon: '🏢', title: 'Commercial & Events', text: 'Storefronts, offices, and venues lit to impress customers and guests all season long.' },
]

export const GALLERY = [
  { emoji: '🏠', label: 'Classic Roofline', tag: 'Residential' },
  { emoji: '🎄', label: 'Full Holiday Display', tag: 'Residential' },
  { emoji: '✨', label: 'Tree Wrapping', tag: 'Landscape' },
  { emoji: '🏢', label: 'Storefront Lights', tag: 'Commercial' },
  { emoji: '❄️', label: 'Winter Wonderland', tag: 'Events' },
  { emoji: '💡', label: 'Permanent Eaves', tag: 'Year-Round' },
]

export const STEPS = [
  { n: '1', title: 'Free Consultation', text: 'Tell us your vision and get a transparent quote — no obligation.' },
  { n: '2', title: 'Professional Install', text: 'Our insured crew installs everything safely and on schedule.' },
  { n: '3', title: 'Enjoy & Relax', text: 'We maintain it all season and take it down for you. Zero hassle.' },
]

export const PACKAGES = {
  classic:    { label: 'Classic Holiday', rate: 12 },
  premium:    { label: 'Premium Holiday', rate: 18 },
  permanent:  { label: 'Permanent Lighting', rate: 30 },
  commercial: { label: 'Commercial / Events', rate: 0 },
}