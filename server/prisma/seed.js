import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@harican.com' },
    update: {},
    create: {
      email: 'admin@harican.com',
      password: adminPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
      educationLevel: 'Masters',
      department: 'Computer Science',
      experienceLevel: 'Senior',
      preferredCareerTrack: 'Management'
    }
  });

  // Create sample company user (poster)
  const posterPassword = await bcrypt.hash('Poster@123', 10);
  const poster = await prisma.user.upsert({
    where: { email: 'company@harican.com' },
    update: {},
    create: {
      email: 'company@harican.com',
      password: posterPassword,
      fullName: 'Tech Corp HR',
      role: 'POSTER',
      emailVerified: true,
      educationLevel: 'Bachelors',
      department: 'Human Resources',
      experienceLevel: 'Mid',
      preferredCareerTrack: 'HR & Recruitment'
    }
  });

  // Seed Jobs (20+ entries)
  const jobs = [
    {
      title: 'Junior Frontend Developer',
      company: 'Tech Innovations Ltd',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Fresher',
      description: 'Looking for a passionate frontend developer to join our team.',
      requirements: ['Basic HTML/CSS knowledge', 'JavaScript fundamentals', 'Team player'],
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      salary: '25,000 - 35,000 BDT',
      applicationUrl: 'https://example.com/apply/1',
      postedById: poster.id
    },
    {
      title: 'Backend Developer Intern',
      company: 'StartUp Hub',
      location: 'Chittagong',
      isRemote: true,
      jobType: 'Internship',
      experienceLevel: 'Fresher',
      description: 'Internship opportunity for backend development enthusiasts.',
      requirements: ['Basic programming knowledge', 'Eager to learn', 'Good communication'],
      skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
      salary: '10,000 - 15,000 BDT',
      applicationUrl: 'https://example.com/apply/2',
      postedById: poster.id
    },
    {
      title: 'UI/UX Designer',
      company: 'Creative Agency',
      location: 'Remote',
      isRemote: true,
      jobType: 'Part-time',
      experienceLevel: 'Junior',
      description: 'Design beautiful and intuitive user interfaces.',
      requirements: ['Portfolio required', 'Figma/Adobe XD experience', 'Creative thinking'],
      skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Design', 'Prototyping'],
      salary: '30,000 - 40,000 BDT',
      applicationUrl: 'https://example.com/apply/3',
      postedById: poster.id
    },
    {
      title: 'Data Analyst Intern',
      company: 'DataTech Solutions',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Internship',
      experienceLevel: 'Fresher',
      description: 'Analyze data and create insightful reports.',
      requirements: ['Excel proficiency', 'Basic statistics', 'Analytical mindset'],
      skills: ['Excel', 'Python', 'Data Analysis', 'SQL'],
      salary: '12,000 - 18,000 BDT',
      applicationUrl: 'https://example.com/apply/4',
      postedById: poster.id
    },
    {
      title: 'Digital Marketing Specialist',
      company: 'Marketing Pro',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Junior',
      description: 'Manage social media and digital marketing campaigns.',
      requirements: ['Social media experience', 'Content creation', 'SEO knowledge'],
      skills: ['Social Media Marketing', 'SEO', 'Content Writing', 'Google Ads'],
      salary: '20,000 - 30,000 BDT',
      applicationUrl: 'https://example.com/apply/5',
      postedById: poster.id
    },
    {
      title: 'Full Stack Developer',
      company: 'Web Solutions Inc',
      location: 'Remote',
      isRemote: true,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Build and maintain full-stack web applications.',
      requirements: ['2+ years experience', 'Strong problem-solving', 'Team collaboration'],
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'REST API'],
      salary: '50,000 - 70,000 BDT',
      applicationUrl: 'https://example.com/apply/6',
      postedById: poster.id
    },
    {
      title: 'Mobile App Developer',
      company: 'App Factory',
      location: 'Sylhet',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Junior',
      description: 'Develop mobile applications for Android and iOS.',
      requirements: ['React Native or Flutter', 'Mobile UI/UX understanding', 'API integration'],
      skills: ['React Native', 'Flutter', 'Mobile Development', 'Firebase'],
      salary: '35,000 - 50,000 BDT',
      applicationUrl: 'https://example.com/apply/7',
      postedById: poster.id
    },
    {
      title: 'Content Writer',
      company: 'Content Hub',
      location: 'Remote',
      isRemote: true,
      jobType: 'Freelance',
      experienceLevel: 'Fresher',
      description: 'Write engaging content for websites and blogs.',
      requirements: ['Good English writing', 'Research skills', 'SEO basics'],
      skills: ['Content Writing', 'SEO', 'Research', 'Communication'],
      salary: 'Per article basis',
      applicationUrl: 'https://example.com/apply/8',
      postedById: poster.id
    },
    {
      title: 'Graphic Designer',
      company: 'Design Studio',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Part-time',
      experienceLevel: 'Fresher',
      description: 'Create visual designs for marketing materials.',
      requirements: ['Adobe Creative Suite', 'Portfolio', 'Creative thinking'],
      skills: ['Photoshop', 'Illustrator', 'Graphic Design', 'Branding'],
      salary: '15,000 - 25,000 BDT',
      applicationUrl: 'https://example.com/apply/9',
      postedById: poster.id
    },
    {
      title: 'QA Tester',
      company: 'Software Testing Co',
      location: 'Chittagong',
      isRemote: true,
      jobType: 'Full-time',
      experienceLevel: 'Fresher',
      description: 'Test software applications and report bugs.',
      requirements: ['Attention to detail', 'Basic testing knowledge', 'Documentation skills'],
      skills: ['Manual Testing', 'Test Cases', 'Bug Reporting', 'Selenium'],
      salary: '20,000 - 30,000 BDT',
      applicationUrl: 'https://example.com/apply/10',
      postedById: poster.id
    },
    {
      title: 'DevOps Engineer',
      company: 'Cloud Solutions',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Manage cloud infrastructure and CI/CD pipelines.',
      requirements: ['AWS/Azure experience', 'Docker knowledge', 'Linux proficiency'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
      salary: '60,000 - 80,000 BDT',
      applicationUrl: 'https://example.com/apply/11',
      postedById: poster.id
    },
    {
      title: 'Python Developer',
      company: 'AI Solutions',
      location: 'Remote',
      isRemote: true,
      jobType: 'Full-time',
      experienceLevel: 'Junior',
      description: 'Develop Python applications and scripts.',
      requirements: ['Python proficiency', 'Problem-solving skills', 'API development'],
      skills: ['Python', 'Django', 'Flask', 'REST API', 'PostgreSQL'],
      salary: '40,000 - 55,000 BDT',
      applicationUrl: 'https://example.com/apply/12',
      postedById: poster.id
    },
    {
      title: 'Business Analyst',
      company: 'Consulting Group',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Junior',
      description: 'Analyze business processes and recommend improvements.',
      requirements: ['Analytical skills', 'Excel proficiency', 'Communication'],
      skills: ['Business Analysis', 'Excel', 'SQL', 'Communication', 'Documentation'],
      salary: '35,000 - 45,000 BDT',
      applicationUrl: 'https://example.com/apply/13',
      postedById: poster.id
    },
    {
      title: 'Customer Support Representative',
      company: 'Support Center',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Part-time',
      experienceLevel: 'Fresher',
      description: 'Provide customer support via phone and email.',
      requirements: ['Good communication', 'Patient attitude', 'Problem-solving'],
      skills: ['Communication', 'Customer Service', 'Email Support', 'Time Management'],
      salary: '15,000 - 20,000 BDT',
      applicationUrl: 'https://example.com/apply/14',
      postedById: poster.id
    },
    {
      title: 'Video Editor',
      company: 'Media Production',
      location: 'Remote',
      isRemote: true,
      jobType: 'Freelance',
      experienceLevel: 'Fresher',
      description: 'Edit videos for YouTube and social media.',
      requirements: ['Video editing software knowledge', 'Creativity', 'Portfolio'],
      skills: ['Premiere Pro', 'After Effects', 'Video Editing', 'Motion Graphics'],
      salary: 'Per project basis',
      applicationUrl: 'https://example.com/apply/15',
      postedById: poster.id
    },
    {
      title: 'Network Administrator',
      company: 'IT Services',
      location: 'Chittagong',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Mid',
      description: 'Manage and maintain network infrastructure.',
      requirements: ['Networking knowledge', 'Cisco certification preferred', 'Troubleshooting'],
      skills: ['Networking', 'Cisco', 'Network Security', 'Troubleshooting'],
      salary: '45,000 - 60,000 BDT',
      applicationUrl: 'https://example.com/apply/16',
      postedById: poster.id
    },
    {
      title: 'Sales Executive',
      company: 'Sales Corp',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Fresher',
      description: 'Sell products and services to potential clients.',
      requirements: ['Sales skills', 'Communication', 'Target-oriented'],
      skills: ['Sales', 'Communication', 'Negotiation', 'Presentation'],
      salary: '20,000 - 30,000 BDT + Commission',
      applicationUrl: 'https://example.com/apply/17',
      postedById: poster.id
    },
    {
      title: 'WordPress Developer',
      company: 'Web Agency',
      location: 'Remote',
      isRemote: true,
      jobType: 'Part-time',
      experienceLevel: 'Junior',
      description: 'Build and maintain WordPress websites.',
      requirements: ['WordPress experience', 'PHP basics', 'Theme customization'],
      skills: ['WordPress', 'PHP', 'HTML', 'CSS', 'MySQL'],
      salary: '25,000 - 35,000 BDT',
      applicationUrl: 'https://example.com/apply/18',
      postedById: poster.id
    },
    {
      title: 'Machine Learning Intern',
      company: 'AI Research Lab',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Internship',
      experienceLevel: 'Fresher',
      description: 'Work on machine learning projects and research.',
      requirements: ['Python knowledge', 'ML basics', 'Mathematics background'],
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
      salary: '15,000 - 20,000 BDT',
      applicationUrl: 'https://example.com/apply/19',
      postedById: poster.id
    },
    {
      title: 'HR Coordinator',
      company: 'HR Solutions',
      location: 'Dhaka',
      isRemote: false,
      jobType: 'Full-time',
      experienceLevel: 'Junior',
      description: 'Assist with recruitment and employee management.',
      requirements: ['HR knowledge', 'Communication skills', 'Organizational skills'],
      skills: ['HR Management', 'Recruitment', 'Communication', 'MS Office'],
      salary: '25,000 - 35,000 BDT',
      applicationUrl: 'https://example.com/apply/20',
      postedById: poster.id
    }
  ];

  console.log('Seeding jobs...');
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { 
        id: job.title.toLowerCase().replace(/\s+/g, '-') 
      },
      update: {},
      create: job
    });
  }

  // Seed Learning Resources (20+ entries)
  const resources = [
    {
      title: 'HTML & CSS Crash Course',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example1',
      description: 'Learn HTML and CSS basics in one video',
      skills: ['HTML', 'CSS'],
      costType: 'Free',
      duration: '2 hours',
      level: 'Beginner',
      rating: 4.8
    },
    {
      title: 'JavaScript Full Course',
      platform: 'freeCodeCamp',
      url: 'https://www.freecodecamp.org/learn/javascript',
      description: 'Complete JavaScript programming course',
      skills: ['JavaScript'],
      costType: 'Free',
      duration: '300 hours',
      level: 'Beginner',
      rating: 4.9
    },
    {
      title: 'React - The Complete Guide',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/react-the-complete-guide',
      description: 'Master React from basics to advanced',
      skills: ['React', 'JavaScript'],
      costType: 'Paid',
      duration: '40 hours',
      level: 'Intermediate',
      rating: 4.7
    },
    {
      title: 'Node.js Tutorial for Beginners',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example2',
      description: 'Learn backend development with Node.js',
      skills: ['Node.js', 'JavaScript'],
      costType: 'Free',
      duration: '3 hours',
      level: 'Beginner',
      rating: 4.6
    },
    {
      title: 'MongoDB Crash Course',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example3',
      description: 'Quick introduction to MongoDB',
      skills: ['MongoDB', 'Database'],
      costType: 'Free',
      duration: '1.5 hours',
      level: 'Beginner',
      rating: 4.5
    },
    {
      title: 'Python for Everybody',
      platform: 'Coursera',
      url: 'https://www.coursera.org/specializations/python',
      description: 'Learn Python programming from scratch',
      skills: ['Python'],
      costType: 'Free',
      duration: '8 months',
      level: 'Beginner',
      rating: 4.8
    },
    {
      title: 'UI/UX Design Fundamentals',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/ui-ux-design',
      description: 'Master the basics of UI/UX design',
      skills: ['UI Design', 'UX Design', 'Figma'],
      costType: 'Paid',
      duration: '15 hours',
      level: 'Beginner',
      rating: 4.6
    },
    {
      title: 'Figma Tutorial for Beginners',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example4',
      description: 'Complete Figma design tutorial',
      skills: ['Figma', 'UI Design'],
      costType: 'Free',
      duration: '2 hours',
      level: 'Beginner',
      rating: 4.7
    },
    {
      title: 'Data Analysis with Python',
      platform: 'Coursera',
      url: 'https://www.coursera.org/learn/data-analysis-with-python',
      description: 'Analyze data using Python libraries',
      skills: ['Python', 'Data Analysis', 'Pandas'],
      costType: 'Free',
      duration: '6 weeks',
      level: 'Intermediate',
      rating: 4.7
    },
    {
      title: 'SQL for Data Science',
      platform: 'Coursera',
      url: 'https://www.coursera.org/learn/sql-for-data-science',
      description: 'Learn SQL for data analysis',
      skills: ['SQL', 'Database', 'Data Analysis'],
      costType: 'Free',
      duration: '4 weeks',
      level: 'Beginner',
      rating: 4.6
    },
    {
      title: 'Digital Marketing Course',
      platform: 'Google Digital Garage',
      url: 'https://learndigital.withgoogle.com/digitalgarage',
      description: 'Free digital marketing certification',
      skills: ['Digital Marketing', 'SEO', 'Social Media Marketing'],
      costType: 'Free',
      duration: '40 hours',
      level: 'Beginner',
      rating: 4.5
    },
    {
      title: 'SEO Training Course',
      platform: 'Moz',
      url: 'https://moz.com/beginners-guide-to-seo',
      description: 'Comprehensive SEO guide',
      skills: ['SEO', 'Digital Marketing'],
      costType: 'Free',
      duration: '10 hours',
      level: 'Beginner',
      rating: 4.8
    },
    {
      title: 'Excel Skills for Business',
      platform: 'Coursera',
      url: 'https://www.coursera.org/specializations/excel',
      description: 'Master Excel for business applications',
      skills: ['Excel', 'Data Analysis'],
      costType: 'Free',
      duration: '6 months',
      level: 'Beginner',
      rating: 4.9
    },
    {
      title: 'Photoshop Essentials',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/photoshop-essentials',
      description: 'Learn Adobe Photoshop basics',
      skills: ['Photoshop', 'Graphic Design'],
      costType: 'Paid',
      duration: '10 hours',
      level: 'Beginner',
      rating: 4.6
    },
    {
      title: 'Communication Skills Masterclass',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/communication-skills',
      description: 'Improve your communication skills',
      skills: ['Communication', 'Presentation'],
      costType: 'Paid',
      duration: '5 hours',
      level: 'Beginner',
      rating: 4.7
    },
    {
      title: 'Git & GitHub Tutorial',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example5',
      description: 'Version control with Git and GitHub',
      skills: ['Git', 'GitHub'],
      costType: 'Free',
      duration: '1 hour',
      level: 'Beginner',
      rating: 4.8
    },
    {
      title: 'TypeScript Course',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/understanding-typescript',
      description: 'Master TypeScript programming',
      skills: ['TypeScript', 'JavaScript'],
      costType: 'Paid',
      duration: '15 hours',
      level: 'Intermediate',
      rating: 4.7
    },
    {
      title: 'Docker for Beginners',
      platform: 'YouTube',
      url: 'https://www.youtube.com/watch?v=example6',
      description: 'Introduction to Docker containerization',
      skills: ['Docker', 'DevOps'],
      costType: 'Free',
      duration: '2 hours',
      level: 'Beginner',
      rating: 4.6
    },
    {
      title: 'AWS Cloud Practitioner',
      platform: 'AWS Training',
      url: 'https://aws.amazon.com/training',
      description: 'Get started with AWS cloud services',
      skills: ['AWS', 'Cloud Computing'],
      costType: 'Free',
      duration: '6 hours',
      level: 'Beginner',
      rating: 4.8
    },
    {
      title: 'Video Editing with Premiere Pro',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/premiere-pro',
      description: 'Professional video editing course',
      skills: ['Premiere Pro', 'Video Editing'],
      costType: 'Paid',
      duration: '12 hours',
      level: 'Beginner',
      rating: 4.7
    },
    {
      title: 'Flutter Mobile Development',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/flutter-bootcamp',
      description: 'Build mobile apps with Flutter',
      skills: ['Flutter', 'Mobile Development', 'Dart'],
      costType: 'Paid',
      duration: '30 hours',
      level: 'Intermediate',
      rating: 4.8
    },
    {
      title: 'Machine Learning A-Z',
      platform: 'Udemy',
      url: 'https://www.udemy.com/course/machinelearning',
      description: 'Complete machine learning course',
      skills: ['Machine Learning', 'Python', 'Data Science'],
      costType: 'Paid',
      duration: '44 hours',
      level: 'Intermediate',
      rating: 4.5
    }
  ];

  console.log('Seeding learning resources...');
  for (const resource of resources) {
    await prisma.learningResource.upsert({
      where: { 
        id: resource.title.toLowerCase().replace(/\s+/g, '-') 
      },
      update: {},
      create: resource
    });
  }

  console.log('Seed completed successfully!');
  console.log('\nTest Credentials:');
  console.log('Admin: admin@harican.com / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
