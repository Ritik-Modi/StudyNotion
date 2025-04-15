import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../../../services/operations/settingAPI";
import { setUser } from "../../../../slices/profileSlice"; // Ensure this exists
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
    const { user } = useSelector((state) => state.profile);
    const token = useSelector((state) => state.auth.token);
    // console.log("Token in Redux:", token); // Debugging step

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ Use state to manage form values dynamically
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        about: "",
    });

    // ✅ Load existing user data into state
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
                gender: user?.additionalDetails?.gender || "",
                contactNumber: user?.additionalDetails?.contactNumber || "",
                about: user?.additionalDetails?.about || "",
            });
        }
    }, [user]);

    // ✅ React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: profileData });

    // ✅ Handle input change manually
    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // ✅ Handle form submission
    const submitProfileForm = async () => {
        try {
            const updatedUser = await dispatch(updateProfile(profileData, token)); // Ensure `updateProfile` returns updated data
            if (updatedUser) {
                dispatch(setUser(updatedUser)); // Update Redux state
            }
        } catch (error) {
            console.error("ERROR MESSAGE - ", error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(submitProfileForm)}>
            {/* Profile Information */}
            <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <h2 className="text-lg font-semibold text-richblack-5">
                    Profile Information
                </h2>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="firstName" className="lable-style">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter first name"
                            className="form-style"
                            {...register("firstName", { required: true })}
                            value={profileData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your first name.
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="lastName" className="lable-style">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter last name"
                            className="form-style"
                            {...register("lastName", { required: true })}
                            value={profileData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your last name.
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="dateOfBirth" className="lable-style">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            className="form-style"
                            {...register("dateOfBirth", { required: true })}
                            value={profileData.dateOfBirth}
                            onChange={handleChange}
                        />
                        {errors.dateOfBirth && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.dateOfBirth.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="gender" className="lable-style">
                            Gender
                        </label>
                        <select
                            name="gender"
                            id="gender"
                            className="form-style"
                            {...register("gender", { required: true })}
                            value={profileData.gender}
                            onChange={handleChange}
                        >
                            {genders.map((ele, i) => (
                                <option key={i} value={ele}>
                                    {ele}
                                </option>
                            ))}
                        </select>
                        {errors.gender && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please select your gender.
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="contactNumber" className="lable-style">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            name="contactNumber"
                            id="contactNumber"
                            placeholder="Enter Contact Number"
                            className="form-style"
                            {...register("contactNumber", { required: true })}
                            value={profileData.contactNumber}
                            onChange={handleChange}
                        />
                        {errors.contactNumber && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                {errors.contactNumber.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 lg:w-[48%]">
                        <label htmlFor="about" className="lable-style">
                            About
                        </label>
                        <input
                            type="text"
                            name="about"
                            id="about"
                            placeholder="Enter Bio Details"
                            className="form-style"
                            {...register("about", { required: true })}
                            value={profileData.about}
                            onChange={handleChange}
                        />
                        {errors.about && (
                            <span className="-mt-1 text-[12px] text-yellow-100">
                                Please enter your About.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={() => navigate("/dashboard/my-profile")}
                    className="px-5 py-2 font-semibold rounded-md cursor-pointer bg-richblack-700 text-richblack-50"
                >
                    Cancel
                </button>
                <IconBtn type="submit" text="Save" />
            </div>
        </form>
    );
}
