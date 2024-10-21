import React from 'react'
import ProjectStatistic from '../components/Statistic'
import Achievement from '../components/Achivement'
import TopExport from '../components/TopExport'


const Home = () => {
  return (
    <div className='p-5'>
      <div className='w-full mb-8'>
        <Achievement />
      </div>
      <div className='w-full flex md:space-x-4'>
        <div className='w-full md:w-1/2'>
          <ProjectStatistic />
        </div>
        <div className='w-full md:w-1/2'>
          <TopExport />
        </div>
      </div>


    </div>

  )
}

export default Home