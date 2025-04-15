import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from "../../../components/core/HomePage/Button";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
    return (
        <div>
            <div className="my-10 text-4xl font-semibold text-center">
                Your swiss knife for
                <HighlightText text={"learning any language"} />
                <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
                    Using spin making learning multiple languages easy. with 20+
                    languages realistic voice-over, progress tracking, custom schedule
                    and more.
                </div>
                <div className="flex flex-col items-center justify-center mt-8 lg:flex-row lg:mt-0">
                    <img
                        src={Know_your_progress}
                        alt=""
                        className="object-contain lg:-mr-32 "
                    />
                    <img
                        src={Compare_with_others}
                        alt=""
                        className="object-contain -mt-12 lg:-mb-10 lg:-mt-0"
                    />
                    <img
                        src={Plan_your_lessons}
                        alt=""
                        className="object-contain -mt-16 lg:-ml-36 lg:-mt-5"
                    />
                </div>
            </div>

            <div className="mx-auto mb-8 -mt-5 w-fit lg:mb-20">
                <CTAButton active={true} linkto={"/signup"}>
                    <div className="">Learn More</div>
                </CTAButton>
            </div>
        </div>
    )
}

export default LearningLanguageSection