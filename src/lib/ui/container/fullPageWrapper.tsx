import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function FullPageWrapper({children}: Props) {
  return (
    <div className='w-screen h-screen'>
      {children}
    </div>
  )
}
