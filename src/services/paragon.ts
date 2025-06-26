export const getAccessToken = async () => {
  const url = `${process.env.PARAGON_ENDPOINT}security/createToken`
  const body = {
    userName: process.env.PARAGON_USERNAME,
    password: process.env.PARAGON_PASSWORD,
  }

  // console.log({ body, url })

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    const textResponse = await response.text()

    // console.log({ response })

    if (!textResponse) throw new Error('No access token from Paragon')
    return textResponse
  } catch (error) {
    console.error(error)
  }
}
