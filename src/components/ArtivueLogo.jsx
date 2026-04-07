export default function ArtivueLogo({ size = 80 }) {
  return (
    <img
      src="/artivue-logo.png"
      alt="Artistic Vision"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
