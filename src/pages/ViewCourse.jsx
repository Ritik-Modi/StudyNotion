import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'

import {
    setCompletedLecture,
    setCourseEntireData,
    setCourseSectionData,
    setTotalNoOfCourse
} from '../slices/viewCourseSlice.js'

import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
function ViewCourse() {
    const { courseId } = useParams()
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const [reviewModal, setReviewModal] = useState([false])

    useEffect(() => {
        ; (async () => {
            try {
                const courseData = await getFullDetailsOfCourse(courseId, token);
                dispatch(setCompletedLecture(courseData.completedVideos))
                dispatch(setCourseEntireData(courseData.courseDetails))
                dispatch(setCourseSectionData(courseData.courseDetails.courseContent))

                let Lectures = 0;

                courseData?.courseDetails?.courseContent?.forEach((sec) => {
                    Lectures += sec.subSection.length || 0;
                })
                dispatch(setTotalNoOfCourse(Lectures))
            } catch (error) {
                console.log(error)
            }
        }
        )()
    }, [])



    return (

        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </>
    )
}

export default ViewCourse
