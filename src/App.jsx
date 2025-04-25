import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import ThemeProvider from "./theme";
import LazyLoadWrapper from "./components/loader/LazyLoadWrapper";
import Signup from "./pages/Users/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRouteWrapper from "./ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import MeetingCalendar from "./pages/Meeting/MeetingCalendar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import User from "./pages/Users/User";
import StudentProfile from "./pages/Student/StudentProfile";
import MotionLazyContainer from "./components/animate/MotionLazyContainer";
import NotistackProvider from "./components/NotistackProvider";
import { AuthContext } from "./context/AuthContext";
import MentorAllocation from "./pages/MentorAllocation/MentorAllocation";
import CampusBuddy from "./pages/CampusBuddy/CampusBuddy";
import Academic from "./pages/Student/Academic";
import AdmissionDetails from "./pages/Student/AdmissionDetails";
import AdmissionDetailsPage from "./pages/Student/AdmissionDetailsPage";
import Placement from "./pages/Placement/Placement";
import Ptm from "./pages/ParentsTeacherMeeting/Ptm";
import Attendance from "./pages/Student/Attendance";
import Thread from "./pages/Thread/Thread";
import ThreadWindow from "./pages/Thread/ThreadWindow";
import Report from "./pages/Report/Report";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ViewUsers from "./pages/Admin/ViewUsers";
import Data from "./pages/Admin/Data";
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import MentorAssignmentDialog from "./pages/MentorAllocation/MentorAssignmentDialog";
import MentorSuggestionMenu from "./pages/MentorAllocation/MentorSuggestionMenu";
import CareerReview from "./pages/CareerReview/CareerReview";
import ScoreCard from "./pages/Scorecard/ScoreCard";
import POAttainmentGrading from "./pages/MenteePOAttainment/POAttainmentGrading";
import StudentProfileOnly from "./pages/Student/StudentProfileOnly";
import FacultyProfile from "./pages/Faculty/FacultyProfile";
import FacultyProfileInfo from "./pages/Faculty/FacultyProfileInfo";
import FetchStudentProfile from "./pages/Faculty/FetchStudentProfile";
import StudentDashboard from "./pages/Faculty/StudentDashboard";
import Settings from "./pages/Settings/Settings";
import MyChatBot from './mychatbot';
// TODO : Need to remove routing logic from app component
function App() {
  const { user } = useContext(AuthContext);
  return (
    <ThemeProvider>
      <NotistackProvider>
        <MotionLazyContainer>
          <div className="app">
            <main className="content">
              <Routes>
                <Route
                  path="/login"
                  element={user ? <Navigate replace to="/" /> : <Login />}
                />
                <Route path="/signup" element={<Signup />} />

                <Route element={<DashboardLayout />}>
                  <Route
                    path="/"
                    element={
                      user ? (
                        user.roleName === "faculty" ? (
                          <Navigate replace to="/faculty/dashboard" />
                        ) : user.roleName === "admin" ? (
                          <Navigate replace to="/admin/dashboard" />
                        ) : (
                          <ProtectedRouteWrapper allowedRoles={["student"]}>
                            <LazyLoadWrapper component={Dashboard} />
                          </ProtectedRouteWrapper>
                        )
                      ) : (
                        <Navigate replace to="/login" />
                      )
                    }
                  />

                  <Route
                    path="/faculty/dashboard"
                    element={
                      <ProtectedRouteWrapper allowedRoles={["faculty"]}>
                        <LazyLoadWrapper component={FacultyDashboard} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/faculty/mentee-profile/:menteeId"
                    element={
                      <ProtectedRouteWrapper allowedRoles={["faculty"]}>
                        <LazyLoadWrapper component={StudentDashboard} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRouteWrapper allowedRoles={["admin"]}>
                        <LazyLoadWrapper component={AdminDashboard} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/admin/add-user"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={User} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={ViewUsers} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/admin/mentor-assignment"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={MentorAllocation} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/admin/data"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Data} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  {/* <Route
                    path="/chat"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Chat} />
                      </ProtectedRouteWrapper>
                    }
                  /> */}
                  <Route
                    path="/meetings"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={MeetingCalendar} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/student/profile"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={StudentProfile} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/student/academic"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Academic} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/student/admission"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={AdmissionDetailsPage} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/Placement/Placement"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Placement} />
                      </ProtectedRouteWrapper>
                    }
                  />

                  <Route
                    path="/mentees"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={FetchStudentProfile} />
                      </ProtectedRouteWrapper>
                    }
                  />

                  <Route
                    path="/mentor-details"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={FacultyProfileInfo} />
                      </ProtectedRouteWrapper>
                    }
                  />

                  <Route
                    path="/student/ptm"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Ptm} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/campus-buddy"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={MyChatBot} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/student/attendance"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Attendance} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/CareerReview/CareerReview"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={CareerReview} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/scorecard/ScoreCard"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={ScoreCard} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/po-attainment-grading"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={POAttainmentGrading} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/threads"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Thread} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/threads/:threadId"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={ThreadWindow} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/report"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Report} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/student/StudentProfileOnly"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={StudentProfileOnly} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/faculty/FacultyProfile"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={FacultyProfile} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRouteWrapper>
                        <LazyLoadWrapper component={Settings} />
                      </ProtectedRouteWrapper>
                    }
                  />
                  <Route
                    path="/mentee/dashboard"
                    element={
                      <ProtectedRouteWrapper allowedRoles={["student"]}>
                        <LazyLoadWrapper component={StudentDashboard} />
                      </ProtectedRouteWrapper>
                    }
                  />
                </Route>
              </Routes>
            </main>
          </div>
        </MotionLazyContainer>
      </NotistackProvider>
    </ThemeProvider>
  );
}

export default App;
