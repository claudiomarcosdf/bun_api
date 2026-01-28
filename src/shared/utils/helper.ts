const parseTimeToSeconds = (timeStr: string): number => {
  const unit = timeStr.slice(-1).toLowerCase();
  const value = parseInt(timeStr.slice(0, -1));

  switch (unit) {
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return Number(timeStr) || 86400; // Fallback para 24h se falhar
  }
};

export { parseTimeToSeconds };
