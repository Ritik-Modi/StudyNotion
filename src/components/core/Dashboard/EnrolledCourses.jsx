import React, { useEffect, useState } from "react";
import { Line } from "rc-progress";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

function EnrolledCourses() {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = async () => {
        try {
            const res = await getUserEnrolledCourses();
            setEnrolledCourses(res);
        } catch (error) {
            console.log("Could not fetch enrolled courses.");
        }
    };

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    return (
        <>
            <div className="text-3xl text-richblack-50">Enrolled Courses</div>
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not enrolled in any course yet.
                </p>
            ) : (
                <div className="my-8 text-richblack-5">
                    <div className="flex rounded-t-lg bg-richblack-500 ">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Duration</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    {enrolledCourses.map((course, i, arr) => (
                        <div
                            className={`flex items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                                }`}
                            key={i}
                        >
                            <div
                                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                onClick={() =>
                                    navigate(
                                        `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                    )
                                }
                            >
                                <img
                                    src={course.thumbnail}
                                    alt="course_img"
                                    className="object-cover rounded-lg h-14 w-14"
                                />
                                <div className="flex flex-col max-w-xs gap-2">
                                    <p className="font-semibold">{course.courseName}</p>
                                    <p className="text-xs text-richblack-300">
                                        {course.courseDescription.length > 50
                                            ? `${course.courseDescription.slice(0, 50)}...`
                                            : course.courseDescription}
                                    </p>
                                </div>
                            </div>
                            <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                            <div className="flex flex-col w-1/5 gap-2 px-2 py-3">
                                <p>Progress: {course.progressPercentage || 0}%</p>
                                <Line percent={course.progressPercentage || 0} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default EnrolledCourses;
