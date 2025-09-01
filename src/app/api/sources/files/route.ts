import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const processedSources = [];
    
    for (const file of files.slice(0, 10)) { // Limit to 10 files
      try {
        const processed = await processFile(file);
        processedSources.push(processed);
      } catch (error) {
        console.warn(`Failed to process file ${file.name}:`, error.message);
      }
    }

    return NextResponse.json({
      sources: processedSources,
      message: `Successfully processed ${processedSources.length} file(s)`
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: `Failed to process files: ${error.message}` },
      { status: 500 }
    );
  }
}

async function processFile(file: File) {
  const content = await file.text();
  const fileExtension = getFileExtension(file.name);
  const language = getLanguageFromExtension(fileExtension);
  
  // Parse file content based on type
  let parsedContent = content;
  let summary = '';
  
  if (isCodeFile(fileExtension)) {
    summary = analyzeCodeFile(content, file.name, language);
  } else if (isConfigFile(file.name)) {
    summary = analyzeConfigFile(content, file.name);
  } else if (isDocumentationFile(fileExtension)) {
    summary = analyzeDocumentationFile(content, file.name);
  } else {
    summary = `File: ${file.name} (${file.size} bytes)`;
  }

  // Limit content size for large files
  if (parsedContent.length > 20000) {
    parsedContent = parsedContent.substring(0, 20000) + '\n\n[Content truncated...]';
  }

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type: 'file' as const,
    name: file.name,
    content: `File: ${file.name}\nLanguage: ${language}\nSize: ${file.size} bytes\n\n--- Content ---\n${parsedContent}`,
    summary,
    language,
    fileType: fileExtension,
    size: file.size
  };
}

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    'js': 'JavaScript',
    'jsx': 'JavaScript (React)',
    'ts': 'TypeScript',
    'tsx': 'TypeScript (React)',
    'py': 'Python',
    'go': 'Go',
    'rs': 'Rust',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'php': 'PHP',
    'rb': 'Ruby',
    'cs': 'C#',
    'swift': 'Swift',
    'kt': 'Kotlin',
    'dart': 'Dart',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'json': 'JSON',
    'yaml': 'YAML',
    'yml': 'YAML',
    'md': 'Markdown',
    'txt': 'Text',
    'sql': 'SQL'
  };
  
  return languageMap[extension] || 'Unknown';
}

function isCodeFile(extension: string): boolean {
  const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java', 'cpp', 'c', 'php', 'rb', 'cs', 'swift', 'kt', 'dart'];
  return codeExtensions.includes(extension);
}

function isConfigFile(filename: string): boolean {
  const configFiles = ['package.json', 'tsconfig.json', 'cargo.toml', 'requirements.txt', 'go.mod', 'pom.xml', '.env', 'docker-compose.yml', 'webpack.config.js'];
  return configFiles.includes(filename.toLowerCase()) || filename.startsWith('.');
}

function isDocumentationFile(extension: string): boolean {
  return ['md', 'txt', 'rst'].includes(extension);
}

function analyzeCodeFile(content: string, filename: string, language: string): string {
  const lines = content.split('\n').length;
  const functions = (content.match(/function\s+\w+|def\s+\w+|func\s+\w+|class\s+\w+/g) || []).length;
  const imports = (content.match(/import\s+|from\s+.*import|#include|using\s+/g) || []).length;
  
  return `Code file: ${filename} (${language})
Lines of code: ${lines}
Functions/Classes: ${functions}
Imports: ${imports}`;
}

function analyzeConfigFile(content: string, filename: string): string {
  try {
    if (filename.endsWith('.json')) {
      const parsed = JSON.parse(content);
      const keys = Object.keys(parsed);
      return `Configuration file: ${filename}
Key sections: ${keys.slice(0, 10).join(', ')}
Total keys: ${keys.length}`;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  
  return `Configuration file: ${filename}
Lines: ${content.split('\n').length}`;
}

function analyzeDocumentationFile(content: string, filename: string): string {
  const lines = content.split('\n').length;
  const headings = (content.match(/^#+\s+/gm) || []).length;
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  return `Documentation file: ${filename}
Lines: ${lines}
Headings: ${headings}
Word count: ~${wordCount}`;
}