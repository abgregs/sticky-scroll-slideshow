import { containerClasses } from '@/utils'
import clsx from 'clsx'

// Just some grid lines to illustrate our spacing and alignment.
export default function Guides() {
  return (
    <div className='fixed inset-0'>
      <div className={clsx(containerClasses, 'h-screen')}>
        <div
          style={{
            gridAutoFlow: 'column'
          }}
          className='grid h-screen grid-flow-row grid-cols-2 md:grid-cols-4'
        >
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='hidden h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y md:block'
          />
          <div
            style={{ backgroundSize: '1px 8px' }}
            className='hidden h-full w-[1px] bg-gradient-to-b from-gray-400/30 via-gray-400/20 to-transparent bg-repeat-y md:block'
          />
        </div>
      </div>
    </div>
  )
}
