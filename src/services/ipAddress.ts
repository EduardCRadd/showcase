export const fetchIpAddress = async () => {
  const endpoint = 'https://api.ipify.org?format=json'
  const response = await fetch(endpoint)
  const jsonResponse = await response.json()

  return jsonResponse.ip
}
