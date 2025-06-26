export const capitalize = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export const formatBarAddress = (bar: { name: string; road: string; postcode: string }) => {
  const name = capitalize(bar.name)
  const road = capitalize(bar.road)
  const postcode = bar.postcode.toUpperCase()

  return `${name}, ${road}, ${postcode}`
}
