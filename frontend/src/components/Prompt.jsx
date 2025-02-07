import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faRobot, 
    faListCheck, 
    faFilePen, 
    faSuitcase, 
    faUsers, 
    faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useUser } from "../hooks/userContext";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/";

const Prompt = () => {

    const HardPrompts = [
        "Generate a modern, responsive portfolio website to showcase projects, skills, and experience. Include a Home page (bio, photo), Projects page (demos, descriptions), Skills page, About page, and Contact page (form, social links). Features: sticky header, downloadable resume, testimonials, dark mode, and SEO optimization.",
        "Create a clean, responsive multi-page blog website with a Home page (recent posts), Blog Listing (pagination, filters), Single Post (title, author, comments), About, Contact, and an Admin Dashboard (create/edit/delete posts). Features: Markdown support, API/JSON data, category sidebar, SEO optimization, and dark mode.",
        "Build a modern, fully responsive e-commerce website with a Home page (featured products), Product Listing (filters), Single Product (details, reviews, cart), Cart, Checkout, and Order Confirmation. Features: user authentication, admin dashboard, secure payments, wishlist, and fast loading times.",
        "Develop a responsive task management web app with a Dashboard (To-Do, In Progress, Completed), Task List (filters), Single Task View (details, subtasks), Add/Edit Task, and Settings. Features: drag-and-drop, reminders, user authentication, dark mode, and API/local storage integration."
    
    ];
    
    const { user, setUser } = useUser();
    
    const [prompt, setPrompt] = useState("");

    const [callCreatePrject, setCallCreateProject] = useState(false);

    useEffect(()=>{
        if(callCreatePrject)handleCreateProject();
        setCallCreateProject(false);
    },[callCreatePrject])

    const handleCreateProject = async () => {
        if(!user){
            window.location.href = `${BACKEND_URL}auth/google`;
            return;
        }
        if(!prompt.trim()) return;
        const { value: formValues } = await Swal.fire({
            title: 'Create Project',
            html: `
                <div class="w-full max-w-xs md:max-w-md mx-auto space-y-4">
                    <div class="flex flex-col space-y-2">
                        <label class="text-left tracking-wide text-sm font-medium text-slate-200" for="projectName">
                            Project Name:
                        </label>
                        <input
                            id="projectName"
                            class="w-full px-3 py-2 bg-slate-600 text-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter project name"
                        />
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <label class="text-left tracking-wide text-sm font-medium text-slate-200" for="visibility">
                            Visibility:
                        </label>
                        <select
                            id="visibility"
                            class="w-full px-3 py-2 bg-slate-600 text-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                    
                    <div class="flex flex-col space-y-2">
                        <label class="text-left tracking-wide text-sm font-medium text-slate-200" for="projectType">
                            Project Type:
                        </label>
                        <select
                            id="projectType"
                            class="w-full px-3 py-2 bg-slate-600 text-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="html-css-js">HTML CSS JS</option>
                            <option value="react">React</option>
                        </select>
                    </div>
                    <div class="flex flex-col space-y-2">
                        <label class="text-left tracking-wide text-sm font-medium text-slate-200" for="projectName">
                            Project Description:
                        </label>
                        <textarea
                            id="projectDescription"
                            class="w-full px-3 py-2 bg-slate-600 text-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter project description"
                            rows="4"
                        ></textarea>
                    </div>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Create',
            customClass: {
                container: 'swal2-container-custom',
                popup: 'rounded-lg max-w-xs md:max-w-md mx-auto bg-slate-800 text-indigo-500',
                confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md',
                cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md'
            },
            backdrop: 'backdrop-filter: blur(10px);',
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById('projectName').value.trim();
                const visibility = document.getElementById('visibility').value;
                const projectType = document.getElementById('projectType').value;
                const description = document.getElementById('projectDescription').value;

                if (!name) {
                    Swal.showValidationMessage('Project Name is required!');
                    return false;
                }

                return { name, visibility, projectType, description };
            }
        });

        if (formValues) {
            try {
                const response = await fetch(`${BACKEND_URL}project/add`, { 
                    method: "POST", 
                    headers: { 
                        "Content-Type": "application/json", 
                    },
                    body: JSON.stringify({
                        userId: user._id,
                        name: formValues.name,
                        description: formValues.description,
                        visibility: formValues.visibility,
                        projectType: formValues.projectType,
                        prompt: prompt
                    }),
                    credentials: "include", 
                });
                const data = await response.json();
                localStorage.setItem('firstprompt',JSON.stringify(data));
                if (response.status === 201){
                    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Project Created!',
                        html: `
                            <div class="text-center">
                                <p>Your project <strong>${formValues.name}</strong> has been successfully created.</p>
                                <p>Redirecting to Project Window</p>
                            </div>
                        `,
                        customClass: {
                            container: 'swal2-container-custom',
                            popup: 'rounded-lg max-w-xs md:max-w-md mx-auto text-gray-200 p-6 shadow-xl',
                            title: 'text-xl font-semibold text-green-400 mb-4',
                            confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-md',
                            htmlContainer: 'text-sm font-normal text-gray-500',
                            iconColor: 'text-green-400'
                        },
                        backdrop: 'backdrop-filter: blur(12px);',
                    });
                    
                    setPrompt("");
                    
                    window.location.href = `/main/${(formValues.projectType==='react')?'react':'plain'}/${data.PID}`;
                }
            } catch (err) {
                console.log(err);

                await Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong. Please try again later.',
                    customClass: {
                        container: 'swal2-container-custom',
                        popup: 'rounded-lg max-w-xs md:max-w-md mx-auto text-gray-200 p-6 shadow-xl',
                        title: 'text-xl font-semibold text-red-400 mb-4',
                        confirmButton: 'bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-md',
                        htmlContainer: 'text-sm font-normal text-gray-500',
                        iconColor: 'text-red-400'
                    },
                    backdrop: 'backdrop-filter: blur(12px);'
                });
            }
        }
    };

    return ( 
        <div className="relative w-[90vw] mb-28 md:w-[50vw] mt-20 min-h-[50vh] bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] backdrop-blur-lg rounded-2xl border border-indigo-400/60 shadow-2xl shadow-black/40 p-6 mx-auto flex flex-col my-10">

            <div className="text-center relative z-10 flex flex-col items-center mt-16">
                <h3 className="text-[18px] md:text-[25px] font-light text-white mb-4 tracking-wide">
                    <FontAwesomeIcon icon={faRobot} className="mr-2"/> AI Powered Development
                </h3>
            </div>

            <div className="relative z-10 flex justify-center mb-4 ">
                <div className="flex flex-wrap justify-center gap-3 px-2">
                    {[
                        { icon: faSuitcase, label: "Portfolio"},
                        { icon: faFilePen, label: "Blog"},
                        { icon: faUsers, label: "E-Commerce" },
                        { icon: faListCheck, label: "Tasks" }
                    ].map((item, index) => (
                        <button 
                            key={index} 
                            className="px-4 py-2 text-sm md:text-base text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl hover:scale-105 transition-transform hover:shadow-lg whitespace-nowrap"
                            onClick={()=>{
                                setPrompt(HardPrompts[index]);
                                setCallCreateProject(true);
                                
                            }}
                        >
                            <FontAwesomeIcon icon={item.icon} className="mr-2" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative z-10 flex justify-center mt-auto p-4">
                <div className="bg-zinc-900 flex items-end w-full md:w-[600px] px-4 py-3 rounded-xl border border-gray-700 shadow-inner">
                    <textarea 
                        placeholder="Type your prompt..."
                        className="flex-1 bg-transparent text-white outline-none border-none px-2 placeholder-gray-400 text-md resize-none max-h-100 h-20 overflow-y-scroll"
                        style={{ height: 'auto', minHeight: '32px', maxHeight: '10em' }}
                        rows="1"
                        value={prompt}
                        onInput={(e) => {
                            setPrompt(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }} 
                    />

                    <style>
                        {`
                            textarea::-webkit-scrollbar {
                                width: 6px;
                            }
                            textarea::-webkit-scrollbar-thumb {
                                background-color: rgba(255, 255, 255, 0.6);
                                border-radius: 8px;
                            }
                            textarea::-webkit-scrollbar-thumb:hover {
                                background-color: rgba(255, 255, 255, 0.9);
                            }
                            textarea::-webkit-scrollbar-track {
                                background-color: rgb(24,24,27);
                                border-radius: 8px;
                            }
                        `}
                    </style>
                    <button 
                        className="ml-3 hover:text-gray-300 px-3 transform hover:scale-110 transition-transform" 
                        onClick={handleCreateProject}
                    >                         
                        <FontAwesomeIcon 
                            icon={faArrowUp} 
                            className="h-6 w-6"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Prompt;