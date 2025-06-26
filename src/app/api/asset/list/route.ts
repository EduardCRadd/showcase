import { ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'

const PAGINATED_ITEMS_COUNT = 15

const S3_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
  region: process.env.AWS_REGION,
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startFromKey = searchParams.get('startFromKey')
  const s3Client = new S3Client(S3_CONFIG)
  const prefix = 'glasses/'
  const command = new ListObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: PAGINATED_ITEMS_COUNT,
    Marker: startFromKey ?? prefix,
  })

  try {
    const data = await s3Client.send(command)
    return NextResponse.json({ contents: data.Contents, isTruncated: data.IsTruncated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error getting files', contents: undefined, isTruncated: undefined })
  }
}

// return {
//   contents: [
//     {
//       Key: 'glasses/251691864350828.png',
//       LastModified: '2024-03-14T17:14:10.000Z' as unknown as Date,
//       ETag: '"ee0b87c10b590be7ea7a271385db440a"',
//       Size: 117904,
//       StorageClass: 'STANDARD',
//       Owner: {
//         ID: '7e8adecf150cb4e6cade261d554a0419d9a79fe2214599fefccb7f8b671c0bc3',
//       },
//     },
//     {
//       Key: 'glasses/251691864375290.png',
//       LastModified: '2024-03-14T17:13:46.000Z' as unknown as Date,
//       ETag: '"6ec0c92838cb92fd76519349a134dd5c"',
//       Size: 118329,
//       StorageClass: 'STANDARD',
//       Owner: {
//         ID: '7e8adecf150cb4e6cade261d554a0419d9a79fe2214599fefccb7f8b671c0bc3',
//       },
//     },
//     {
//       Key: 'glasses/251691864410922.png',
//       LastModified: '2024-03-14T17:13:10.000Z' as unknown as Date,
//       ETag: '"c248ca1f650aed4759383ce21cbbb963"',
//       Size: 117667,
//       StorageClass: 'STANDARD',
//       Owner: {
//         ID: '7e8adecf150cb4e6cade261d554a0419d9a79fe2214599fefccb7f8b671c0bc3',
//       },
//     },
//     {
//       Key: 'glasses/251691879037445.png',
//       LastModified: '2024-03-14T13:09:23.000Z' as unknown as Date,
//       ETag: '"f2411b109950168b73afe372bdbaf271"',
//       Size: 89953,
//       StorageClass: 'STANDARD',
//       Owner: {
//         ID: '7e8adecf150cb4e6cade261d554a0419d9a79fe2214599fefccb7f8b671c0bc3',
//       },
//     },
//     {
//       Key: 'glasses/251691884078332.png',
//       LastModified: '2024-03-14T11:45:23.000Z' as unknown as Date,
//       ETag: '"a9e84659d357bc65514d6ed648158119"',
//       Size: 125202,
//       StorageClass: 'STANDARD',
//       Owner: {
//         ID: '7e8adecf150cb4e6cade261d554a0419d9a79fe2214599fefccb7f8b671c0bc3',
//       },
//     },
//   ],
//   isTruncated: false,
// }
