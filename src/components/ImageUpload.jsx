import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'

export default function ImageUpload({ value, onChange, label = 'Upload Image', height = 160 }) {
  const [drag, setDrag] = useState(false)
  const ref = useRef()

  const handle = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ marginBottom: '.65rem' }}>
      {label && <div style={{ fontSize: 10, color: 'var(--light-text)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>}
      {value ? (
        <div style={{ position: 'relative', borderRadius: 'var(--r-md)', overflow: 'hidden', height }}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => onChange(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={14} />
          </button>
          <button onClick={() => ref.current.click()} style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 10, color: '#fff', cursor: 'pointer', fontFamily: 'Jost,sans-serif', letterSpacing: '.06em' }}>
            Change
          </button>
        </div>
      ) : (
        <div
          className={`upload-zone${drag ? ' drag' : ''}`}
          style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => ref.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
        >
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={18} strokeWidth={1.5} style={{ color: 'var(--light-text)' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--mid-text)' }}>Click or drag & drop image</div>
          <div style={{ fontSize: 10, color: 'var(--light-text)' }}>PNG, JPG, WEBP supported</div>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
    </div>
  )
}
