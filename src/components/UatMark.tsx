export default function UatMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="UAT Workspace mark">
      <rect x="4" y="39" width="12" height="22" rx="6" fill="#8FAEA6" />
      <rect x="23" y="31" width="12" height="38" rx="6" fill="#F6D6A4" />
      <rect x="42" y="18" width="16" height="64" rx="8" fill="#201B19" />
      <rect x="65" y="33" width="12" height="36" rx="6" fill="#E84D39" />
      <rect x="84" y="40" width="12" height="20" rx="6" fill="#8FAEA6" />
    </svg>
  );
}
