import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

const S3_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_REGION,
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 })

    const fileKey = formData.get('fileKey') as string
    if (!fileKey) return NextResponse.json({ error: 'File Key is required' }, { status: 400 })

    const s3Client = new S3Client(S3_CONFIG)
    const buffer = Buffer.from(await file.arrayBuffer())
    const command = new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileKey, Body: buffer })
    await s3Client.send(command)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    return NextResponse.json({ error: 'Error uploading file' })
  }
}
