"use client";
import React, { useState } from "react";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { 
  Search, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Star,
  Clock,
  Users,
  DollarSign,
  Filter,
  PlayCircle,
  Download
} from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Complete JavaScript Course for Beginners",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=EerdGm-ehJQ",
    relatedSkills: ["JavaScript", "Web Development", "Programming"],
    cost: "Free",
    rating: 4.8,
    duration: "8 hours",
    students: 50000,
    type: "Video Course",
    description: "Learn JavaScript from scratch with hands-on projects and real-world examples.",
    instructor: "Code Academy",
    level: "Beginner",
    lastUpdated: "2 months ago"
  },
  {
    id: 2,
    title: "React Development Masterclass",
    platform: "Udemy",
    url: "https://www.udemy.com/course/complete-reactjs-masterclass/",
    relatedSkills: ["React", "JavaScript", "Frontend"],
    cost: "Paid",
    price: "$59.99",
    rating: 4.9,
    duration: "12 hours",
    students: 14108,
    type: "Video Course",
    description: "Become React Developer: React Core, Hooks, APIs,Routing, Context, Reducers, Redux, Firebase, Tailwind, Deployment & More",
    instructor: "Tech Guru",
    level: "Intermediate",
    lastUpdated: "1 month ago"
  },
  {
    id: 3,
    title: "Data Analysis with Python and Pandas",
    platform: "Coursera",
    url: "https://www.coursera.org/specializations/packt-data-analysis-with-pandas-and-python?msockid=229e7fbea9ec675716ae698ba85e66e4",
    relatedSkills: ["Python", "Data Analysis", "Pandas", "Statistics"],
    cost: "Free",
    rating: 4.8,
    duration: "6 weeks",
    students: 2409,
    type: "Online Course",
    description: "Learn to analyze data using Python and popular libraries like Pandas and NumPy.",
    instructor: "Data Science Institute",
    level: "Intermediate",
    lastUpdated: "3 weeks ago"
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    platform: "Figma Academy",
    url: "https://figma.com/academy",
    relatedSkills: ["UI Design", "UX Design", "Figma", "Design Thinking"],
    cost: "Free",
    rating: 4.6,
    duration: "4 hours",
    students: 30000,
    type: "Interactive Tutorial",
    description: "Master the fundamentals of user interface and user experience design.",
    instructor: "Figma Team",
    level: "Beginner",
    lastUpdated: "1 week ago"
  },
  {
    id: 5,
    title: "Excel for Business Analytics",
    platform: "LinkedIn Learning",
    url: "https://www.linkedin.com/learning/excel-for-business-analysts",
    relatedSkills: ["Excel", "Data Analysis", "Business Analytics", "Charts"],
    cost: "Paid",
    price: "$29.99/month",
    rating: 4.5,
    duration: "3 hours",
    students: 20000,
    type: "Video Course",
    description: "Learn advanced Excel techniques for business data analysis and reporting.",
    instructor: "Business Analytics Pro",
    level: "Intermediate",
    lastUpdated: "2 weeks ago"
  },
  {
    id: 6,
    title: "Digital Marketing Fundamentals",
    platform: "Google Digital Garage",
    url: "https://learndigital.withgoogle.com",
    relatedSkills: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    cost: "Free",
    rating: 4.4,
    duration: "40 hours",
    students: 100000,
    type: "Certification Course",
    description: "Get certified in digital marketing fundamentals by Google.",
    instructor: "Google",
    level: "Beginner",
    lastUpdated: "1 month ago"
  },
  {
    id: 7,
    title: "Communication Skills for Workplace",
    platform: "Coursera",
    url: "https://www.coursera.org/learn/communication-in-the-workplace?msockid=229e7fbea9ec675716ae698ba85e66e4",
    relatedSkills: ["Communication", "Presentation", "Leadership", "Teamwork"],
    cost: "Free",
    rating: 4.3,
    duration: "4 weeks",
    students: 45000,
    type: "Online Course",
    description: "Develop effective communication skills for professional environments.",
    instructor: "University of California",
    level: "Beginner",
    lastUpdated: "2 months ago"
  },
  {
    id: 8,
    title: "SQL Database Management",
    platform: "W3Schools",
    url: "https://w3schools.com/sql",
    relatedSkills: ["SQL", "Database", "MySQL", "Data Management"],
    cost: "Free",
    rating: 4.2,
    duration: "Self-paced",
    students: 75000,
    type: "Interactive Tutorial",
    description: "Learn SQL from basics to advanced database management techniques.",
    instructor: "W3Schools Team",
    level: "Beginner",
    lastUpdated: "1 week ago"
  }
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCost, setSelectedCost] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const costOptions = ["all", "Free", "Paid"];
  const levelOptions = ["all", "Beginner", "Intermediate", "Advanced"];
  const typeOptions = ["all", "Video Course", "Online Course", "Interactive Tutorial", "Certification Course"];

  const filteredResources = resources
    .filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.relatedSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      resource.platform.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(resource => 
      selectedCost === "all" || resource.cost === selectedCost
    )
    .filter(resource => 
      selectedLevel === "all" || resource.level === selectedLevel
    )
    .filter(resource => 
      selectedType === "all" || resource.type === selectedType
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "students":
          return b.students - a.students;
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  const getRecommendedResources = (userSkills: string[] = ["JavaScript", "Communication"]) => {
    return resources
      .filter(resource => 
        resource.relatedSkills.some(skill => 
          userSkills.some(userSkill => 
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        )
      )
      .slice(0, 3);
  };

  const recommendedResources = getRecommendedResources();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Resources
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover courses, tutorials, and learning materials to build your skills and advance your career.
            </p>
          </div>

          {/* Recommended Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recommended for You
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendedResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <span className="text-sm text-blue-600 font-medium">{resource.platform}</span>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {resource.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      resource.cost === "Free" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-orange-100 text-orange-800"
                    }`}>
                      {resource.cost}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.relatedSkills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Learning
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search resources, skills, or platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedCost}
                onChange={(e) => setSelectedCost(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                {costOptions.map((cost) => (
                  <option key={cost} value={cost}>
                    {cost === "all" ? "All Pricing" : cost}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="rating">Highest Rated</option>
                <option value="students">Most Popular</option>
                <option value="recent">Recently Updated</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found {filteredResources.length} learning resources
            </p>
          </div>

          {/* Resource Listings */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                      {resource.type.includes("Video") ? (
                        <PlayCircle className="h-6 w-6 text-blue-600" />
                      ) : resource.type.includes("Interactive") ? (
                        <FileText className="h-6 w-6 text-blue-600" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-blue-600 font-medium">{resource.platform}</span>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {resource.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.cost === "Free" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-orange-100 text-orange-800"
                  }`}>
                    {resource.cost === "Paid" ? resource.price : resource.cost}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {resource.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {resource.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {resource.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {resource.students.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.relatedSkills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {resource.relatedSkills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs rounded">
                      +{resource.relatedSkills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    Start Learning
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or browse our recommended resources above.
              </p>
            </div>
          )}
        
      </div>
    </div>
  );
}
