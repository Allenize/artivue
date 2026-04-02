export default function SwirlLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sl1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#E8B84B"/><stop offset="40%" stopColor="#C4622D"/><stop offset="100%" stopColor="#7B3FA0"/></radialGradient>
        <radialGradient id="sl2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4A8FE8"/><stop offset="100%" stopColor="#2A4AC4"/></radialGradient>
        <radialGradient id="sl3" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3ABFA0"/><stop offset="100%" stopColor="#1A7A60"/></radialGradient>
      </defs>
      <circle cx="40" cy="40" r="37" fill="none" stroke="url(#sl1)" strokeWidth="2.5"/>
      <path d="M40,12 C56,12 66,24 64,38 C62,52 48,58 40,56 C32,54 25,44 27,35 C29,26 38,22 44,25 C50,28 52,36 48,43 C45,50 37,50 33,45" fill="none" stroke="url(#sl1)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="40" r="7" fill="url(#sl2)" opacity="0.9"/>
      <circle cx="40" cy="40" r="3.5" fill="#FAF0DC"/>
      <circle cx="40" cy="14" r="2" fill="url(#sl3)" opacity="0.8"/>
      <circle cx="64" cy="26" r="1.5" fill="#E8B84B" opacity="0.7"/>
      <circle cx="16" cy="54" r="1.5" fill="#7B3FA0" opacity="0.6"/>
    </svg>
  )
}
