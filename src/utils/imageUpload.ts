// utils/imageUpload.ts
{/*import { Octokit } from "octokit";
import { Buffer } from 'buffer';

// Polyfill Buffer if needed
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

interface UploadImageParams {
  image: File;
  imageName: string;  // Changed from productId to imageName
  repo: string;
  owner: string;
  path?: string;
  branch?: string;
}

export const uploadImageToGithub = async ({
  image,
  imageName,
  repo,
  owner,
  path = '/images/products',
  branch = 'main'
}: UploadImageParams): Promise<string> => {
  try {
    // Validate inputs
    if (!image || !(image instanceof File)) {
      throw new Error('Invalid image file');
    }
    if (!imageName || !repo || !owner) {
      throw new Error('Missing required parameters');
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not configured');
    }

    const octokit = new Octokit({ auth: token });
    const filePath = `${path}/${imageName}.webp`;

    // Check if file exists to get its SHA
    let sha: string | undefined;
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        branch,
      });

      if (!Array.isArray(data) && 'sha' in data) {
        sha = data.sha;
      }
    } catch (error) {
      // File doesn't exist yet (expected for new uploads)
      if ((error as any).status !== 404) {
        throw error;
      }
    }

    // Read file content
    const content = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(image);
    });

    const contentEncoded = Buffer.from(content).toString('base64');

    // Upload or update file
    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Upload product image ${imageName}`,
      content: contentEncoded,
      branch,
      sha, // Include SHA if updating existing file
    });

    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  } catch (error) {
    console.error('GitHub upload error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to upload image to GitHub'
    );
  }
};
*/}
import { Octokit } from "octokit";
import { Buffer } from 'buffer';

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

interface UploadImageParams {
  image: File;
  imageName: string;
  repo: string;
  owner: string;
  path?: string;
  branch?: string;
}

export const uploadImageToGithub = async ({
  image,
  imageName,
  repo,
  owner,
  path = 'images/products',
  branch = 'main'
}: UploadImageParams): Promise<string> => {
  try {
    // Validate inputs
    if (!image || !(image instanceof File)) {
      throw new Error('Invalid image file');
    }
    if (!imageName || !repo || !owner) {
      throw new Error('Missing required parameters');
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is not configured');
    }

    const octokit = new Octokit({
      auth: token,
      request: {
        retries: 3,
        retryAfter: 5
      }
    });

    // Verify repository access first
    try {
      await octokit.rest.repos.get({ owner, repo });
    } catch (error) {
      throw new Error(`Repository not found or access denied: ${owner}/${repo}`);
    }

    const filePath = `${path}/${imageName}.webp`;
    let sha: string | undefined;

    // Check if file exists to get its SHA
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        branch,
      });

      if (!Array.isArray(data) && 'sha' in data) {
        sha = data.sha;
      }
    } catch (error) {
      if ((error as any).status !== 404) {
        throw error;
      }
    }

    // Read file content
    const content = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(image);
    });

    const contentEncoded = Buffer.from(content).toString('base64');

    // Upload or update file
    const { data } = await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Upload product image ${imageName}`,
      content: contentEncoded,
      branch,
      sha,
    });

    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  } catch (error) {
    console.error('GitHub upload error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to upload image to GitHub'
    );
  }
};