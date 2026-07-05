export interface GitHubStats {
  accountAgeDays: number;
  publicRepos: number;
  totalStars: number;
  primaryLanguages: string[];
  followers: number;
  following: number;
  publicGists: number;
  forksOfUserRepos: number;
  recentlyUpdatedRepos: number; // in last 30 days
  totalCodeSizeKB: number;
  topLanguagePercentage: number;
}

export interface Medal {
  id: string; // "1-star-magnet"
  name: string; // "Star Magnet"
  description: string;
  unlocked: boolean;
  progress: number;
  requirement: number;
}

export interface AnalysisResult {
  xp: number;
  level: string;
  levelNumber: number;
  medals: Medal[];
  archetype: string;
  developerDNA: string;
}

export interface GitHubProfile {
  name: string;
  login: string;
  avatarUrl: string;
  createdAt: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  pushed_at: string;
}

export interface GitDNAData {
  identity: AnalysisResult & { topLanguage: string; description: string };
  raw: {
    profile: GitHubProfile;
    stats: GitHubStats;
    topRepos: GitHubRepo[];
  };
}

export function detectMedals(stats: GitHubStats): Medal[] {
  const configs = [
    { id: '1-star-magnet', name: 'Star Magnet', desc: 'Earned for receiving 50+ stars on repositories.', val: stats.totalStars, req: 50 },
    { id: '2-commit-machine', name: 'Commit Machine', desc: 'Earned for creating 15+ public repositories.', val: stats.publicRepos, req: 15 },
    { id: '3-polygot', name: 'Polygot', desc: 'Earned for writing in 5+ languages.', val: stats.primaryLanguages.length, req: 5 },
    { id: '4-deep-diver', name: 'Deep Diver', desc: 'Earned for a total codebase size over 10MB.', val: Math.floor(stats.totalCodeSizeKB / 1024), req: 10 },
    { id: '5-ship-it', name: 'Ship It', desc: 'Earned for shipping code frequently.', val: stats.recentlyUpdatedRepos, req: 3 },
    { id: '6-open-source-ally', name: 'Open Source Ally', desc: 'Earned when others fork your repos (10+).', val: stats.forksOfUserRepos, req: 10 },
    { id: '7-ancient-one', name: 'Ancient One', desc: 'Earned for 3+ years active on GitHub.', val: Math.floor(stats.accountAgeDays / 365), req: 3 },
    { id: '8-hidden-gem', name: 'Hidden Gem', desc: 'High star-to-follower ratio.', val: stats.followers === 0 ? stats.totalStars : Math.floor(stats.totalStars / stats.followers), req: 5 },
    { id: '9-maintainer', name: 'Maintainer', desc: 'Earned for maintaining 25+ public repositories.', val: stats.publicRepos, req: 25 },
    { id: '10-specialist', name: 'Specialist', desc: 'Earned for 80%+ focus in a primary language.', val: stats.topLanguagePercentage, req: 80 },
    { id: '11-explorer', name: 'Explorer', desc: 'Earned for following 20+ other developers.', val: stats.following, req: 20 },
    { id: '12-comeback-coder', name: 'Comeback Coder', desc: 'Active again after a long time.', val: (stats.accountAgeDays > 365 * 2 && stats.recentlyUpdatedRepos > 0) ? 1 : 0, req: 1 },
  ];

  return configs.map(c => ({
    id: c.id,
    name: c.name,
    unlocked: c.val >= c.req,
    description: c.desc,
    progress: c.val,
    requirement: c.req
  }));
}

export function calculateLevel(xp: number): { name: string, levelNumber: number } {
  if (xp >= 100000) return { name: 'Mythic', levelNumber: 7 };
  if (xp >= 25000) return { name: 'Vanguard', levelNumber: 6 };
  if (xp >= 10000) return { name: 'Architect', levelNumber: 5 };
  if (xp >= 5000) return { name: 'Craftsman', levelNumber: 4 };
  if (xp >= 2500) return { name: 'Builder', levelNumber: 3 };
  if (xp >= 1000) return { name: 'Explorer', levelNumber: 2 };
  return { name: 'Initiate', levelNumber: 1 };
}

export function determineArchetype(medals: Medal[]): string {
  const unlockedCount = medals.filter(m => m.unlocked).length;

  const has = (idSubstring: string) => medals.find(m => m.id.includes(idSubstring) && m.unlocked);

  if (has('polygot') && has('commit-machine')) return 'The Infinite Hacker';
  if (has('star-magnet') && has('open-source-ally')) return 'The Open Source Celebrity';
  if (has('specialist')) return 'The Deep Systems Master';
  if (has('ancient-one')) return 'The Seasoned Architect';

  if (unlockedCount >= 6) return 'The Elite Engineer';
  if (unlockedCount >= 3) return 'The Generalist';

  return 'The Rising Developer';
}

export function analyzeIdentity(stats: GitHubStats): AnalysisResult {
  const medals = detectMedals(stats);

  let xp = 0;

  // Age: 100 XP per year, max 1000 XP (10 years)
  xp += Math.min(1000, Math.floor((stats.accountAgeDays / 365) * 100));

  // Repos: 20 XP per repo, max 2000 XP (100 repos)
  xp += Math.min(2000, stats.publicRepos * 20);

  // Impact (Uncapped): 50 XP per star, 100 XP per follower
  xp += stats.totalStars * 50;
  xp += stats.followers * 100;

  // Medals: 500 XP per unlocked medal
  medals.forEach(m => {
    if (m.unlocked) xp += 500;
  });

  const { name: level, levelNumber } = calculateLevel(xp);
  const archetype = determineArchetype(medals);

  // Create a DNA sequence string (e.g. "FRNT-BEND-DATA")
  const dna = stats.primaryLanguages.slice(0, 3).map(l => l.substring(0, 4).toUpperCase()).join('-') || 'INIT-CODE';

  return {
    xp,
    level,
    levelNumber,
    medals,
    archetype,
    developerDNA: dna
  };
}
