export function Skeleton({ width = '100%', height = '16px', rounded = 'rounded-lg', className = '' }) {
  return (
    <div
      className={`skeleton ${rounded} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Skeleton width="40%" height="12px" />
      <Skeleton width="70%" height="28px" />
      <Skeleton width="90%" height="10px" />
      <Skeleton width="60%" height="10px" />
    </div>
  )
}

export function SkeletonStatRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

export function SkeletonWaitCard() {
  return (
    <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '60%' }}>
        <Skeleton width="100%" height="16px" />
        <Skeleton width="40%" height="12px" />
      </div>
      <Skeleton width="40px" height="24px" rounded="rounded-md" />
    </div>
  )
}

export function SkeletonMenuGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Skeleton width="100%" height="80px" rounded="rounded-xl" />
          <Skeleton width="70%" height="14px" />
          <Skeleton width="40%" height="14px" />
        </div>
      ))}
    </div>
  )
}
