/**
 * Minimal GitHub REST client used by the /admin panel. The admin "logs in"
 * with a fine-grained personal access token scoped to the site repository;
 * every save is a commit, and GitHub Actions republishes the site.
 */

export interface GhAuth {
  token: string
  owner: string
  repo: string
  branch: string
}

const API = 'https://api.github.com'

async function gh<T>(auth: GhAuth, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers || {})
    }
  })
  if (!res.ok) {
    let message = `GitHub error ${res.status}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = `${message}: ${body.message}`
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}

export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)))
  }
  return btoa(binary)
}

export function textToBase64(text: string): string {
  return toBase64(new TextEncoder().encode(text))
}

export function base64ToText(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/** Confirms the token can push to the repository. */
export async function validateAuth(auth: GhAuth): Promise<void> {
  const repo = await gh<{ permissions?: { push?: boolean } }>(auth, `/repos/${auth.owner}/${auth.repo}`)
  if (!repo.permissions?.push) {
    throw new Error('This token cannot write to the repository. Check its permissions.')
  }
}

export async function getFile(
  auth: GhAuth,
  path: string
): Promise<{ text: string; sha: string }> {
  const file = await gh<{ content: string; sha: string }>(
    auth,
    `/repos/${auth.owner}/${auth.repo}/contents/${path}?ref=${auth.branch}`
  )
  return { text: base64ToText(file.content), sha: file.sha }
}

export async function putFile(
  auth: GhAuth,
  path: string,
  contentBase64: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const result = await gh<{ content: { sha: string } }>(
    auth,
    `/repos/${auth.owner}/${auth.repo}/contents/${path}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: auth.branch,
        ...(sha ? { sha } : {})
      })
    }
  )
  return { sha: result.content.sha }
}

export interface WorkflowRun {
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: string | null
  html_url: string
  created_at: string
}

export async function latestRun(auth: GhAuth): Promise<WorkflowRun | null> {
  const data = await gh<{ workflow_runs: WorkflowRun[] }>(
    auth,
    `/repos/${auth.owner}/${auth.repo}/actions/runs?branch=${auth.branch}&per_page=1`
  )
  return data.workflow_runs[0] || null
}

/** Resizes and compresses an image file in the browser before committing it. */
export async function prepareImage(file: File, maxDim = 1600): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image'))), 'image/jpeg', 0.85)
  )
  return new Uint8Array(await blob.arrayBuffer())
}
