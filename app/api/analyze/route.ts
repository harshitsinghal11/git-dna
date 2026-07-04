import { NextResponse } from 'next/server';
import { analyzeIdentity, GitHubStats } from '../../lib/engine';
import { generateClassDescription } from '../../lib/ai';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Developer-Identity-App',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch User Profile again to calculate account age
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileRes.ok) throw new Error('Failed to fetch profile');
    const profileData = await profileRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers });
    const reposData = await reposRes.ok ? await reposRes.json() : [];
    const originalRepos = Array.isArray(reposData) ? reposData.filter(repo => !repo.fork) : [];

    // Calculate account age in days
    const createdAt = new Date(profileData.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // Primary Languages
    const languages = originalRepos.map(r => r.language).filter(Boolean) as string[];
    const primaryLanguages = Array.from(new Set(languages));

    const langCounts = languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLanguage = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || 'Code';

    const stats: GitHubStats = {
      accountAgeDays,
      publicRepos: originalRepos.length,
      totalStars: originalRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      primaryLanguages,
    };

    // 3. Analyze Identity using our engine
    const analysis = analyzeIdentity(stats);

    // 4. Generate AI Description
    const description = await generateClassDescription(analysis.developerClass, topLanguage);

    // 5. Return payload for the reveal sequence
    return NextResponse.json({
      identity: {
        ...analysis,
        description,
        topLanguage,
      },
      raw: {
        profile: {
          login: profileData.login,
          name: profileData.name,
          avatarUrl: profileData.avatar_url,
          createdAt: profileData.created_at,
        },
        stats,
        topRepos: originalRepos.slice(0, 10).map(repo => ({
          name: repo.name,
          stargazers_count: repo.stargazers_count,
          language: repo.language,
        }))
      }
    });

  } catch (error) {
    console.error('API Analyze Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
