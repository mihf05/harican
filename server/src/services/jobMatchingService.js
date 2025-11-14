/**
 * Calculate job match score and provide detailed reasoning
 * @param {Object} job - The job posting
 * @param {Object} userProfile - User's profile with skills and preferences
 * @returns {Object} Match score, percentage, and detailed reasoning
 */
export function calculateJobMatch(job, userProfile) {
  let totalScore = 0;
  let maxScore = 100;
  const matchReasons = [];
  const missingSkills = [];
  const matchedSkills = [];

  // 1. Skills Match (50 points max)
  const userSkillNames = (userProfile.skills || []).map(s => 
    typeof s === 'string' ? s.toLowerCase() : s.skillName?.toLowerCase()
  ).filter(Boolean);
  
  const jobSkills = (job.skills || []).map(s => s.toLowerCase());
  
  if (jobSkills.length > 0 && userSkillNames.length > 0) {
    jobSkills.forEach(jobSkill => {
      const matched = userSkillNames.some(userSkill => 
        userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
      );
      
      if (matched) {
        matchedSkills.push(jobSkill);
      } else {
        missingSkills.push(jobSkill);
      }
    });

    const skillMatchPercentage = (matchedSkills.length / jobSkills.length) * 50;
    totalScore += skillMatchPercentage;

    if (matchedSkills.length > 0) {
      matchReasons.push(`✅ Matches ${matchedSkills.length} skill${matchedSkills.length > 1 ? 's' : ''}: ${matchedSkills.slice(0, 5).join(', ')}`);
    }
    
    if (missingSkills.length > 0) {
      matchReasons.push(`⚠️ Missing ${missingSkills.length} skill${missingSkills.length > 1 ? 's' : ''}: ${missingSkills.slice(0, 5).join(', ')}`);
    }
  } else {
    matchReasons.push('⚠️ No skills to match');
  }

  // 2. Experience Level Match (25 points max)
  const experienceLevels = ['Fresher', 'Junior', 'Mid', 'Senior'];
  const userLevel = userProfile.experienceLevel || 'Fresher';
  const jobLevel = job.experienceLevel;

  if (userLevel === jobLevel) {
    totalScore += 25;
    matchReasons.push(`✅ Perfect experience level match: ${jobLevel}`);
  } else {
    const userLevelIndex = experienceLevels.indexOf(userLevel);
    const jobLevelIndex = experienceLevels.indexOf(jobLevel);
    const difference = Math.abs(userLevelIndex - jobLevelIndex);

    if (difference === 1) {
      totalScore += 15;
      matchReasons.push(`✓ Close experience level: You're ${userLevel}, job needs ${jobLevel}`);
    } else if (difference === 2) {
      totalScore += 8;
      matchReasons.push(`⚠️ Experience gap: You're ${userLevel}, job needs ${jobLevel}`);
    } else {
      totalScore += 3;
      matchReasons.push(`⚠️ Significant experience gap: You're ${userLevel}, job needs ${jobLevel}`);
    }
  }

  // 3. Career Track/Interest Match (15 points max)
  const userTrack = (userProfile.preferredCareerTrack || '').toLowerCase();
  const jobTitle = (job.title || '').toLowerCase();
  const jobDescription = (job.description || '').toLowerCase();

  if (userTrack) {
    const trackWords = userTrack.split(/\s+/);
    let trackMatches = 0;

    trackWords.forEach(word => {
      if (word.length > 3 && (jobTitle.includes(word) || jobDescription.includes(word))) {
        trackMatches++;
      }
    });

    if (trackMatches > 0) {
      const trackScore = Math.min((trackMatches / trackWords.length) * 15, 15);
      totalScore += trackScore;
      matchReasons.push(`✅ Aligns with your career track: ${userProfile.preferredCareerTrack}`);
    } else {
      matchReasons.push(`⚠️ May not align with your preferred track: ${userProfile.preferredCareerTrack}`);
    }
  } else {
    totalScore += 5; // Give some points if no preference set
    matchReasons.push('ℹ️ No career track preference set');
  }

  // 4. Job Type & Education (10 points max)
  let bonusScore = 0;

  // Education match
  if (userProfile.educationLevel && job.description) {
    const educationKeywords = {
      'Bachelor': ['bachelor', 'undergraduate', 'bsc', 'ba', 'btech'],
      'Master': ['master', 'postgraduate', 'msc', 'ma', 'mtech'],
      'PhD': ['phd', 'doctorate'],
      'Diploma': ['diploma', 'certificate']
    };

    const userEduLevel = userProfile.educationLevel;
    const keywords = educationKeywords[userEduLevel] || [];
    const descLower = job.description.toLowerCase();

    if (keywords.some(kw => descLower.includes(kw))) {
      bonusScore += 5;
      matchReasons.push(`✅ Education level matches: ${userEduLevel}`);
    }
  }

  // Remote work preference (if user profile indicates preference)
  if (job.isRemote) {
    bonusScore += 5;
    matchReasons.push(`✅ Remote position available`);
  }

  totalScore += bonusScore;

  // Calculate final percentage
  const matchPercentage = Math.round(Math.min(totalScore, maxScore));

  // Determine match quality
  let matchQuality = 'Poor';
  if (matchPercentage >= 80) matchQuality = 'Excellent';
  else if (matchPercentage >= 65) matchQuality = 'Good';
  else if (matchPercentage >= 50) matchQuality = 'Fair';

  // Generate recommendations
  const recommendations = [];
  
  if (missingSkills.length > 0 && missingSkills.length <= 3) {
    recommendations.push(`Consider learning: ${missingSkills.join(', ')}`);
  }
  
  if (matchPercentage >= 60) {
    recommendations.push('This job is a good match - consider applying!');
  }

  return {
    matchScore: totalScore,
    matchPercentage,
    matchQuality,
    matchedSkills,
    missingSkills,
    matchReasons,
    recommendations,
    breakdown: {
      skillsMatch: Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 50),
      experienceMatch: Math.round((totalScore / maxScore) * 25),
      careerTrackMatch: Math.round((totalScore / maxScore) * 15),
      bonusPoints: bonusScore
    }
  };
}

/**
 * Get external job platform search URLs for a job
 * @param {Object} job - The job posting
 * @returns {Object} URLs for various job platforms
 */
export function getExternalJobPlatformLinks(job) {
  const searchQuery = encodeURIComponent(`${job.title} ${job.company}`);
  const location = encodeURIComponent(job.location);

  return {
    linkedin: `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${location}`,
    bdjobs: `https://www.bdjobs.com/jobsearch.asp?fcatId=0&icatId=0&lcatId=0&jobTitle=${searchQuery}`,
    glassdoor: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${searchQuery}&locT=C&locId=${location}`,
    indeed: `https://www.indeed.com/jobs?q=${searchQuery}&l=${location}`,
    bayt: `https://www.bayt.com/en/bangladesh/jobs/${searchQuery}-jobs/`,
    github: job.skills.some(s => ['javascript', 'python', 'java', 'golang', 'rust'].includes(s.toLowerCase())) 
      ? `https://github.com/search?q=${searchQuery}&type=repositories` 
      : null,
    angellist: `https://angel.co/jobs?q=${searchQuery}`,
    remoteok: job.isRemote ? `https://remoteok.com/remote-jobs/${searchQuery.toLowerCase().replace(/\s+/g, '-')}` : null
  };
}
