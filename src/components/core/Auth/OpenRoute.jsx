// this will prevent authenticated users to be redirected on this route 
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function OpenRoute({ children }) {

    const { token } = useSelector((state) => state.auth)

    if (token === null) {
        return children
    } else {
        return <Navigate to='/dashboard/my-profile' />
    }

}


export default OpenRoute;
