import { getRosAccessToken } from '@/services/vcgRos'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const accessToken = await getRosAccessToken()
    const response = await fetch(`${process.env.VCG_ROS_ENDPOINT}/api/entry/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to validate code ${errorText}`)
    }

    const data = await response.json()
    if (data.error) return Response.json({ error: data.error }, { status: 400 })

    return Response.json(data, { status: response.status })
  } catch (error) {
    console.error('Error creating entry:', error)
    return new Response(JSON.stringify({ error: 'Failed to create entry' }), { status: 500 })
  }
}
