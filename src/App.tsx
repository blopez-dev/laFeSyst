import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import SvgIcon from './components/SvgIcon'
import IconLink from './components/IconLink'
import './App.css'

const docLinks = [
  { href: 'https://vite.dev/', label: 'Explore Vite', icon: { type: 'img' as const, src: viteLogo, className: 'logo' } },
  { href: 'https://react.dev/', label: 'Learn more', icon: { type: 'img' as const, src: reactLogo } },
]

const socialLinks = [
  { href: 'https://github.com/vitejs/vite', label: 'GitHub', icon: { type: 'svg' as const, name: 'github-icon' } },
  { href: 'https://chat.vite.dev/', label: 'Discord', icon: { type: 'svg' as const, name: 'discord-icon' } },
  { href: 'https://x.com/vite_js', label: 'X.com', icon: { type: 'svg' as const, name: 'x-icon' } },
  { href: 'https://bsky.app/profile/vite.dev', label: 'Bluesky', icon: { type: 'svg' as const, name: 'bluesky-icon' } },
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <SvgIcon name="documentation-icon" className="icon" />
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            {docLinks.map((link) => (
              <IconLink key={link.href} {...link} />
            ))}
          </ul>
        </div>
        <div id="social">
          <SvgIcon name="social-icon" className="icon" />
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            {socialLinks.map((link) => (
              <IconLink key={link.href} {...link} />
            ))}
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
