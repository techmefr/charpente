import type { CharpenteConfig, ScheduleEntry } from './types'

const DAY_PATTERN = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const DEFAULT_THEME = 'solid'

type ScheduleConfig = Pick<CharpenteConfig, 'defaultTheme' | 'timeZone' | 'schedule'>

const dayNumber = (day: string): number => {
  const [month, date] = day.split('-').map(Number)
  return (month as number) * 100 + (date as number)
}

const dayOf = (date: Date, timeZone: string | undefined): number => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, month: 'numeric', day: 'numeric' }).formatToParts(date)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)
  return month * 100 + day
}

const covers = ({ from, to }: ScheduleEntry, today: number): boolean => {
  const start = dayNumber(from)
  const end = dayNumber(to)
  return start <= end ? today >= start && today <= end : today >= start || today <= end
}

export const validateSchedule = (
  schedule: ScheduleEntry[],
  themeNames: string[],
  timeZone: string | undefined,
): void => {
  if (timeZone) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone })
    } catch {
      throw new Error(`charpente: unknown time zone "${timeZone}"`)
    }
  }
  for (const entry of schedule) {
    if (!themeNames.includes(entry.theme)) {
      throw new Error(`charpente: schedule uses unknown theme "${entry.theme}"`)
    }
    for (const day of [entry.from, entry.to]) {
      if (!DAY_PATTERN.test(day)) {
        throw new Error(`charpente: schedule date "${day}" must look like MM-DD`)
      }
    }
  }
}

export const themeAt = (config: ScheduleConfig, date: Date = new Date()): string => {
  const today = dayOf(date, config.timeZone)
  const match = config.schedule?.find((entry) => covers(entry, today))
  return match?.theme ?? config.defaultTheme ?? DEFAULT_THEME
}

const celebrations: ScheduleEntry[] = [
  { theme: 'halloween', from: '10-15', to: '11-02' },
  { theme: 'noel', from: '12-15', to: '12-26' },
  { theme: 'nouvel-an', from: '12-27', to: '01-03' },
]

const seasons: ScheduleEntry[] = [
  { theme: 'hiver', from: '12-21', to: '03-19' },
  { theme: 'printemps', from: '03-20', to: '06-20' },
  { theme: 'ete', from: '06-21', to: '09-22' },
  { theme: 'automne', from: '09-23', to: '12-20' },
]

export const schedulePresets = {
  celebrations,
  seasons,
  all: [...celebrations, ...seasons],
}
