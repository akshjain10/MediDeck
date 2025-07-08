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

interface BulkUploadParams {
  images: { file: File; name: string }[];
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
    if (!image || !imageName || !repo || !owner) {
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

    // Convert image to base64
    const content = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(image);
    });

    const contentEncoded = Buffer.from(content).toString('base64');
    const filePath = `${path}/${imageName}.webp`;

    // Create blob
    const { data: blobData } = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: contentEncoded,
      encoding: 'base64',
    });

    // Get the latest commit
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: refData.object.sha,
    });

    // Create new tree
    const { data: newTreeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      tree: [
        {
          path: filePath,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        },
      ],
      base_tree: commitData.tree.sha,
    });

    // Create new commit
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Add product image: ${imageName}`,
      tree: newTreeData.sha,
      parents: [commitData.sha],
    });

    // Update reference
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });

    // Return the URL to the uploaded image
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

export const bulkUploadImagesToGithub = async ({
  images,
  repo,
  owner,
  path = 'images/products',
  branch = 'main'
}: BulkUploadParams): Promise<{ success: string[]; failures: { name: string; error: string }[] }> => {
  try {
    // Validate inputs
    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error('No valid images provided');
    }
    if (!repo || !owner) {
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

    // Get the current tree to find existing files
    let currentTree;
    try {
      const { data: branchData } = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
      });

      const { data: treeData } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branchData.commit.commit.tree.sha,
        recursive: 'true',
      });

      currentTree = treeData.tree;
    } catch (error) {
      throw new Error(`Failed to get current tree: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Prepare all blobs
    const blobs = await Promise.allSettled(
      images.map(async ({ file, name }) => {
        try {
          const content = await new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
          });

          const contentEncoded = Buffer.from(content).toString('base64');
          const filePath = `${path}/${name}.webp`;

          // Check if file exists in current tree
          const existingFile = currentTree.find(
            (item: any) => item.path === filePath && item.type === 'blob'
          );

          // Create blob
          const { data: blobData } = await octokit.rest.git.createBlob({
            owner,
            repo,
            content: contentEncoded,
            encoding: 'base64',
          });

          return {
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
            originalSha: existingFile?.sha,
          };
        } catch (error) {
          throw new Error(`Failed to process ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      })
    );

    // Separate successful and failed blobs
    const successfulBlobs: any[] = [];
    const failures: { name: string; error: string }[] = [];

    blobs.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulBlobs.push(result.value);
      } else {
        failures.push({
          name: images[index].name,
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
        });
      }
    });

    if (successfulBlobs.length === 0) {
      throw new Error('All image uploads failed');
    }

    // Get the latest commit
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: refData.object.sha,
    });

    // Create new tree with all blobs
    const { data: newTreeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      tree: successfulBlobs,
      base_tree: commitData.tree.sha,
    });

    // Create new commit
    const { data: newCommitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Bulk upload of ${successfulBlobs.length} product images`,
      tree: newTreeData.sha,
      parents: [commitData.sha],
    });

    // Update reference
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommitData.sha,
    });

    // Return URLs for successful uploads
    const successUrls = successfulBlobs.map(blob =>
      `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${blob.path}`
    );

    return {
      success: successUrls,
      failures,
    };
  } catch (error) {
    console.error('Bulk GitHub upload error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to bulk upload images to GitHub'
    );
  }
};
