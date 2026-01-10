import Cookies from "js-cookie";

// export const callServiceUrl = "ws://localhost:8089";

export const callServiceUrl = "wss://call-service-dpcq.onrender.com";

export const statsData = [
    {
        label: "Active Teams",
        number: "8",
        subtext: "this month",
        description: "Teams you're part of",
        iconType: "team",
        iconColor: "#8b5cf6"
    },
    {
        label: "Tasks Completed",
        number: "24",
        subtext: "from last week",
        description: "This week",
        iconType: "task",
        iconColor: "#10b981"
    },
    {
        label: "Messages",
        number: "156",
        subtext: "unread messages",
        description: "Across all channels",
        iconType: "message",
        iconColor: "#f59e0b"
    },
    {
        label: "Meeting Hours",
        number: "12.5h",
        subtext: "from last week",
        description: "This week",
        iconType: "clock",
        iconColor: "#3b82f6"
    }
];

export const projectsData = [
    {
        id: 1,
        name: "Website Redesign",
        team: "Design Team",
        status: "onTrack",
        statusText: "On Track",
        dueDate: "Due Mar 15",
        completedTasks: 15,
        totalTasks: 20,
        progress: 75
    }
];

export const activitiesData = [
    // {
    //     id: 1,
    //     avatar: "SC",
    //     userName: "Sarah Chen",
    //     action: "completed task",
    //     target: "Homepage Redesign",
    //     time: "5 minutes ago"
    // },
    // {
    //     id: 2,
    //     avatar: "MJ",
    //     userName: "Mike Johnson",
    //     action: "sent a message in",
    //     target: "#design-team",
    //     time: "12 minutes ago"
    // },
    // {
    //     id: 3,
    //     avatar: "AR",
    //     userName: "Alex Rodriguez",
    //     action: "scheduled a meeting",
    //     target: "Product Review",
    //     time: "1 hour ago"
    // },
    // {
    //     id: 4,
    //     avatar: "EW",
    //     userName: "Emma Wilson",
    //     action: "joined the team",
    //     target: "Marketing Team",
    //     time: "2 hours ago"
    // }
];

export const meetingsData = [
    // {
    //     id: 1,
    //     title: "Team Standup",
    //     participants: "Design Team • 15 minutes",
    //     time: "2025-08-03 14:50:22.676612",
    // },
    // {
    //     id: 2,
    //     title: "Product Review",
    //     participants: "Marketing Team • 1 hour",
    //     time: "2025-07-27 16:14:22.676612",
    // },
    // {
    //     id: 3,
    //     title: "Sprint Planning",
    //     participants: "Dev Team • 2 hours",
    //     time: "2025-07-27 16:14:22.676612",
    // },
    // {
    //     id: 3,
    //     title: "Sprint Planning",
    //     participants: "Dev Team • 2 hours",
    //     time: "2025-07-27 16:14:22.676612",
    // }
];

export const quickActionsData = [
    {
        id: 1,
        label: "Create Team",
        icon: "👥",
        action: "createTeam"
    },
    {
        id: 2,
        label: "Add Task",
        icon: "📋",
        action: "addTask"
    },
    {
        id: 3,
        label: "Schedule Meeting",
        icon: "📅",
        action: "scheduleMeeting"
    },
    {
        id: 4,
        label: "Send Message",
        icon: "💬",
        action: "sendMessage"
    }
];

// Separate members data
export const membersData = [
    {
        id: 1,
        name: "Sarah Chen",
        role: "Lead Designer",
        email: "sarah.chen@company.com",
        phone: "+1 (555) 123-4567",
        avatar: "SC",
        status: "online",
        teamId: 1
    },
    {
        id: 2,
        name: "Mike Johnson",
        role: "UI/UX Designer",
        email: "mike.johnson@company.com",
        phone: "+1 (555) 234-5678",
        avatar: "MJ",
        status: "away",
        teamId: 1
    },
    {
        id: 3,
        name: "Emma Wilson",
        role: "Visual Designer",
        email: "emma.wilson@company.com",
        phone: "+1 (555) 345-6789",
        avatar: "EW",
        status: "online",
        teamId: 1
    },
    {
        id: 4,
        name: "Alex Rodriguez",
        role: "Senior Developer",
        email: "alex.rodriguez@company.com",
        phone: "+1 (555) 456-7890",
        avatar: "AR",
        status: "online",
        teamId: 2
    },
    {
        id: 5,
        name: "Lisa Park",
        role: "Frontend Developer",
        email: "lisa.park@company.com",
        phone: "+1 (555) 567-8901",
        avatar: "LP",
        status: "offline",
        teamId: 2
    },
    {
        id: 6,
        name: "David Kim",
        role: "Backend Developer",
        email: "david.kim@company.com",
        phone: "+1 (555) 678-9012",
        avatar: "DK",
        status: "online",
        teamId: 2
    },
    {
        id: 7,
        name: "Jennifer Lee",
        role: "DevOps Engineer",
        email: "jennifer.lee@company.com",
        phone: "+1 (555) 789-0123",
        avatar: "JL",
        status: "away",
        teamId: 2
    },
    {
        id: 8,
        name: "Robert Taylor",
        role: "Marketing Manager",
        email: "robert.taylor@company.com",
        phone: "+1 (555) 890-1234",
        avatar: "RT",
        status: "online",
        teamId: 3
    },
    {
        id: 9,
        name: "Maria Garcia",
        role: "Content Strategist",
        email: "maria.garcia@company.com",
        phone: "+1 (555) 901-2345",
        avatar: "MG",
        status: "online",
        teamId: 3
    }
];

