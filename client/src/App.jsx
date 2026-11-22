import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Context } from "./context/AuthContext";

import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import TeacherDashboard from "./pages/Admin/TeacherDashboard.jsx";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OtpVerification from "./pages/OtpVerification";
import Courses from "./pages/Courses/Courses.jsx";
import CoursesDetails from "./pages/Courses/CoursesDetails.jsx";
import CreateCourses from "../src/pages/Admin/Courses/CreateCourses.jsx";
import AllCourses from "../src/pages/Admin/Courses/AllCourses.jsx";
import EditCourses from "../src/pages/Admin/Courses/EditCourses.jsx";
import UploadVideo from "../src/pages/Admin/Courses/UploadVideo.jsx";
import Jobs from "../src/pages/jobs/Jobs.jsx";
import CreateJob from "../src/pages/Admin/job/CreateJob.jsx";
import AllJobs from "../src/pages/Admin/job/AllJobs.jsx";
import EditJob from "../src/pages/Admin/job/EditJob.jsx";
import AdminJobApplications from "./pages/Admin/job/AdminJobApplications.jsx";
import JobsDetails from "../src/pages/jobs/JobsDetails.jsx";
import Error from "../src/components/Error";
import Faq from "../src/components/Faq";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";
import TeacherCreateCourse from "./pages/Admin/TeacherAdmin/TeacherCreateCourse.jsx";
import TeacherCourses from "./pages/Admin/TeacherAdmin/TeacherCourses.jsx";
import TeacherEditCourses from "./pages/Admin/TeacherAdmin/TeacherEditCourses.jsx";
import TeacherUploadVideo from "./pages/Admin/TeacherAdmin/TeacherUploadVideo.jsx";
import TeacherCourseVideos from "./pages/Admin/TeacherAdmin/TeacherCourseVideos.jsx";
import UserDashboard from "./pages/Admin/UserDashboard.jsx";
import VideoPlayerPage from "./pages/Courses/VideoPlayerPage.jsx";
import CertificateForm from "./pages/Courses/CertificateForm.jsx";
import CertificatePreview from "./pages/Courses/CertificatePreview.jsx";
import JobDashboard from "./pages/Admin/JobDashboard.jsx";
import JobCreate from "./pages/Admin/JobAdmin/JobCreate.jsx";
import Jobshow from "./pages/Admin/JobAdmin/Jobshow.jsx";
import JobEdit from "./pages/Admin/JobAdmin/JobEdit.jsx";
import JobApplications from "./pages/Admin/JobAdmin/JobApplications.jsx";
import Freelance from "./pages/Fiver/Freelance.jsx";
import Setting from "./components/Setting.jsx";
import BrowseGigs from "./pages/Fiver/Gigs/BrowseGigs.jsx";
import GigDetails from "./pages/Fiver/Gigs/GigDetails";
import FreelancerDashboard from "./pages/Fiver/FreeLancerDashboard.jsx";
import CreateGig from "./pages/Fiver/Crud/CreateGig.jsx";
import FreelancerPublicProfile from "./pages/Fiver/FreelancerPublicProfile.jsx";
import Messages from "./pages/Fiver/Messages.jsx";
import CreateOrder from "./pages/Fiver/Crud/CreateOrder.jsx";
import OrderDetails from "./pages/Fiver/Crud/OrderDetails.jsx";
import About from "./components/About.jsx";
import Terms from "./components/Terms.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Contact from "./components/Contact.jsx";
import CreateBlog from "./pages/Admin/blogs/CreateBlog.jsx";
import AllBlogs from "./pages/Admin/blogs/AllBlogs.jsx";
import EditBlog from "./pages/Admin/blogs/EditBlog.jsx";
import Blog from "./pages/Blogs/Blog.jsx";
import BlogDetails from "./pages/Blogs/BlogDetails.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

const App = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { setIsAuthenticated, setUser, user, loading, setLoading } =
    useContext(Context);
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/user/me`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // ✅ IMPORTANT
      }
    };

    getUser();
  }, [API_URL, setUser, setIsAuthenticated, setLoading]);

  console.log("ROLE:", user?.role);
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/user/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "user"]}>
              <UserDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/freelancer/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["freelancer", "admin"]}>
              <FreelancerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/create-course"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherCreateCourse />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/my-courses"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/edit-course/:id"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherEditCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/teacher/course/:courseId/videos"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherCourseVideos />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/video/:videoId"
          element={
            <RoleProtectedRoute
              allowedRoles={["user", "teacher", "admin", "freelancer"]}
            >
              <VideoPlayerPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/certificate-form/:courseId"
          element={<CertificateForm />}
        />
        <Route
          path="/certificate-preview/:courseId"
          element={<CertificatePreview />}
        />
        <Route
          path="/teacher/upload-video"
          element={
            <RoleProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherUploadVideo />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <RoleProtectedRoute
              allowedRoles={["user", "teacher", "admin", "job", "freelancer"]}
            >
              <Courses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/create-course"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <CreateCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/all-courses"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AllCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <EditCourses />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/upload-video"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <UploadVideo />
            </RoleProtectedRoute>
          }
        />
        <Route path="/courses-details/:id" element={<CoursesDetails />} />
        <Route path="/faq-page" element={<Faq />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/freelancers/:id" element={<FreelancerPublicProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:conversationId" element={<Messages />} />
        <Route path="/create-order/:gigId" element={<CreateOrder />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />

        {/*job pages start here */}

        <Route path="/jobs" element={<Jobs />} />
        <Route
          path="/admin/create-job"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <CreateJob />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/all-jobs"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AllJobs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-job/:id"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <EditJob />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:jobId"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminJobApplications />
            </RoleProtectedRoute>
          }
        />
        <Route path="/jobs/:id" element={<JobsDetails />} />
        <Route
          path="/job/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "job"]}>
              <JobDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/job/create"
          element={
            <RoleProtectedRoute allowedRoles={["job", "admin"]}>
              <JobCreate />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/job/show-all"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "job"]}>
              <Jobshow />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/job/Job-edit/:id"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "job"]}>
              <JobEdit />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/job/applications/:jobId"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "job"]}>
              <JobApplications />
            </RoleProtectedRoute>
          }
        />

        {/*fiver files links */}
        <Route
          path="/freelance"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin", "freelancer"]}>
              <Freelance />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/gigs"
          element={
            <RoleProtectedRoute allowedRoles={["user", "admin", "freelancer"]}>
              <BrowseGigs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/gigs/create"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "freelancer"]}>
              <CreateGig />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/create-blog"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <CreateBlog />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/all-blogs"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AllBlogs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-blog/:id"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <EditBlog />
            </RoleProtectedRoute>
          }
        />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
        <Route path="/gigs/:id" element={<GigDetails />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/otp-verification/:email/:phone"
          element={<OtpVerification />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer theme="colored" />
    </Router>
  );
};

export default App;
