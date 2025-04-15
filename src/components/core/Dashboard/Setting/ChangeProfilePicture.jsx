import React, { useState, useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayPicture } from "../../../../services/operations/settingAPI";
import IconBtn from "../../../common/IconBtn";
import { toast } from "react-hot-toast";

function ChangeProfilePicture() {
    const { user } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(false);
    const [previewSource, setPreviewSource] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const handleClick = () => fileInputRef.current.click();

    // ✅ Validate file type (only images allowed)
    const validateFileType = (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        return allowedTypes.includes(file.type);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        if (!validateFileType(file)) {
            toast.error("Only JPG, JPEG, and PNG formats are allowed.");
            return;
        }

        console.log("📁 File selected:", file.name);

        // Preview image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setPreviewSource(reader.result);

        // Save selected file
        setSelectedFile(file);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first");
            return;
        }

        console.log("🚀 Upload button clicked");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("displayPicture", selectedFile);

            console.log("📤 Uploading file:", selectedFile.name);

            await dispatch(updateDisplayPicture(formData));

            // ✅ Reset file selection after upload
            setSelectedFile(null);
            setPreviewSource(null);
            toast.success("Profile picture updated successfully!");
        } catch (error) {
            console.error("❌ Error uploading file:", error);
            toast.error("Failed to upload profile picture.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-8 px-12 text-white bg-gray-800 border border-gray-700 rounded-md">
            <div className="flex items-center gap-x-4">
                <img
                    src={previewSource || user?.image}
                    alt="profile"
                    className="w-[78px] h-[78px] rounded-full object-cover"
                />
                <div>
                    <p>Change Profile Picture</p>
                    <div className="flex gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />
                        <button
                            onClick={handleClick}
                            disabled={loading}
                            className="px-5 py-2 font-semibold text-white bg-gray-700 rounded-md"
                        >
                            Select
                        </button>
                        <IconBtn
                            text={loading ? "Uploading..." : "Upload"}
                            onclick={handleFileUpload} // ✅ Fixed incorrect `onclick`
                            disabled={!selectedFile || loading}
                        >
                            {!loading && <FiUpload className="text-lg" />}
                        </IconBtn>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeProfilePicture;
