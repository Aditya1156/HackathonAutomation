import type { Team, ScheduleItem, FaqItem, Sponsor, ChatMessage, Attraction } from '../types';

const generateTeam = (index: number): Team => {
  const teamNames = ['Code Wizards', 'Cyber Punks', 'Data Dynamos', 'Pixel Pioneers', 'Logic Lords', 'API Avengers', 'Syntax Strikers', 'Kernel Krew', 'Binary Brigade', 'Runtime Rebels'];
  const tracks = ['AI / Machine Learning', 'Web 3.0 & Blockchain', 'FinTech', 'HealthTech', 'Sustainability & Green Tech'];
  const statuses: Team['status'][] = ['Registered', 'Checked-in', 'Verified'];
  const teamName = teamNames[index % teamNames.length];
  const teamId = `T${1672531200000 + (index * 100000)}`;
  const skillsPool = ['React', 'Python', 'UI/UX', 'Figma', 'Node.js', 'Solidity', 'AI/ML', 'Data Analysis', 'DevOps', 'Mobile Dev'];
  
  const getRandomSkills = () => {
    const shuffled = skillsPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 2); // Get 2-4 random skills
  };

  const leader: Team['leader'] = {
    name: `Leader ${index + 1}`,
    email: `leader${index+1}@example.com`,
    contactNumber: `987654321${index}`,
    tshirtSize: 'L',
    githubUrl: `https://github.com/leader${index+1}`,
    profilePictureUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=leader${index+1}`,
    skills: getRandomSkills(),
  };

  const members: Team['members'] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
    name: `Member ${index + 1}-${i + 1}`,
    email: `member${index+1}-${i+1}@example.com`,
    contactNumber: `987654321${index}${i}`,
    tshirtSize: 'M',
    githubUrl: `https://github.com/member${index+1}-${i+1}`,
    profilePictureUrl: `https://api.dicebear.com/8.x/adventurer/svg?seed=member${index+1}-${i+1}`,
    skills: getRandomSkills(),
  }));

  const hasSubmission = index % 2 === 0;

  return {
    id: teamId,
    name: teamName,
    leader,
    members,
    track: tracks[index % tracks.length],
    collegeName: 'University of Innovation',
    city: 'Techville, CA',
    projectSynopsis: `An innovative project about ${tracks[index % tracks.length].toLowerCase()} that will change the world.`,
    githubRepo: `https://github.com/leader${index+1}/${teamName.toLowerCase().replace(/\s/g, '-')}`,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${teamId}_${teamName.replace(/\s/g, '')}`,
    registeredAt: new Date(1672531200000 + (index * 1000000)).toISOString(),
    accommodation: index % 3 === 0,
    password: `password${index+1}`,
    paymentStatus: index % 4 === 0 ? 'Pending' : 'Paid',
    submission: hasSubmission ? {
        link: 'https://github.com/example/project',
        description: 'Our revolutionary project submission.',
        submittedAt: new Date().toISOString(),
    } : undefined,
    teamLogoUrl: index % 5 !== 0 ? `https://api.dicebear.com/8.x/shapes/svg?seed=${teamName}` : `https://api.dicebear.com/8.x/adventurer/svg?seed=${teamName}`,
    status: statuses[index % statuses.length],
    isVerified: index % 2 === 0,
    submissionTicket: `SUBMIT-${teamId}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };
};

export const mockTeams: Team[] = Array.from({ length: 12 }, (_, i) => generateTeam(i));


export const scheduleData: ScheduleItem[] = [
  { time: 'Day 1 - 09:00 AM', title: 'Registration & Breakfast', description: 'Check-in, grab your swag, and fuel up for the day.' },
  { time: 'Day 1 - 10:00 AM', title: 'Opening Ceremony', description: 'Kick-off talks, theme reveal, and official start of the hackathon.' },
  { time: 'Day 1 - 11:00 AM', title: 'Hacking Begins!', description: 'Let the coding commence! Find your spot and start building.' },
  { time: 'Day 1 - 01:00 PM', title: 'Lunch Break', description: 'Recharge with a delicious lunch.' },
  { time: 'Day 1 - 03:00 PM', title: 'Tech Workshop: AI/ML', description: 'An expert-led workshop on the latest AI trends and tools.' },
  { time: 'Day 1 - 07:00 PM', title: 'Dinner', description: 'Enjoy dinner and network with fellow hackers.' },
  { time: 'Day 2 - 12:00 AM', title: 'Midnight Challenge', description: 'A fun mini-challenge with special prizes.' },
  { time: 'Day 2 - 08:00 AM', title: 'Breakfast', description: 'Good morning! Breakfast is served.' },
  { time: 'Day 2 - 11:00 AM', title: 'Project Submissions Deadline', description: 'Finalize your projects and submit them for judging.' },
  { time: 'Day 2 - 12:00 PM', title: 'Lunch', description: 'Last meal before the final presentations.' },
  { time: 'Day 2 - 01:00 PM', title: 'Project Demos & Judging', description: 'Showcase your hard work to the judges.' },
  { time: 'Day 2 - 04:00 PM', 'title': 'Closing Ceremony & Prize Distribution', description: 'Find out who the winners are and celebrate everyone\'s achievements.' },
];

export const faqData: FaqItem[] = [
  { question: "Who can participate?", answer: "The hackathon is open to all university students, recent graduates, and professionals. If you love to code, design, or build, you're welcome!" },
  { question: "What is the team size?", answer: "You can form teams of 2 to 4 members. If you don't have a team, we'll have a team formation session at the beginning of the event." },
  { question: "Is there a registration fee?", answer: "Yes, there's a nominal fee of $10 per person to cover food, drinks, and swag. This is payable upon completion of online registration." },
  { question: "What should I bring?", answer: "Bring your laptop, chargers, any necessary hardware, and a valid ID. We'll provide the Wi-Fi, food, and a place to work." },
  { question: "What will we be building?", answer: "You can build anything you want related to the provided tracks. It can be a web app, mobile app, hardware hack, or anything else you can imagine." },
  { question: "What are the judging criteria?", answer: "Projects will be judged based on innovation, technical complexity, design/UX, and presentation. See the 'Details' section for more info." },
];

export const sponsorsData: Sponsor[] = [
    { name: 'Vercel', logoUrl: 'https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg', tier: 'Gold' },
    { name: 'GitHub', logoUrl: 'https://www.vectorlogo.zone/logos/github/github-icon.svg', tier: 'Gold' },
    { name: 'Figma', logoUrl: 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg', tier: 'Silver' },
    { name: 'Notion', logoUrl: 'https://www.vectorlogo.zone/logos/notion/notion-icon.svg', tier: 'Silver' },
    { name: 'Slack', logoUrl: 'https://www.vectorlogo.zone/logos/slack/slack-icon.svg', tier: 'Silver' },
    { name: 'Postman', logoUrl: 'https://www.vectorlogo.zone/logos/postman/postman-icon.svg', tier: 'Bronze' },
    { name: 'Twilio', logoUrl: 'https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg', tier: 'Bronze' },
    { name: 'JetBrains', logoUrl: 'https://www.vectorlogo.zone/logos/jetbrains/jetbrains-icon.svg', tier: 'Bronze' },
];

// New data for the redesigned dashboard
export const announcementsData = [
    { id: 1, time: '2 hours ago', content: 'The AI/ML workshop is starting in 30 minutes in Hall B. Don\'t miss out!', priority: 'high' as const },
    { id: 2, time: '5 hours ago', content: 'Lunch is now being served in the main cafeteria. Enjoy!', priority: 'medium' as const },
    { id: 3, time: '1 day ago', content: 'Welcome hackers! The opening ceremony is about to begin. Please take your seats.', priority: 'low' as const },
];

export const resourcesData = [
    { title: 'Official Hackathon Rules', link: '#' },
    { title: 'Starter Kit & Boilerplates', link: '#' },
    { title: 'Sponsor API Documentation', link: '#' },
    { title: 'Workshop Slides & Recordings', link: '#' },
];

export const mentorChatData: ChatMessage[] = [
    { from: 'mentor', text: 'Hey team! I\'m Dr. Reed, your mentor for this hackathon. I specialize in AI/ML. How can I help you get started?', time: '09:15 AM' },
    { from: 'mentor', text: 'Feel free to ask me anything about your project architecture, tech stack, or if you just need to bounce some ideas around. Good luck!', time: '09:16 AM' },
];

export const attractionsData: Attraction[] = [
  {
    name: 'Jog Falls',
    imageUrl: 'https://picsum.photos/seed/jogfalls/800/600',
    shortDescription: 'India\'s second-highest plunge waterfall, a breathtaking natural spectacle.',
    longDescription: 'Jog Falls is a major tourist attraction, created by the Sharavathi River falling from a height of 253 meters. The thunderous sound and the spectacular view of the four cascades - Raja, Rani, Rocket, and Roarer - make it a must-visit destination.',
    activities: ['Sightseeing', 'Photography', 'Trekking to the base', 'Visiting nearby viewpoints'],
    gettingThere: 'Approximately a 2-hour drive from the venue. Local buses and private taxis are available.'
  },
  {
    name: 'Kodachadri Hills',
    imageUrl: 'https://picsum.photos/seed/kodachadri/800/600',
    shortDescription: 'A paradise for trekkers, offering stunning sunset views and lush landscapes.',
    longDescription: 'Located in the Western Ghats, Kodachadri is a natural heritage site. The peak offers a stunning view of the sunset into the Arabian Sea. The trek takes you through dense forests, waterfalls, and ancient temples.',
    activities: ['Trekking', 'Jeep Safari', 'Camping', 'Visiting Sarvajna Peetha', 'Sunset Viewing'],
    gettingThere: 'Around a 3-hour drive to the base. A local jeep is required to reach the peak, which can be hired from the base camp.'
  },
  {
    name: 'Sakrebailu Elephant Camp',
    imageUrl: 'https://picsum.photos/seed/elephants/800/600',
    shortDescription: 'An interactive experience where you can watch elephants bathe and play.',
    longDescription: 'Situated on the banks of the River Tunga, this camp is a forest department initiative. It is a unique opportunity to see elephants up close as they are brought from the nearby forests for a bath and feeding.',
    activities: ['Watching elephants bathe', 'Feeding elephants (with permission)', 'Photography', 'Learning about elephant conservation'],
    gettingThere: 'A short 30-minute drive from the event venue. Easily accessible by local transport.'
  },
  {
    name: 'Bhadra Dam',
    imageUrl: 'https://picsum.photos/seed/bhadradam/800/600',
    shortDescription: 'A scenic dam with beautiful gardens and water sports activities.',
    longDescription: 'The Bhadra Dam, built on the Bhadra River, is a popular spot for picnics and outings. The reservoir creates a massive water body, and the surrounding area is lush and green. It offers beautiful views, especially during sunset.',
    activities: ['Boating', 'Kayaking', 'Picnicking', 'Photography', 'Enjoying the sunset view'],
    gettingThere: 'About a 1-hour drive from the venue. Best visited by private vehicle or taxi.'
  }
];