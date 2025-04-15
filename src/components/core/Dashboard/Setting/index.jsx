import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

function Settings() {
    return (
        <>
            <h1 className="text-3xl font-medium mb-14 text-richblack-5">Edit Profile</h1>
            <ChangeProfilePicture />
            <EditProfile />
            <UpdatePassword />
            <DeleteAccount />
        </>
    )
}

export default Settings