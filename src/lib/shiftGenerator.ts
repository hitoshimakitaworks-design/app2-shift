export type Staff = {
  id: number
  name: string
  daysOff: number[]
}

export type ShiftResult = {
  [staffId: number]: { [day: number]: 'work' | 'off' }
}

export function generateShift(
  year: number,
  month: number,
  staffList: Staff[],
  minPerDay: number
): ShiftResult {
  const daysInMonth = new Date(year, month, 0).getDate()
  const result: ShiftResult = {}

  for (const s of staffList) {
    result[s.id] = {}
    for (let d = 1; d <= daysInMonth; d++) {
      result[s.id][d] = s.daysOff.includes(d) ? 'off' : 'work'
    }
  }

  // Enforce min staff: if a day is short, convert some 'off' (non-requested) to 'work'
  for (let d = 1; d <= daysInMonth; d++) {
    const working = staffList.filter(s => result[s.id][d] === 'work').length
    const needed = minPerDay - working
    if (needed > 0) {
      const candidates = staffList.filter(s => result[s.id][d] === 'off' && !s.daysOff.includes(d))
      candidates.slice(0, needed).forEach(s => { result[s.id][d] = 'work' })
    }
  }

  return result
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function getDayOfWeek(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).getDay()
}
