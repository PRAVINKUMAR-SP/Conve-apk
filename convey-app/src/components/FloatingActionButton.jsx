export default function FloatingActionButton({ onClick, icon = '💬' }) {
  return (
    <div className="fab" onClick={onClick}>
      {icon}
    </div>
  )
}
