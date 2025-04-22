import React from 'react'

const Notification = ({state}) => {
  return (
    <div className={`mt-4 absolute top-0 left-[50px] ${state?"notify opacity-1":"opacity-0"}`} >
        <p className='bg-green-300 py-2 px-4 rounded shadow duration-75 '>Notification send to <span>dev@qurvii.com</span> </p>
    </div>
  )
}

export default Notification