import React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPasswordResetToken } from '../services/operations/authAPI'
import { BiArrowBack } from 'react-icons/bi'
function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.auth)

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent))
    }

    return (
        <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
            {loading ? (
                <div className='spinner'></div>
            ) : (
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-[1.85rem] font-semibold leading-[2.375rem] text-richblack-100'>
                        {!emailSent ? "Reset Your Password" : "Check email"}

                    </h1>
                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>
                        {!emailSent
                            ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                            : `We have sent the reset email to ${email}`}
                    </p>
                    <form onSubmit={handleSubmit}>
                        {!emailSent && (
                            <label className='w-full'>
                                <p className='mb-1 text-[0.85rem] leading-[1.375rem] text-richblack-5'>Email Address <sup className="text-pink-200">*</sup></p>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className='w-full form-style'

                                />
                            </label>
                        )}

                        <button type='submit' className='mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900'>
                            {!emailSent ? "Submit" : "Resend email"}
                        </button>
                    </form>
                    <div>
                        <Link to="/login">
                            <p className="flex items-center gap-x-2 text-richblack-5">
                                <BiArrowBack /> Back To Login
                            </p>
                        </Link>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ForgotPassword
