import { getAccessToken } from '@/services/vcg'

export async function GET(_request: Request, { params }: { params: { code: string } }) {
  const code = params.code

  try {
    const accessToken = await getAccessToken()
    const response = await fetch(`${process.env.VCG_ENDPOINT}/api/code/${code}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to validate code ${errorText}`)
    }

    const data = await response.json()
    if (data.error) return Response.json({ error: data.error }, { status: 400 })

    return Response.json(data)
  } catch (error) {
    console.error('Error fetching code:', error)
    return Response.json({ error: 'Failed to fetch code' }, { status: 500 })
  }
}