// Updated teams data without embedded members
export const teamsData = [
    {
        id: 1,
        name: "Design Team",
        description: "Creating beautiful and intuitive user experiences for our products",
        createdAt: "Jan 2024",
        projects: [1, 2],
        memberIds: [1, 2, 3]
    },
    {
        id: 2,
        name: "Development Team",
        description: "Building robust and scalable applications with cutting-edge technologies",
        createdAt: "Dec 2023",
        projects: [3, 4],
        memberIds: [4, 5, 6, 7]
    },
    {
        id: 3,
        name: "Marketing Team",
        description: "Driving growth and engagement through strategic marketing initiatives",
        createdAt: "Feb 2024",
        projects: [5],
        memberIds: [8, 9]
    }
];

export const projectsDetailedData = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Complete overhaul of the company website with modern design",
        fullDescription: "This project involves a complete redesign of our company website to improve user experience, enhance brand identity, and increase conversion rates. We'll be implementing a responsive design system, optimizing for performance, and ensuring accessibility compliance. The new design will feature modern aesthetics, intuitive navigation, and seamless integration with our CRM system.",
        status: "onTrack",
        statusText: "On Track",
        dueDate: "Mar 15, 2025",
        priority: "High",
        progress: 75,
        tasks: [
            {
                id: 1,
                title: "User Research & Analysis",
                description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,  comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from  by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
                status: "completed",
                assignee: "Sarah Chen",
                dueDate: "Feb 1"
            },
            {
                id: 2,
                title: "Wireframe Creation",
                description: "Create detailed wireframes for all main pages",
                status: "completed",
                assignee: "Mike Johnson",
                dueDate: "Feb 10"
            },
            {
                id: 3,
                title: "Visual Design",
                description: "Design high-fidelity mockups and style guide",
                status: "inprogress",
                assignee: "Emma Wilson",
                dueDate: "Feb 25"
            },
            {
                id: 4,
                title: "Frontend Development",
                description: "Implement responsive design with React components",
                status: "todo",
                assignee: "Lisa Park",
                dueDate: "Mar 10"
            },
            {
                id: 5,
                title: "Content Migration",
                description: "Migrate and optimize existing content",
                status: "todo",
                assignee: "Maria Garcia",
                dueDate: "Mar 12"
            }
        ]
    },
    {
        id: 2,
        name: "Mobile App Prototype",
        description: "Design and prototype for the new mobile application",
        fullDescription: "Development of a comprehensive mobile application prototype that will serve as the foundation for our mobile strategy. This includes user flow mapping, interactive prototyping, and usability testing. The app will feature real-time collaboration tools, offline functionality, and seamless synchronization across devices.",
        status: "ahead",
        statusText: "Ahead of Schedule",
        dueDate: "Apr 1, 2025",
        priority: "Medium",
        progress: 60,
        tasks: [
            {
                id: 6,
                title: "User Flow Mapping",
                description: "Map out all user journeys and interactions",
                status: "completed",
                assignee: "Sarah Chen",
                dueDate: "Jan 20"
            },
            {
                id: 7,
                title: "Interactive Prototype",
                description: "Build clickable prototype using Figma",
                status: "inprogress",
                assignee: "Mike Johnson",
                dueDate: "Feb 15"
            },
            {
                id: 8,
                title: "Usability Testing",
                description: "Conduct user testing sessions with prototype",
                status: "todo",
                assignee: "Emma Wilson",
                dueDate: "Mar 1"
            }
        ]
    },
    {
        id: 3,
        name: "API Integration Platform",
        description: "Build comprehensive API integration system",
        fullDescription: "Development of a robust API integration platform that will allow seamless connection with third-party services. This includes designing RESTful APIs, implementing authentication systems, creating comprehensive documentation, and ensuring scalability for future growth. The platform will support real-time data synchronization and provide detailed analytics.",
        status: "onTrack",
        statusText: "On Track",
        dueDate: "May 15, 2025",
        priority: "High",
        progress: 40,
        tasks: [
            {
                id: 9,
                title: "API Architecture Design",
                description: "Design scalable API architecture and endpoints",
                status: "completed",
                assignee: "Alex Rodriguez",
                dueDate: "Jan 30"
            },
            {
                id: 10,
                title: "Authentication System",
                description: "Implement OAuth 2.0 and JWT authentication",
                status: "inprogress",
                assignee: "David Kim",
                dueDate: "Feb 20"
            },
            {
                id: 11,
                title: "Database Optimization",
                description: "Optimize database queries and implement caching",
                status: "inprogress",
                assignee: "Jennifer Lee",
                dueDate: "Mar 5"
            },
            {
                id: 12,
                title: "API Documentation",
                description: "Create comprehensive API documentation",
                status: "todo",
                assignee: "Lisa Park",
                dueDate: "Apr 1"
            },
            {
                id: 13,
                title: "Integration Testing",
                description: "Test integrations with major third-party services",
                status: "todo",
                assignee: "Alex Rodriguez",
                dueDate: "May 1"
            }
        ]
    },
    {
        id: 4,
        name: "Performance Optimization",
        description: "Optimize application performance and loading times",
        fullDescription: "A comprehensive performance optimization initiative focused on improving application speed, reducing loading times, and enhancing overall user experience. This includes code splitting, lazy loading implementation, database query optimization, CDN integration, and monitoring setup for continuous performance tracking.",
        status: "atRisk",
        statusText: "At Risk",
        dueDate: "Mar 30, 2025",
        priority: "High",
        progress: 25,
        tasks: [
            {
                id: 14,
                title: "Performance Audit",
                description: "Conduct comprehensive performance analysis",
                status: "completed",
                assignee: "Jennifer Lee",
                dueDate: "Jan 15"
            },
            {
                id: 15,
                title: "Code Splitting Implementation",
                description: "Implement dynamic imports and code splitting",
                status: "blocked",
                assignee: "Lisa Park",
                dueDate: "Feb 15"
            },
            {
                id: 16,
                title: "Database Query Optimization",
                description: "Optimize slow database queries and add indexing",
                status: "todo",
                assignee: "David Kim",
                dueDate: "Mar 1"
            },
            {
                id: 17,
                title: "CDN Integration",
                description: "Set up CDN for static assets and images",
                status: "todo",
                assignee: "Jennifer Lee",
                dueDate: "Mar 15"
            }
        ]
    },
    {
        id: 5,
        name: "Marketing Campaign Launch",
        description: "Launch comprehensive digital marketing campaign",
        fullDescription: "A multi-channel marketing campaign designed to increase brand awareness, drive user acquisition, and boost engagement across all platforms. The campaign includes social media strategy, content creation, email marketing, SEO optimization, and performance tracking with detailed analytics and ROI measurement.",
        status: "onTrack",
        statusText: "On Track",
        dueDate: "Apr 15, 2025",
        priority: "Medium",
        progress: 55,
        tasks: [
            {
                id: 18,
                title: "Campaign Strategy",
                description: "Develop comprehensive marketing strategy and timeline",
                status: "completed",
                assignee: "Robert Taylor",
                dueDate: "Jan 10"
            },
            {
                id: 19,
                title: "Content Creation",
                description: "Create blog posts, social media content, and graphics",
                status: "inprogress",
                assignee: "Maria Garcia",
                dueDate: "Mar 1"
            },
            {
                id: 20,
                title: "Email Campaign Setup",
                description: "Set up automated email sequences and newsletters",
                status: "inprogress",
                assignee: "Robert Taylor",
                dueDate: "Mar 10"
            },
            {
                id: 21,
                title: "Social Media Launch",
                description: "Launch coordinated social media campaign",
                status: "todo",
                assignee: "Maria Garcia",
                dueDate: "Mar 20"
            },
            {
                id: 22,
                title: "Performance Tracking",
                description: "Set up analytics and tracking for campaign metrics",
                status: "todo",
                assignee: "Robert Taylor",
                dueDate: "Apr 1"
            }
        ]
    }
];


export const stringToColor = (string) => {
    let hash = 0;
    let i;

    try {
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }catch(err){
        console.error(err)
    }

    /* eslint-disable no-bitwise */

    /* eslint-enable no-bitwise */

    
}

export const getInitials = (name) => {

    try{
        return name.split(' ').length > 1 ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : `${name.split(' ')[0][0]}`;
    }catch(err){
        console.error(err)
    }
    
}

export const getCurrentUserId = () => {
    const token = Cookies.get("jwtToken")
    let userId = null

    if (token) {
        // Decode JWT token to get user ID
        const payload = JSON.parse(atob(token.split('.')[1]))
        userId = payload.userId || payload.id || payload.sub
        console.log("userId", userId)
        return userId
    }

    if (!userId) {
        console.error('Unable to get user ID from token')
        return 0
    }

};