import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

const adminNavConfig = [
  {
    text: "Home",
    icon: <HomeOutlinedIcon />,
    link: "/admin/dashboard",
  },
  {
    text: "Add User",
    icon: <PersonAddOutlinedIcon />,
    link: "/admin/add-user",
  },
  { text: "View Users", 
    icon: <PeopleOutlinedIcon />, 
    link: "/admin/users" },
  {
    text: "Mentor Assignment",
    icon: <PersonOutlinedIcon />,
    link: "/admin/mentor-assignment",
  },
  { text: "Reports", icon: <SummarizeOutlinedIcon />, link: "/report" },
  { text: "Settings", icon: <SettingsOutlinedIcon />, link: "/settings" },
];

const facultyNavConfig = [
  { text: "Home", icon: <HomeOutlinedIcon />, link: "/faculty/dashboard" },
  { text: "My Mentees", icon: <PersonOutlinedIcon />, link: "/mentees" },
  { text: "Threads", icon: <QuestionAnswerOutlinedIcon />, link: "/threads" },
  { text: "Meetings", icon: <EventOutlinedIcon />, link: "/meetings" },
  { text: "Campus Buddy", icon: <InfoOutlinedIcon />, link: "/campus-buddy" },
  { text: "Settings", icon: <SettingsOutlinedIcon />, link: "/settings" },
];

const studentNavConfig = [
  { text: "Home", icon: <HomeOutlinedIcon />, link: "/" },
  { text: "Threads", icon: <QuestionAnswerOutlinedIcon />, link: "/threads" },
  { text: "Meetings", icon: <EventOutlinedIcon />, link: "/meetings" },
  { text: "Mentor Details", icon: <PersonOutlinedIcon />, link: "/mentor-details" },
  // { text: "Chat", icon: <ChatOutlinedIcon />, link: "/chat" },
  { text: "Campus Buddy", icon: <InfoOutlinedIcon />, link: "/campus-buddy" },
  { text: "Settings", icon: <SettingsOutlinedIcon />, link: "/settings" },
];

const getNavConfig = (role) => {
  console.log("ROLE", role);
  switch (role) {
    case "admin":
      return adminNavConfig;
    case "faculty":
      return facultyNavConfig;
    case "student":
      return studentNavConfig;
    default:
      return [];
  }
};

export default getNavConfig;
