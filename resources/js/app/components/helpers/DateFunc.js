const dateCurrentTimeZone = (utc_data) => {
	let date_utc = new Date(utc_data);

	const year = date_utc.getFullYear();
	const montn = date_utc.getMonth();
	const day = date_utc.getDate();
	const hour = date_utc.getHours();
	const minute = date_utc.getMinutes();
	const second = date_utc.getSeconds();
	return new Date(Date.UTC(year, montn, day, hour, minute, second));
}

export default {
	dateCurrentTimeZone
}