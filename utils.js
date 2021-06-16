function normalize(val, max, min) { return (val - min) / (max - min); }

const zeroPad = (num, places) => String(num).padStart(places, '0')