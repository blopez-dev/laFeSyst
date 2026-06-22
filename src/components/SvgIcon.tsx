interface SvgIconProps {
  name: string
  className?: string
}

function SvgIcon({ name, className }: SvgIconProps) {
  return (
    <svg className={className} role="presentation" aria-hidden="true">
      <use href={`/icons.svg#${name}`}></use>
    </svg>
  )
}

export default SvgIcon
