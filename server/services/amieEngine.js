const LearnerProfile = require('../models/LearnerProfile');
const MentorProfile = require('../models/MentorProfile');
const QuizResult = require('../models/QuizResult');

const getExplainableRecommendations = async (userId) => {
  const learnerProfile = await LearnerProfile.findOne({ userId });
  const recentQuizzes = await QuizResult.find({ userId }).sort({ createdAt: -1 });
  const mentors = await MentorProfile.find().populate('userId', 'name email role');

  const learnerSkills = learnerProfile?.skills || [];
  const careerGoal = learnerProfile?.careerGoal || 'Software Engineer';

  const recommendations = mentors.map((mentor) => {
    let score = 50; // Base score
    const reasons = [];

    // 1. Expertise Overlap Match (Up to 35 Points)
    const mentorExpertiseNames = mentor.expertise.map((e) => e.name.toLowerCase());
    const learnerSkillNames = learnerSkills.map((s) => s.name.toLowerCase());

    const overlappingSkills = mentor.expertise.filter((e) =>
      learnerSkillNames.includes(e.name.toLowerCase()) ||
      careerGoal.toLowerCase().includes(e.name.toLowerCase())
    );

    if (overlappingSkills.length > 0) {
      score += Math.min(overlappingSkills.length * 12, 35);
      reasons.push(
        `Expertise alignment in ${overlappingSkills.map((e) => e.name).join(', ')}`
      );
    } else {
      reasons.push(`Offers complementary technical guidance for ${careerGoal}`);
    }

    // 2. Experience & Rating Boost (Up to 25 Points)
    if (mentor.experience >= 8) {
      score += 15;
      reasons.push(`Senior Mentor with ${mentor.experience}+ years of industry experience`);
    } else if (mentor.experience >= 4) {
      score += 10;
      reasons.push(`Experienced Mentor with ${mentor.experience} years of field experience`);
    }

    if (mentor.rating >= 4.8) {
      score += 10;
      reasons.push(`Top rated mentor (${mentor.rating}★ rating)`);
    }

    // 3. Quiz Score Gap Boost (Up to 15 Points)
    recentQuizzes.forEach((quiz) => {
      const isDomainMatch = mentorExpertiseNames.some((exp) => exp.includes(quiz.skill.toLowerCase()));
      if (isDomainMatch && quiz.percentage < 80) {
        score += 12;
        reasons.push(
          `Can assist in strengthening ${quiz.skill} (assessed at ${quiz.levelAssessed} level)`
        );
      }
    });

    // 4. Availability Boost (10 Points)
    if (mentor.availability && mentor.availability.length > 0) {
      score += 10;
      reasons.push(`Active weekly session availability (${mentor.availability[0]})`);
    }

    const finalMatchScore = Math.min(Math.round(score), 98);

    return {
      mentorId: mentor.userId?._id,
      mentorProfileId: mentor._id,
      name: mentor.userId?.name || 'Verified Mentor',
      email: mentor.userId?.email,
      bio: mentor.bio,
      profileImage: mentor.profileImage || mentor.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.userId?.name}`,
      experience: mentor.experience,
      expertise: mentor.expertise,
      sessionPrice: mentor.sessionPrice || mentor.hourlyFee || 50,
      availability: mentor.availability,
      rating: mentor.rating,
      matchScore: finalMatchScore,
      reasons: reasons.slice(0, 3), // Top 3 reasons
    };
  });

  // Sort by highest match score
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
};

module.exports = {
  getExplainableRecommendations,
};
