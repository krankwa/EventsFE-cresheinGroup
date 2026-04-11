/**
 * Uploads an image file through the .NET backend's /api/Upload endpoint.
 *
 * Security model:
 *  - Only Admin-authenticated requests (Bearer token from .NET JWT) can upload.
 *  - The backend holds the Supabase service-role key — it is NEVER sent to the browser.
 *  - Supabase Storage RLS: no INSERT policy for anon/authenticated roles,
 *    so direct browser uploads are blocked even if someone has the anon key.
 *  - Public users can view images via the public Supabase URL stored in the DB.
 *
 * Supabase SQL to add (run once in the SQL Editor):
 *
 *   -- Public can view images in the bucket
 *   create policy "Public can view images"
 *     on storage.objects for select to public
 *     using (bucket_id = 'photoBucket');
 *
 *   -- Do NOT add any INSERT / UPDATE / DELETE policy for anon or authenticated.
 *   -- The service_role key (used by the .NET backend) bypasses RLS by default.
 */

const API_BASE_URL = "https://localhost:7080/api";

/**
 * Uploads an image file to Supabase Storage via the .NET /api/Upload proxy.
 * Returns the public URL of the stored image.
 */
export async function uploadEventImage(file: File): Promise<string> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Not authenticated. Please log in as Admin.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/Upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type here — the browser sets it with the correct
      // multipart boundary when using FormData.
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Upload failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message ?? message;
    } catch {
      // fall back to status text
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { publicUrl: string };

  if (!data?.publicUrl) {
    throw new Error("Upload succeeded but no public URL was returned.");
  }

  return data.publicUrl;
}
