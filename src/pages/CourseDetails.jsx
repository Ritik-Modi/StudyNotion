import CourseDetailCard from '../components/core/Course/CourseDetailCard'
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar'
import ConfirmationModal from '../components/common/ConfirmationModal'
import ReviewSlider from '../components/common/ReviewSlider'
import RatingStars from '../components/common/RatingStars'
import Footer from '../components/common/Footer'
import Error from './Error'
import GetAvgRating from '../utils/avgRating'
import { formatDate } from '../services/formatDate'
import { buyCourse } from '../services/operations/studentFeaturesAPI'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Markdown from "react-markdown"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { BiInfoCircle } from "react-icons/bi"



function CourseDetails() {
    const { user } = useSelector((state) => state.profile)
    const { loading } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const { paymentLoading } = useSelector((state) => state.course)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { courseId } = useParams()

    const [response, setResponse] = useState(null)
    const [confirmationModal, setConfirmationModal] = useState(null)
    const [avgRatingCount, setAvgRatingCount] = useState(0)
    const [isActive, setIsActive] = useState(Array(0))
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)

    // fetch the course Details
    useEffect(() => {
        ; (async () => {
            try {
                const res = await fetchCourseDetails(courseId)
                setResponse(res)

            } catch (error) {
                console.log()

            }
        })()
    }, [courseId])

    // calculate Avg rating count 
    useEffect(() => {
        const count = GetAvgRating(response?.data?.CourseDetails.ratingAndReview)
        setAvgRatingCount(count)
    }, [response])

    //total no of lectures
    useEffect(() => {
        let lecture = 0;
        response?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lecture += sec.subSection.length || 0;
        })
    }, [response])

    // handler function
    const handleActive = (id) => {
        setIsActive(
            isActive.includes(id)
                ? isActive.concat([id])
                : isActive.filter((e) => e != id)
        )
    }

    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch)

        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btnText1: "Login",
            btnText2: "Cancel",
            btnHandler1: () => navigate("/login"),
            btnHandler2: () => setConfirmationModal(null)

        })
    }
    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = response.data?.courseDetails

    if (loading || !response) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }
    if (!response.success) {
        return <Error />
    }
    if (paymentLoading) {

        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }


    return (
        <>
            <div className={`relative w-full bg-richblack-800`}>
                {/* Hero Section */}
                <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                    <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className="relative block max-h-[30rem] lg:hidden">
                            <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                            <img
                                src={thumbnail}
                                alt="course thumbnail"
                                className="w-full aspect-auto"
                            />
                        </div>
                        <div
                            className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
                        >
                            <div>
                                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                                    {courseName}
                                </p>
                            </div>
                            <p className={`text-richblack-200`}>{courseDescription}</p>
                            <div className="flex flex-wrap items-center gap-2 text-md">
                                <span className="text-yellow-25">{avgReviewCount}</span>
                                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                                <span>{`(${ratingAndReviews.length} reviews)`}</span>
                                <span>{`${studentsEnrolled.length} students enrolled`}</span>
                            </div>
                            <div>
                                <p className="">
                                    Created By {`${instructor.firstName} ${instructor.lastName}`}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full gap-4 py-4 border-y border-y-richblack-500 lg:hidden">
                            <p className="pb-4 space-x-3 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>
                            <button className="yellowButton" onClick={handleBuyCourse}>
                                Buy Now
                            </button>
                            <button className="blackButton">Add to Cart</button>
                        </div>
                    </div>
                    {/* Courses Card */}
                    <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                        <CourseDetailsCard
                            course={response?.data?.courseDetails}
                            setConfirmationModal={setConfirmationModal}
                            handleBuyCourse={handleBuyCourse}
                        />
                    </div>
                </div>
            </div>
            <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    {/* What will you learn section */}
                    <div className="p-8 my-8 border border-richblack-600">
                        <p className="text-3xl font-semibold">What you'll learn</p>
                        <div className="mt-5">
                            <Markdown>{whatYouWillLearn}</Markdown>
                        </div>
                    </div>

                    {/* Course Content Section */}
                    <div className="max-w-[830px] ">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] font-semibold">Course Content</p>
                            <div className="flex flex-wrap justify-between gap-2">
                                <div className="flex gap-2">
                                    <span>
                                        {courseContent.length} {`section(s)`}
                                    </span>
                                    <span>
                                        {totalNoOfLectures} {`lecture(s)`}
                                    </span>
                                    <span>{response.data?.totalDuration} total length</span>
                                </div>
                                <div>
                                    <button
                                        className="text-yellow-25"
                                        onClick={() => setIsActive([])}
                                    >
                                        Collapse all sections
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Accordion */}
                        <div className="py-4">
                            {courseContent?.map((course, index) => (
                                <CourseAccordionBar
                                    course={course}
                                    key={index}
                                    isActive={isActive}
                                    handleActive={handleActive}
                                />
                            ))}
                        </div>

                        {/* Author Details */}
                        <div className="py-4 mb-12">
                            <p className="text-[28px] font-semibold">Author</p>
                            <div className="flex items-center gap-4 py-4">
                                <img
                                    src={
                                        instructor.image
                                            ? instructor.image
                                            : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                                    }
                                    alt="Author"
                                    className="object-cover rounded-full h-14 w-14"
                                />
                                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                            </div>
                            <p className="text-richblack-50">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="mt-8 text-4xl font-semibold text-center">
                Reviews from other learners
            </h1>
            <ReviewSlider />
            <Footer />
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    )
}

export default CourseDetails
