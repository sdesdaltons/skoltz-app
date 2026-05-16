export type CheckInErrorCode =
  | "NOT_CONFIGURED"
  | "NOT_AUTHENTICATED"
  | "GEO_PERMISSION_DENIED"
  | "GEO_UNAVAILABLE"
  | "GEO_TIMEOUT"
  | "GEO_ERROR"
  | "TOO_FAR"
  | "DUPLICATE"
  | "SUPABASE_ERROR"

export class CheckInError extends Error {
  code: CheckInErrorCode

  constructor(code: CheckInErrorCode, message: string) {
    super(message)
    this.name = "CheckInError"
    this.code = code
  }
}

export type CheckInPosition = {
  latitude: number
  longitude: number
}
