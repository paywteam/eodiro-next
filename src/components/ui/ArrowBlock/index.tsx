import { ArrowIcon } from '@/components/icons'
import mergeClassName from '@/modules/merge-class-name'
import React from 'react'
import './ArrowBlock.scss'

interface ArrowBlockProps {
  className?: string
  noArrow?: boolean
  flat?: boolean
}

export const ArrowBlock: React.FC<ArrowBlockProps> = ({
  className,
  noArrow = false,
  flat = false,
  children,
}) => {
  return (
    <div
      className={mergeClassName('arrow-block', className, !flat && 'unflat')}
    >
      <div className="ab-body">{children}</div>
      {!noArrow && (
        <div className="ab-arrow-container">
          <ArrowIcon direction="right" className="ab-arrow" />
        </div>
      )}
    </div>
  )
}
