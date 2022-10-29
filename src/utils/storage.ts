export const getItemFromStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const saveItemToStorage = (key: string, value: string) => {
  return localStorage.setItem(key, value)
}

export const removeItemFromStorage = (key: string) => {
  return localStorage.removeItem(key)
}
