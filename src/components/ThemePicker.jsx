const THEME_COLORS = {
  matrix: '#39ff14',
  green: '#00ff41',
  amber: '#ffb000',
  solarized: '#268bd2',
};

export default function ThemePicker({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }} title="Switch theme">
      {Object.entries(THEME_COLORS).map(([name, color]) => (
        <button
          key={name}
          className={`theme-dot${current === name ? ' active' : ''}`}
          style={{ background: color, color }}
          onClick={() => onChange(name)}
          aria-label={`Switch to ${name} theme`}
          title={name}
        />
      ))}
    </div>
  );
}
