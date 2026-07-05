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

    // 1. Fetch User Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (profileRes.status === 403 || profileRes.status === 429) {
      return NextResponse.json({ error: 'GitHub API rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    if (profileRes.status === 404) {
      return NextResponse.json({ error: 'GitHub user not found.' }, { status: 404 });
    }
    if (!profileRes.ok) throw new Error('Failed to fetch profile');
    
    const profileData = await profileRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers });
    
    if (reposRes.status === 403 || reposRes.status === 429) {
      return NextResponse.json({ error: 'GitHub API rate limit exceeded while fetching repositories.' }, { status: 429 });
    }
    
    const reposData = await reposRes.ok ? await reposRes.json() : [];
    const originalRepos = Array.isArray(reposData) ? reposData.filter(repo => !repo.fork) : [];

    // Calculate metrics
    const createdAt = new Date(profileData.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const languages = originalRepos.map(r => r.language).filter(Boolean) as string[];
    const primaryLanguages = Array.from(new Set(languages));

    const langCounts = languages.reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLanguage = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || 'Code';
    const topLanguagePercentage = originalRepos.length > 0 ? (langCounts[topLanguage] || 0) / originalRepos.length * 100 : 0;

    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentlyUpdatedRepos = originalRepos.filter(r => new Date(r.pushed_at) >= thirtyDaysAgo).length;

    const stats: GitHubStats = {
      accountAgeDays,
      publicRepos: originalRepos.length,
      totalStars: originalRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      primaryLanguages,
      followers: profileData.followers || 0,
      following: profileData.following || 0,
      publicGists: profileData.public_gists || 0,
      forksOfUserRepos: originalRepos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0),
      recentlyUpdatedRepos,
      totalCodeSizeKB: originalRepos.reduce((acc, repo) => acc + (repo.size || 0), 0),
      topLanguagePercentage
    };

    // 3. Analyze Identity using our new engine
    const analysis = analyzeIdentity(stats);

    // 4. Generate AI Description based on Archetype now
    const description = await generateClassDescription(analysis.archetype, topLanguage);

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
          description: repo.description,
          created_at: repo.created_at,
          pushed_at: repo.pushed_at,
        }))
      }
    });

  } catch (error) {
    console.error('API Analyze Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
