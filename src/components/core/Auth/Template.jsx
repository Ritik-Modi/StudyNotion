import React from 'react'
import { useSelector } from 'react-redux'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import frameImg from '../../../assets/Images/frame.png'

function Template({ title, description1, description2, img, formType }) {
    const { loading } = useSelector((state) => state.auth)
    return (

        <div className='grid place-items-center min-h-[calc(100vh-3.5rem)]'>
            {loading
                ? (
                    <div className='spinner'></div>
                ) : (
                    <div className='flex flex-col-reverse justify-between w-11/12 py-12 max-auto max-w-maxContent md:flex-row gap-y-12 md:gap-y-0 md:gap-x-12 '>
                        <div className='w-11/12 mx-auto md:mx-0 max-w-[450px]'>
                            <h1 className='text-[1.85rem] font-semibold text-richblack-5 loading-[2.375rem]'>{title}</h1>
                            <p className='mt-4 text-[1.125rem] loading-[1.625rem]'>
                                <span className='text-richblack-100'>{description1}</span>{" "}
                                <span className='italic font-bold text-blue-100 font-edu-sa'>{description2}</span>
                            </p>
                            {formType === 'login' ? <LoginForm /> : <SignupForm />}
                        </div>
                        <div className='relative mx-auto w-11/12 max-w-[450px] md:mx-0'>
                            <img
                                src={frameImg}
                                alt="pattern"
                                width={558}
                                height={504}
                                loading='lazy'
                            />
                            <img
                                src={img}
                                alt="student"
                                width={558}
                                height={504}
                                loading='lazy'
                                className='absolute z-10 -top-4 right-4'
                            />
                        </div>
                    </div>
                )}
        </div>
    )
}

export default Template
