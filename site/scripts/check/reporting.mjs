export const failures = []

export const fail = (message) => {
  failures.push(message)
  console.error(`FAIL ${message}`)
}

export const expect = (condition, message) => {
  if (!condition) fail(message)
  else console.log(`ok ${message}`)
}
