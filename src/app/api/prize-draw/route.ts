import { NextResponse } from 'next/server'

import { getAccessToken } from '@/services/paragon'
import { mapDataToInitialEntry } from '@/utils/prizeDraw'

export async function POST(request: Request) {
  const jsonReq = await request.json()

  try {
    const accessToken = await getAccessToken()

    // console.log({ accessToken })

    const url = `${process.env.PARAGON_ENDPOINT}api/initialEntry`
    const body = mapDataToInitialEntry(jsonReq)

    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const text = await response.text()

    const json = JSON.parse(text)

    if (json.result.code === 1) return NextResponse.json(json, { status: response.status })
    else return NextResponse.json({ error: json.result.message }, { status: response.status })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: error.code || 500 })
  }
}
