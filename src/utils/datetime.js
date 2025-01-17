export const YMDHMS = (date) => {
	return `${date.match(/\d{4}-\d{2}-\d{2}/g)} ${date.match(/\d{2}:\d{2}/g)}`
}