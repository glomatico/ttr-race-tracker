export const getFormattedRaceTime = (raceTime: number) => {
  const date = new Date(raceTime * 1000)
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const seconds = date.getUTCSeconds().toString().padStart(2, '0')
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0')
  return `${minutes}:${seconds}.${milliseconds}`

}
