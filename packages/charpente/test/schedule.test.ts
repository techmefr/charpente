import { describe, expect, it } from 'vitest'
import { schedulePresets, themeAt } from '../src'
import type { CharpenteConfig } from '../src'

const config: CharpenteConfig = {
  defaultTheme: 'solid',
  timeZone: 'Europe/Paris',
  schedule: [
    { theme: 'web', from: '10-15', to: '11-02' },
    { theme: 'dots', from: '12-01', to: '12-31' },
    { theme: 'outline', from: '12-21', to: '03-19' },
  ],
}

const at = (iso: string): string => themeAt(config, new Date(iso))

describe('themeAt', () => {
  it('uses the default theme outside every range', () => {
    expect(at('2026-05-15T12:00:00Z')).toBe('solid')
  })

  it('picks the scheduled theme inside a range', () => {
    expect(at('2026-10-31T12:00:00Z')).toBe('web')
  })

  it('includes both ends of a range', () => {
    expect(at('2026-10-15T12:00:00Z')).toBe('web')
    expect(at('2026-11-02T12:00:00Z')).toBe('web')
  })

  it('lets the first matching entry win when ranges overlap', () => {
    expect(at('2026-12-25T12:00:00Z')).toBe('dots')
  })

  it('handles a range that wraps over the new year', () => {
    expect(at('2027-01-05T12:00:00Z')).toBe('outline')
    expect(at('2027-03-19T12:00:00Z')).toBe('outline')
    expect(at('2027-03-20T12:00:00Z')).toBe('solid')
  })

  it('reads the day in the configured time zone, not in UTC', () => {
    expect(at('2026-11-02T23:30:00Z')).toBe('solid')
  })

  it('falls back to solid without any configuration', () => {
    expect(themeAt({}, new Date('2026-05-15T12:00:00Z'))).toBe('solid')
  })
})

describe('schedulePresets', () => {
  const config = { defaultTheme: 'solid', schedule: schedulePresets.all }
  it.each([
    ['2026-10-31', 'halloween'],
    ['2026-12-25', 'noel'],
    ['2026-12-31', 'nouvel-an'],
    ['2027-01-02', 'nouvel-an'],
    ['2027-02-10', 'hiver'],
    ['2026-04-10', 'printemps'],
    ['2026-07-14', 'ete'],
    ['2026-09-30', 'automne'],
  ])('picks the theme for %s', (day, theme) => {
    expect(themeAt(config, new Date(`${day}T12:00:00Z`))).toBe(theme)
  })
})
