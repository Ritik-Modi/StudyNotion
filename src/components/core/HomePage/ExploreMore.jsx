import React from 'react'
import { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import CourseCard from "./CourseCard.jsx"
import HighlightText from './HighlightText'
import Home from '../../../pages/Home'

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]
function ExploreMore() {

    const [currentTab, setCurrentTab] = useState(tabsName[0])
    const [courses, setCourse] = useState(HomePageExplore[0].courses)
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value)
        setCourse(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }

    return (
        <div>

            <div>
                {/* Explore More Section */}
                <div className='my-10 text-4xl font-semibold text-center'>
                    Unlock the <HighlightText text={"Power of code"} />
                    <p className='mt-1 text-lg font-semibold text-center text-richblack-300'>Learn To Build Anything You Can Imagine</p>
                </div>
            </div>
            {/* Tabs */}
            <div className='hidden lg:flex gap5 -mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
                {tabsName.map((ele, index) => {
                    return (
                        <div className={`text-[16px] flex flex-row items-center gap-2 ${currentTab == ele
                            ? "bg-richblack-900 text-richblack-5 font-medium"
                            : "text-richblack-200h"}
                            px-7 py-[7px] rounded-full transition-all duration-200 hover:bg-richblack-900 hover:text-richblack-5 cursor-pointer`}
                            key={index}
                            onClick={() => setMyCard(ele)}>
                            {ele}
                        </div>
                    )
                })}
            </div>
            <div className="hidden lg:block lg:h-[200px]"></div>

            {/* Course Cards */}
            <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                {courses.map((ele, index) => {
                    return (
                        <CourseCard
                            key={index}
                            cardData={ele}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                        />
                    )
                })}
            </div>
        </div >
    )
}

export default ExploreMore
