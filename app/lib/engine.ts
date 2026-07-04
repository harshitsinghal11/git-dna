export interface GitHubStats {
  accountAgeDays: number;
  publicRepos: number;
  totalStars: number;
  primaryLanguages: string[];
}

export interface AnalysisResult {
  level: string;
  medals: string[];
  developerClass: string;
}

export function calculateLevel(stats: GitHubStats): string {
  // Simple scoring for Phase 1
  let score = 0;
  score += Math.min(stats.accountAgeDays / 365, 5) * 10; // Up to 50 pts for age (5 years)
  score += Math.min(stats.publicRepos * 2, 50);          // Up to 50 pts for repos (25 repos)
  score += Math.min(stats.totalStars * 2, 100);          // Up to 100 pts for stars (50 stars)
  
  if (score > 180) return 'Level VII — Mythic';
  if (score > 150) return 'Level VI — Vanguard';
  if (score > 120) return 'Level V — Architect';
  if (score > 90) return 'Level IV — Craftsman';
  if (score > 60) return 'Level III — Builder';
  if (score > 30) return 'Level II — Explorer';
  return 'Level I — Initiate';
}

export function detectMedals(stats: GitHubStats): string[] {
  const medals = [];
  
  if (stats.totalStars >= 50) medals.push('Star Magnet');
  if (stats.publicRepos >= 20) medals.push('Ship It');
  if (stats.primaryLanguages.length >= 5) medals.push('Polyglot');
  if (stats.primaryLanguages.length === 1 && stats.publicRepos >= 5) medals.push('Specialist');
  if (stats.accountAgeDays >= 365 * 5) medals.push('Ancient One');
  
  // Fallbacks if they have no other medals to ensure everyone gets something
  if (medals.length === 0) medals.push('Hidden Gem');
  
  return medals;
}

export function determineClass(medals: string[], stats: GitHubStats): string {
  if (medals.includes('Ancient One') && medals.includes('Star Magnet')) return 'The Systems Architect';
  if (medals.includes('Polyglot')) return 'The Fearless Explorer';
  if (medals.includes('Specialist')) return 'The Deep Specialist';
  if (medals.includes('Ship It')) return 'The Relentless Builder';
  
  // Defaults based on simple thresholds
  if (stats.publicRepos > 15) return 'The Project Finisher';
  if (stats.accountAgeDays > 365 * 3) return 'The Silent Maintainer';
  return 'The Experimental Hacker';
}

export function analyzeIdentity(stats: GitHubStats): AnalysisResult {
  const level = calculateLevel(stats);
  const medals = detectMedals(stats);
  const developerClass = determineClass(medals, stats);
  
  return {
    level,
    medals,
    developerClass
  };
}
