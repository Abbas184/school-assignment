async function getSchools() {
  // This logic now prioritizes the public URL, which is essential for the build process.
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;

  try {
    const res = await fetch(`${apiUrl}/api/getSchools`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch schools. Status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("[getSchools Error] Fetching from:", apiUrl, error);
    return [];
  }
}