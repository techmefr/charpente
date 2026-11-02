import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { BonesData, CaptureConfig } from '../types'

const DEFAULT_FILE = 'charpente.bones.json'

export const bonesPath = (root: string, config: { capture?: CaptureConfig }): string =>
  resolve(root, config.capture?.out ?? DEFAULT_FILE)

export const readBones = (root: string, config: { capture?: CaptureConfig }): BonesData | undefined => {
  const file = bonesPath(root, config)
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as BonesData) : undefined
}

export const writeChangedBones = (root: string, config: { capture?: CaptureConfig }, data: BonesData): boolean => {
  const file = bonesPath(root, config)
  const next = `${JSON.stringify(data, null, 2)}\n`
  if (existsSync(file) && readFileSync(file, 'utf8') === next) return false
  writeBones(root, config, data)
  return true
}

export const writeBones =(root: string, config: { capture?: CaptureConfig }, data: BonesData): string => {
  const file = bonesPath(root, config)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
  return file
}
