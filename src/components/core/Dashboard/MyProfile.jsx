import React, { useEffect } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../../slices/profileSlice";
import { formattedDate } from "../../../utils/dateFormatter";
import IconBtn from "../../common/IconBtn";

function MyProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user data from Redux state
    const { user, loading } = useSelector((state) => state.profile);

    useEffect(() => {
        if (!user) {
            console.log("Fetching user profile...");
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

    useEffect(() => {
        console.log("User Data from Redux:", user);
    }, [user]);

    if (loading) {
        return <p className="text-center text-richblack-400">Loading...</p>;
    }

    return (
        <>
            <h1 className="text-3xl font-medium mb-14 text-richblack-5">
                My Profile
            </h1>

            {/* Profile Section */}
            <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex items-center gap-x-4">
                    <img
                        src={user?.image || "/default-profile.png"}
                        alt={`profile-${user?.firstName}`}
                        className="aspect-square w-[78px] rounded-full object-cover"
                    />
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-richblack-5">
                            {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className="text-sm text-richblack-300">{user?.email}</p>
                    </div>
                </div>
                <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
                    <RiEditBoxLine />
                </IconBtn>
            </div>

            {/* About Section */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex items-center justify-between w-full">
                    <p className="text-lg font-semibold text-richblack-5">About</p>
                    <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <p className={`${user?.additionalDetails?.about ? "text-richblack-5" : "text-richblack-400"} text-sm font-medium`}>
                    {user?.additionalDetails?.about || "Write Something About Yourself"}
                </p>
            </div>

            {/* Personal Details Section */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex items-center justify-between w-full">
                    <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                    <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <div className="flex max-w-[500px] justify-between">
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">First Name</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.firstName || "Add First Name"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">Email</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.email || "Add Email"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">Gender</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.additionalDetails?.gender || "Add Gender"}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">Last Name</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.lastName || "Add Last Name"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {user?.additionalDetails?.contactNumber || "Add Contact Number"}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                            <p className="text-sm font-medium text-richblack-5">
                                {formattedDate(user?.additionalDetails?.dateOfBirth) || "Add Date Of Birth"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyProfile;
