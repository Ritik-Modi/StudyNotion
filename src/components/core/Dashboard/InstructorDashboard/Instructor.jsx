import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";

export default function Instructor() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        (async () => {
            if (!token) {
                console.error("No token found. Redirecting to login.");
                return;
            }

            setLoading(true);

            try {
                console.log("Fetching instructor data...");
                const instructorApiData = await getInstructorData();
                console.log("Fetched instructor data:", instructorApiData);

                const result = await fetchInstructorCourses();
                console.log("Fetched instructor courses:", result);

                if (instructorApiData?.length) setInstructorData(instructorApiData);
                if (result) setCourses(result);
            } catch (error) {
                console.error("Error in fetching instructor data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const totalAmount = instructorData?.reduce(
        (acc, curr) => acc + curr.totalAmountGenerated,
        0
    );

    const totalStudents = instructorData?.reduce(
        (acc, curr) => acc + curr.totalStudentsEnrolled,
        0
    );

    return (
        <div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-richblack-5">
                    Hi {user?.firstName} 👋
                </h1>
                <p className="font-medium text-richblack-200">
                    Let's start something new
                </p>
            </div>
            {loading ? (
                <div className="spinner"></div>
            ) : courses.length > 0 ? (
                <div>
                    <div className="my-4 flex h-[450px] space-x-4">
                        {/* Render chart / graph */}
                        {totalAmount > 0 || totalStudents > 0 ? (
                            <InstructorChart courses={instructorData} />
                        ) : (
                            <div className="flex-1 p-6 rounded-md bg-richblack-800">
                                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                                <p className="mt-4 text-xl font-medium text-richblack-50">
                                    Not Enough Data To Visualize
                                </p>
                            </div>
                        )}
                        {/* Total Statistics */}
                        <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                            <p className="text-lg font-bold text-richblack-5">Statistics</p>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-lg text-richblack-200">Total Courses</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        {courses.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-richblack-200">Total Students</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        {totalStudents}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg text-richblack-200">Total Income</p>
                                    <p className="text-3xl font-semibold text-richblack-50">
                                        Rs. {totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-md bg-richblack-800">
                        {/* Render 3 courses */}
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                            <Link to="/dashboard/my-courses">
                                <p className="text-xs font-semibold text-yellow-50">View All</p>
                            </Link>
                        </div>
                        <div className="flex items-start my-4 space-x-6">
                            {courses.slice(0, 3).map((course) => (
                                <div key={course._id} className="w-1/3">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="h-[201px] w-full rounded-md object-cover"
                                    />
                                    <div className="w-full mt-3">
                                        <p className="text-sm font-medium text-richblack-50">
                                            {course.courseName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>No courses found.</p>
            )}
        </div>
    );
}
