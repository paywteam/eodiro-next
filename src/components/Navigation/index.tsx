import { VerticalThreeDotsIcon } from '@/components/icons'
import EodiroLogo from '@/components/icons/EodiroLogo'
import mergeClassName from '@/modules/merge-class-name'
import { AuthContext } from '@/pages/_app'
import React, { useContext, useState } from 'react'
import './Navigation.scss'
import { NavigationContext } from './NavigationContext'

export * from './NavigationContext'

type NavItemProps = {
  className?: string
  to: string
  title: string
}

const NavItem: React.FC<NavItemProps> = ({ to, title, className }) => {
  return (
    <a className={mergeClassName('en-menu-link', className)} href={to}>
      <li className="en-menu-item">{title}</li>
    </a>
  )
}

const Navigation: React.FC = () => {
  const [isMobileNavMenuOpened, setIsMobileNavMenuOpened] = useState(false)
  const navContext = useContext(NavigationContext)

  const isSigned = useContext(AuthContext).isSigned

  return (
    <nav id="eodiro-navigation">
      <div
        className={mergeClassName(
          'en-bar',
          (navContext.isScrolled || isMobileNavMenuOpened) && 'scrolled'
        )}
      />

      <div className="en-wrapper">
        <a className="home-link" href="/">
          <EodiroLogo className="eodiro-logo" fill="#ff3852" />
        </a>

        <h1
          className={mergeClassName(
            'page-app-title',
            !navContext.isHidden && 'show'
          )}
        >
          {navContext.pageAppTitle}
        </h1>

        <ul
          className={mergeClassName(
            'en-menus-container',
            isMobileNavMenuOpened ? 'opened' : ''
          )}
        >
          <NavItem title="빈 강의실" to="/vacant" />
          <NavItem title="강의 검색" to="/lectures" />
          <NavItem title="학식 메뉴" to="/cafeteria" />
          <NavItem title="빼빼로 광장" to="/" />
          <NavItem
            title={isSigned ? '마이페이지' : '로그인'}
            className={isSigned ? 'my' : 'signin'}
            to={isSigned ? '/my' : '/signin'}
          />
        </ul>

        <div className="more-tappable">
          <VerticalThreeDotsIcon
            className="more-icon"
            onClick={(): void => {
              setIsMobileNavMenuOpened(!isMobileNavMenuOpened)
            }}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navigation
