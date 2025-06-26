import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

const S3_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_REGION,
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const fileKey = (await params).slug
    const s3Client = new S3Client(S3_CONFIG)
    const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: fileKey })
    const fileUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    console.log(fileUrl)
    return NextResponse.json(fileUrl)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error getting file' })
  }
}
