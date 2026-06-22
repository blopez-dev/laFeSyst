import SvgIcon from './SvgIcon'

interface IconLinkProps {
  href: string
  label: string
  icon:
    | { type: 'svg'; name: string }
    | { type: 'img'; src: string; className?: string }
}

function IconLink({ href, label, icon }: IconLinkProps) {
  return (
    <li>
      <a href={href} target="_blank">
        {icon.type === 'svg' ? (
          <SvgIcon name={icon.name} className="button-icon" />
        ) : (
          <img className={icon.className ?? 'button-icon'} src={icon.src} alt="" />
        )}
        {label}
      </a>
    </li>
  )
}

export default IconLink
