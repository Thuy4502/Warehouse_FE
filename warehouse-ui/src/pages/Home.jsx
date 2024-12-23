import React from 'react'
import ProjectStatistic from '../components/Statistic'
import Achievement from '../components/Achivement'
import TopExport from '../components/TopExport'
import InventoryReport from './InventoryReport'


const Home = () => {
  return (
    <div className='p-5'>
      <div className='w-full mb-8'>
        <Achievement />
      </div>
      <div className='w-full grid md:grid-cols-2 gap-4'>
        <div className='bg-gray-100'>
          <ProjectStatistic />
        </div>
        <div className='bg-white-200'>
          <TopExport />
        </div>
      </div>

      <div className='w-full'>
        <InventoryReport />
      </div>
    </div>

  )
}

export default Home