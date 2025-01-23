// Just used to simulate how the sticky elements behave on a real page transitioning to and from other content.
export default function ArbitrarySection() {
  return (
    <div className='flex h-[300px] w-full items-center justify-center sm:h-[500px]'>
      <h2 className='text-4xl font-bold md:text-7xl'>Section</h2>
    </div>
  )
}
