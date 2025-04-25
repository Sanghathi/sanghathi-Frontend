import React from "react";
import ChatBot from "react-chatbotify";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { options } from "numeral";
import { get } from "react-hook-form";
import { Engineering } from "@mui/icons-material";

let apiKey = "AIzaSyBAR_Ugl_23G4xarll8jn2L5dqVeD122Yc";
let hasError = false;

// Function to call Gemini
const callGemini = async (userInput) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userInput);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    hasError = true;
    return "❌ Failed to load Gemini model. Check your API key.";
  }
};

const MyChatBot = () => {
    const themes = [
		{id: "solid_purple_haze", version: "0.1.0"},
		{id: "simple_blue", version: "0.1.0"}
	]
  const helpOptions = [
  
    "Department Location",
    "IAT dates",
    "VTU Examinations",
    "Departments hod's",
    "Other question"
  ];

  const flow = {
    ask_department_location: {
      message: "Please choose the department you want to know about:",
      options: [
        "Chemistry",
        "Civil Engineering",
        "CSE",
        "ECE",
        "ISE",
        "Mathematics",
        "Mechanical_Engineering",
        "Physics",
        "MBA",
        "AI&DS",
        "AI&ML"
      ],
      path: "get_department_location"
    },
    get_department_location: {
      message: async (params) => {
        const departmentLocations = {
          Chemistry: "Department of Chemistry is located on the 4th floor of Block A.",
          "Civil Engineering":
            "Department of Civil Engineering is located on the 2nd floor of Block D.",
          CSE: "Department of Computer Science and Engineering is located on the 5th floor of Block c.",
          ECE: "Department of Electronics and Communication Engineering is located on the 3rd floor of Block B.",
          ISE: "Department of Information Science and Engineering is located on the 6th floor of Block A.",
          Mathematics: "Department of Mathematics is located on the 4th floor of Block A.",
          Mechanical_Engineering: "Department of Mechanical Engineering is located on the 2nd floor of Block C.",
          Physics: "Department of Physics is located on the 4th floor of Block A.",
          MBA: "Department of MBA is located on the 1st floor of Block A.",
          AI_DS: "Department of AI&DS is located on the 5th floor of Block A.",
          AI_ML: "Department of AI&ML is located on the 5th floor of Block A."
        };
        return departmentLocations[params.userInput] || "Department not found.";
      },
      path: "repeat"
    },

    ask_vtu_exams: {
      message: "Please choose the VTU exam you want to know about:",
      options: [
        "1st Sem",
        "2nd Sem",
        "3rd Sem",
        "4th Sem",
        "5th Sem",
        "6th Sem",
        "7th Sem",
        "8th Sem"
      ],
      path: "get_vtu_exams"
    },
    get_vtu_exams: {
      message: async (params) => {
        const vtuExams = {
          "1st Sem": "1st Sem exams are from 15th to 20th October.",
          "2nd Sem": "2nd Sem exams are from 15th to 20th November.",
          "3rd Sem": "3rd Sem exams are from 15th to 20th December.",
          "4th Sem": "4th Sem exams are from 15th to 20th January.",
          "5th Sem": "5th Sem exams are from 15th to 20th February.",
          "6th Sem": "6th Sem exams are from 15th to 20th March.",
          "7th Sem": "7th Sem exams are from 15th to 20th April.",
          "8th Sem": "8th Sem exams are from 15th to 20th May."
        };
        return vtuExams[params.userInput] || "VTU exam not found.";
      },
      path: "repeat"
    },

    ask_iat_dates: {
      message: "Please choose the IAT dates you want to know about:",
      options:[
        "IAT 1",
        "IAT 2",
        "IAT 3",
      ],
      path: "get_iat_dates"
    },
    get_iat_dates: {
      message: async (params) => {
        const iatDates = {
          "IAT 1": "IAT 1 is from 15th to 20th October.",
          "IAT 2": "IAT 2 is from 15th to 20th November.",
          "IAT 3": "IAT 3 is from 15th to 20th December."
        };
        return iatDates[params.userInput] || "IAT date not found.";
      },
      path : "repeat"
    },
    ask_hod_department: {
        message: "Please choose the department to get HOD details:",
        options: [
          "Chemistry",
          "Civil Engineering",
          "CSE",
          "ECE",
          "ISE",
          "Mathematics",
          "Mechanical Engineering",
          "Physics",
          "MBA",
          "AI&DS",
          "AI&ML"
        ],
        path: "give_hod_info"
      },
      
      give_hod_info: {
        message: async (params) => {
          const hodInfo = {
            "Chemistry": "Dr. Fazlur Rahaman | Associate Professor & HOD",
            "Civil Engineering": "Mrs. Preeti Jacob | Assistant Professor & HOD",
            "CSE": "Dr. Kesavamoorthy | Professor & HOD",
            "ECE": "Dr. Pappa M | Professor and HoD",
            "ISE": "Dr. Jagadishwari V | Professor & HOD",
            "Mathematics": "Dr. K. Meenakshi | HOD & Professor",
            "Mechanical Engineering": "Dr. B. Rajendra Prasad Reddy | Professor & HOD",
            "Physics": "Dr. Raveesha K.H | Professor & HOD",
            "MBA": "Dr. Sandeep Kumar M | Professor & HOD",
            "AI&DS": "Dr. Shanthi. M.B | Professor and HoD",
            "AI&ML": "Dr. Shyam P. Joy | Professor and HoD"
          };
          return hodInfo[params.userInput] || "Department not found.";
        },
        path: "repeat"
      },
      
    start: {
      message:
        "👋 Hi! Welcome to your assistant. How can I help you today?",
      transition: { duration: 1000 },
      path: "show_options"
    },
    show_options: {
      message: "Please choose from the following options:",
      options: helpOptions,
      path: "process_options"
    },
    prompt_again: {
      message: "Would you like help with anything else?",
      options: helpOptions,
      path: "process_options"
    },
    unknown_input: {
    //   message: "Hmm... I didn't get that 🤔. Please choose an option below.",
    //   options: helpOptions,
      path: "ask_gemini"
    },
    process_options: {
      transition: { duration: 0 },
      chatDisabled: true,
      path: async (params) => {
        let link = "";

        switch (params.userInput) {
          case "Department Location":
            return "ask_department_location";
          case "IAT dates":
            return "ask_iat_dates";
          
          case "VTU Examinations":
            return "ask_vtu_exams";
            
          case "Other question":
            return "ask_gemini";
          case "Departments hod's":
              return "ask_hod_department";
          default:
            return "ask_gemini";
        }

        await params.injectMessage("Sit tight! I'll send you right there!");
        setTimeout(() => {
          window.open(link);
        }, 1000);
        return "repeat";
      }
    },
    ask_gemini: {
      message: "Please ask your question and I will try to help you!",
      path: "get_gemini_response"
    },
    get_gemini_response: {
      message: async (params) => {
        return await callGemini(params.userInput);
      },
      path: () => (hasError ? "start" : "repeat")
    },
    repeat: {
      transition: { duration: 3000 },
      path: "prompt_again"
    }
  };

  return (
    <>
      <style>
        {`  element.style{
              background-color: rgba(40,46,62) !important;
              }
          .rcb-chat-window {
           
            position: fixed !important;
            top: 66px !important;
            left: 251px !important;
            width: 92vw !important;
            height: 93vh !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            z-index: 9999 !important;
          }
           .rcb-chat-body-container{
           background-color: rgba(40,46,62) !important;
              height: 83% !important;
              width: 92% !important;
           }
            .rcb-chat-input-textarea{
            // background-color: rgba(40,46,62) !important;}
            .input text area{
            }
        `}
      </style>
      <ChatBot
        themes={themes}
        settings={{
          general: { embedded: true },
          chatHistory: { storageKey: "gemini_college_assistant" }
        }}
        flow={flow}
      />
    </>
  );
  
  
};

export default MyChatBot;
