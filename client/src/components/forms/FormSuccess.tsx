import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
interface IFormSuccessProps {
    text: string
}

const FormSuccess = ({text}: IFormSuccessProps) => {
  return (
    <section className='text-center p-2 mb-2 rounded border border-green-600 bg-green-100'>
        <p className='text-green-700 font-bold'>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span className='ml-1'>{text}</span>
        </p>
    </section>
  )
}

export default FormSuccess