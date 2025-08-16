export const formatTime = (seconds: number): string => {
	const minutes = String(Math.floor(seconds / 60));
	const remainingSeconds = String(seconds % 60).padStart(2, "0");
	return `${minutes}:${remainingSeconds}`
}