export const getRosAccessToken = async () => {
  if (!process.env.VCG_OAUTH2_CLIENT_ID || !process.env.VCG_OAUTH2_CLIENT_SECRET) {
    throw new Error('VCG_OAUTH2_CLIENT_ID and VCG_OAUTH2_CLIENT_SECRET must be set')
  }

  const body = {
    grant_type: 'client_credentials',
    client_id: process.env.VCG_OAUTH2_CLIENT_ID,
    client_secret: process.env.VCG_OAUTH2_CLIENT_SECRET,
  }

  const response = await fetch(`${process.env.VCG_ROS_ENDPOINT}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
    cache: 'no-store',
  })
  console.log('[getRosAccessToken] Response:', response)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch access token ${errorText}`)
  }

  const data = await response.json()
  return data.access_token
}
