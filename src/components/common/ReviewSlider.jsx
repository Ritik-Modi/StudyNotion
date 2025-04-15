import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndPoints } from "../../services/apis";

function ReviewSlider() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const truncateWords = 15;

    useEffect(() => {
        const controller = new AbortController();
        const fetchReviews = async () => {
            try {
                const { data } = await apiConnector("GET", ratingsEndPoints.REVIEWS_DETAILS_API, {
                    signal: controller.signal,
                });
                if (data?.success) {
                    setReviews(data?.data);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching reviews:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
        return () => controller.abort();
    }, []);

    const getTruncatedReview = (text = "") => {
        return text.split(" ").length > truncateWords
            ? `${text.split(" ").slice(0, truncateWords).join(" ")} ...`
            : text;
    };

    return (
        <div className="text-white">
            <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
                {loading ? (
                    <p className="text-center text-gray-400">Loading reviews...</p>
                ) : (
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={25}
                        loop={true}
                        freeMode={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        modules={[FreeMode, Pagination, Autoplay]}
                        className="w-full"
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review?.id || review?.user?.id}>
                                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                review?.user?.image ||
                                                `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                                            }
                                            alt="User Avatar"
                                            className="object-cover rounded-full h-9 w-9"
                                        />
                                        <div className="flex flex-col">
                                            <h1 className="font-semibold text-richblack-5">
                                                {`${review?.user?.firstName} ${review?.user?.lastName}`}
                                            </h1>
                                            <h2 className="text-[12px] font-medium text-richblack-500">
                                                {review?.course?.courseName}
                                            </h2>
                                        </div>
                                    </div>
                                    <p className="font-medium text-richblack-25">
                                        {getTruncatedReview(review?.review)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-yellow-100">
                                            {review?.rating?.toFixed(1) || "N/A"}
                                        </h3>
                                        <ReactStars
                                            count={5}
                                            value={review?.rating || 0}
                                            size={20}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<FaStar />}
                                            fullIcon={<FaStar />}
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
}

export default ReviewSlider;
