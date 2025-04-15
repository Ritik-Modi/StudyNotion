import './App.css'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/common/Navbar.jsx'
import Error from './pages/Error.jsx'
import Home from "./pages/Home.jsx"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import OpenRoute from './components/core/Auth/OpenRoute.jsx'
import { ACCOUNT_TYPE } from "./utils/constants";

// importing dashboards 
import PrivateRoute from './components/core/Auth/PrivateRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MyProfile from './components/core/Dashboard/MyProfile.jsx'
import Settings from './components/core/Dashboard/Setting'
import Cart from './components/core/Dashboard/Cart'
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses.jsx'
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor.jsx'
import AddCourse from './components/core/Dashboard/Addcourse/Index.jsx'
import EditCourse from './components/core/Dashboard/EditCourse'
import MyCourses from './components/core/Dashboard/MyCourses.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import VideoDetails from './components/core/ViewCourse/VideoDetails.jsx'

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.profile);


  return (
    <div className='flex flex-col w-screen min-h-screen bg-richblack-900 font-inter'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        <Route path='/about' element={<About />} />
        <Route path="/contact" element={<Contact />} />


        <Route
          path='/signup'
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path='/login'
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          } />

        <Route
          path='forgot-password'
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          } />
        <Route
          path='update-password'
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          } />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* DashBoard Route */}
        <Route element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } >

          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />

              </>
            )
          }
        </Route>


        {/*  */}
        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )
          }

        </Route>


        {/* Error route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App
