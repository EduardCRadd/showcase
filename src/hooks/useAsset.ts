import { useQuery } from 'react-query'

const fetchAsset = async (fileKey?: string) => {
  if (!fileKey) return
  const response = await fetch(`${process.env.BASE_PATH}/api/asset/${encodeURIComponent(fileKey)}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}

export default function useAsset(fileKey?: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['asset', fileKey],
    queryFn: () => fetchAsset(fileKey),
    enabled: !!fileKey,
  })

  return { url: data, error, isLoading }
}
