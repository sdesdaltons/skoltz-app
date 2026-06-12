export const businessDayRolloverHour = 2

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getBusinessDate(date: Date) {
  const businessDate = new Date(date)

  if (businessDate.getHours() < businessDayRolloverHour) {
    businessDate.setDate(businessDate.getDate() - 1)
  }

  return businessDate
}

export function startOfBusinessDay(date: Date) {
  return startOfDay(getBusinessDate(date))
}

export function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function businessDateKey(date: Date) {
  return dateKey(getBusinessDate(date))
}
