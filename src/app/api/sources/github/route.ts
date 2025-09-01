import { NextRequest, NextResponse } from 'next/server';

interface GitHubFile {
  name: string;
  path: string;
  download_url: string;
  type: string;
  size: number;
}

interface GitHubContent {
  name: string;
  path: string;
  content: string;
  type: 'file' | 'dir';
  size: number;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url || !url.includes('github.com')) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      );
    }

    // Extract owner and repo from GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return NextResponse.json(
        { error: 'Unable to parse GitHub URL' },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;
    const repoName = repo.replace('.git', '');

    // Fetch repository contents using GitHub API
    const repoData = await fetchGitHubRepo(owner, repoName);
    
    const source = {
      id: Date.now().toString(),
      type: 'github' as const,
      name: `${owner}/${repoName}`,
      url: url,
      content: repoData.content,
      files: repoData.files,
      summary: repoData.summary
    };

    return NextResponse.json({
      source,
      message: `Successfully loaded ${repoData.files.length} files from ${owner}/${repoName}`
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: `Failed to fetch GitHub repository: ${error.message}` },
      { status: 500 }
    );
  }
}

async function fetchGitHubRepo(owner: string, repo: string) {
  const baseUrl = 'https://api.github.com';
  
  try {
    // First, get the repository info
    const repoResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      throw new Error(`Repository not found or not accessible: ${repoResponse.status}`);
    }
    
    const repoInfo = await repoResponse.json();
    
    // Get the repository contents (files and folders)
    const contentsResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contents`);
    if (!contentsResponse.ok) {
      throw new Error(`Failed to fetch repository contents: ${contentsResponse.status}`);
    }
    
    const contents = await contentsResponse.json();
    
    // Focus on key files for analysis
    const keyFiles = ['README.md', 'package.json', 'tsconfig.json', 'Cargo.toml', 'requirements.txt', 'go.mod', 'pom.xml'];
    const sourceExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.cpp', '.c', '.php'];
    
    const filesToFetch: GitHubFile[] = [];
    
    // Add key files
    contents.forEach((item: any) => {
      if (item.type === 'file') {
        if (keyFiles.includes(item.name) || 
            sourceExtensions.some(ext => item.name.endsWith(ext))) {
          filesToFetch.push(item);
        }
      }
    });
    
    // Fetch src/ or lib/ directory if it exists
    const srcDir = contents.find((item: any) => item.type === 'dir' && ['src', 'lib', 'app'].includes(item.name));
    if (srcDir) {
      const srcResponse = await fetch(`${baseUrl}/repos/${owner}/${repo}/contents/${srcDir.path}`);
      if (srcResponse.ok) {
        const srcContents = await srcResponse.json();
        srcContents.forEach((item: any) => {
          if (item.type === 'file' && sourceExtensions.some(ext => item.name.endsWith(ext))) {
            filesToFetch.push(item);
          }
        });
      }
    }
    
    // Limit to prevent overwhelming the API and response size
    const limitedFiles = filesToFetch.slice(0, 10);
    
    // Fetch file contents
    const files: GitHubContent[] = [];
    let allContent = `Repository: ${owner}/${repo}\n`;
    allContent += `Description: ${repoInfo.description || 'No description available'}\n`;
    allContent += `Language: ${repoInfo.language || 'Unknown'}\n`;
    allContent += `Stars: ${repoInfo.stargazers_count}\n\n`;
    
    for (const file of limitedFiles) {
      if (file.size < 50000) { // Skip files larger than 50KB
        try {
          const fileResponse = await fetch(file.download_url);
          if (fileResponse.ok) {
            const content = await fileResponse.text();
            files.push({
              name: file.name,
              path: file.path,
              content,
              type: 'file',
              size: file.size
            });
            
            allContent += `\n--- ${file.path} ---\n`;
            allContent += content.substring(0, 2000); // Limit content per file
            allContent += '\n\n';
          }
        } catch (e) {
          console.warn(`Failed to fetch ${file.path}:`, e.message);
        }
      }
    }
    
    const summary = `GitHub Repository: ${owner}/${repo}
Language: ${repoInfo.language}
Description: ${repoInfo.description}
Files analyzed: ${files.length}
Key files: ${files.map(f => f.name).join(', ')}`;
    
    return {
      content: allContent,
      files,
      summary
    };
    
  } catch (error) {
    throw new Error(`GitHub API error: ${error.message}`);
  }
}