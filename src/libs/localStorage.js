export const store = (key, obj) => {
  try {
    localStorage.setItem(key, JSON.stringify(obj))
  } catch (e) {
    console.error(e)
  }
}

export const load = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error(e)
  }
}
