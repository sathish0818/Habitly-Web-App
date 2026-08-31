type IconProps = {
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function Icon({ name, className = "", style }: IconProps) {
  return (
    <span className={`material-symbols-rounded ${className}`} style={style}>
      {name}
    </span>
  );
}
