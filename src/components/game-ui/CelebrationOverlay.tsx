interface CelebrationOverlayProps {
  show: boolean;
  emojis?: string;
}

export default function CelebrationOverlay({
  show,
  emojis = '🎉 🎊 🌟'
}: CelebrationOverlayProps) {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '5em',
      animation: 'pulse 1s ease-in-out',
      zIndex: 1000
    }}>
      {emojis}
    </div>
  );
}
