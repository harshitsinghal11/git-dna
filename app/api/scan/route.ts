import { NextResponse } from 'next/server';

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

    // Fetch ONLY User Profile for the Scanning Phase to prevent network tab spoilers
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    if (profileRes.status === 404) {
      return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
    }
    
    if (!profileRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch from GitHub' }, { status: profileRes.status });
    }

    const profileData = await profileRes.json();

    // Return only what is needed for the Closed Card
    return NextResponse.json({
      profile: {
        login: profileData.login,
        name: profileData.name,
        avatarUrl: profileData.avatar_url,
        createdAt: profileData.created_at,
      }
    });

  } catch (error) {
    console.error('API Scan Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


