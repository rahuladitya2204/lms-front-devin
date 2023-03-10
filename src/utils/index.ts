import { Utils } from '@adewaskar/lms-common'

Utils.Storage.GetItem = (key: string) => localStorage.getItem(key)
Utils.Storage.SetItem = (key: string, value: string) =>
  localStorage.setItem(key, value)
Utils.Storage.RemoveItem = (key: string) => localStorage.RemoveItem(key)
