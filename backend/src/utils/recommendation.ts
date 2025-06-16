import { BadgeTier } from '@prisma/client';

// Define all known skills in the system with their variations
const SKILL_VARIATIONS: { [key: string]: string[] } = {
  'JavaScript': ['js', 'javascript', 'ecmascript'],
  'TypeScript': ['ts', 'typescript'],
  'Python': ['py', 'python'],
  'Java': ['java'],
  'C++': ['cpp', 'c++', 'c plus plus'],
  'C#': ['csharp', 'c#', 'c sharp'],
  'Ruby': ['ruby'],
  'PHP': ['php'],
  'React': ['react', 'reactjs', 'react.js'],
  'Angular': ['angular', 'angularjs', 'angular.js'],
  'Vue': ['vue', 'vuejs', 'vue.js'],
  'Node.js': ['node', 'nodejs', 'node.js'],
  'Express': ['express', 'expressjs', 'express.js'],
  'Django': ['django'],
  'Flask': ['flask'],
  'Spring': ['spring', 'spring boot', 'springboot'],
  'MongoDB': ['mongodb', 'mongo'],
  'PostgreSQL': ['postgres', 'postgresql', 'postgres db'],
  'MySQL': ['mysql', 'my sql'],
  'Redis': ['redis'],
  'AWS': ['amazon web services', 'aws'],
  'Azure': ['microsoft azure', 'azure'],
  'GCP': ['google cloud', 'google cloud platform', 'gcp'],
  'Docker': ['docker'],
  'Kubernetes': ['k8s', 'kubernetes'],
  'CI/CD': ['cicd', 'continuous integration', 'continuous deployment'],
  'Git': ['git'],
  'Agile': ['agile methodology', 'agile'],
  'Scrum': ['scrum methodology', 'scrum'],
  'UI/UX': ['ui', 'ux', 'user interface', 'user experience'],
  'Graphic Design': ['graphic design', 'design'],
  'Data Science': ['data science', 'datascience'],
  'Machine Learning': ['ml', 'machine learning'],
  'AI': ['artificial intelligence', 'ai'],
  'DevOps': ['devops'],
  'System Design': ['system design', 'system architecture'],
  'Mobile Development': ['mobile dev', 'mobile development'],
  'iOS': ['ios', 'apple ios'],
  'Android': ['android'],
  'Flutter': ['flutter'],
  'React Native': ['react native', 'reactnative']
};

// Get all unique skills from variations
const ALL_SKILLS = Object.keys(SKILL_VARIATIONS);

// Helper function to normalize skill name
const normalizeSkill = (skill: string): string => {
  const normalized = skill.toLowerCase().trim();
  // Find the main skill name for this variation
  for (const [mainSkill, variations] of Object.entries(SKILL_VARIATIONS)) {
    if (variations.includes(normalized)) {
      return mainSkill;
    }
  }
  // If no exact match found, try partial matching
  for (const [mainSkill, variations] of Object.entries(SKILL_VARIATIONS)) {
    if (variations.some(v => normalized.includes(v) || v.includes(normalized))) {
      return mainSkill;
    }
  }
  return normalized;
};

// Map skills to binary vectors
export const vectorizeSkills = (skills: string[]): number[] => {
  const normalizedSkills = skills.map(normalizeSkill);
  return ALL_SKILLS.map(skill => 
    normalizedSkills.some(s => 
      s.toLowerCase() === skill.toLowerCase() || 
      s.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(s.toLowerCase())
    ) ? 1 : 0
  );
};

// Calculate cosine similarity between two vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  // Add a small epsilon to prevent division by zero
  const epsilon = 1e-10;
  return dotProduct / (magnitudeA * magnitudeB + epsilon);
};

// Calculate similarity score with badge boost
export const calculateSimilarityScore = (
  userSkills: string[],
  targetSkills: string[],
  userBadges: { badge: { tier: BadgeTier } }[],
  hasAppliedBefore: boolean = false
): { score: number; matchPercentage: number } => {
  const userVector = vectorizeSkills(userSkills);
  const targetVector = vectorizeSkills(targetSkills);
  
  // Calculate base similarity
  let similarity = cosineSimilarity(userVector, targetVector);
  
  // Apply badge boosts
  const hasGuruBadge = userBadges.some(b => b.badge.tier === BadgeTier.GURU);
  const hasAcharyaBadge = userBadges.some(b => b.badge.tier === BadgeTier.ACHARYA);
  const hasSikshaSeviBadge = userBadges.some(b => b.badge.tier === BadgeTier.SIKSHA_SEVI);
  
  if (hasGuruBadge) {
    similarity *= 1.2; // 20% boost for GURU badge
  } else if (hasAcharyaBadge) {
    similarity *= 1.15; // 15% boost for ACHARYA badge
  } else if (hasSikshaSeviBadge) {
    similarity *= 1.1; // 10% boost for SIKSHA_SEVI badge
  }
  
  // Apply previous application boost
  if (hasAppliedBefore) {
    similarity *= 1.1; // 10% boost for previous applications
  }
  
  // Add a small base similarity for all workshops to ensure some recommendations
  similarity = Math.max(similarity, 0.01);
  
  // Cap similarity at 1.0
  similarity = Math.min(similarity, 1.0);
  
  // Calculate match percentage
  const matchPercentage = Math.round(similarity * 100);
  
  return {
    score: similarity,
    matchPercentage
  };
};

// Sort items by similarity score
export const sortBySimilarity = <T extends { similarity?: { score: number } }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => 
    (b.similarity?.score ?? 0) - (a.similarity?.score ?? 0)
  );
}; 