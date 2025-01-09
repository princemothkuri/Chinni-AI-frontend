const formatRelativeDate = (isoDate: string): string => {
  const now = new Date();
  const givenDate = new Date(isoDate);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const nowKolkata = new Date(formatter.format(now));
  const givenDateKolkata = new Date(formatter.format(givenDate));

  const isToday = nowKolkata.toDateString() === givenDateKolkata.toDateString();
  const isYesterday =
    new Date(
      nowKolkata.getFullYear(),
      nowKolkata.getMonth(),
      nowKolkata.getDate() - 1
    ).toDateString() === givenDateKolkata.toDateString();
  const isTomorrow =
    new Date(
      nowKolkata.getFullYear(),
      nowKolkata.getMonth(),
      nowKolkata.getDate() + 1
    ).toDateString() === givenDateKolkata.toDateString();

  const differenceInDays = Math.ceil(
    (givenDateKolkata.getTime() - nowKolkata.getTime()) / (1000 * 60 * 60 * 24)
  );

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  if (isToday) {
    return `Today at ${givenDate.toLocaleTimeString("en-US", timeOptions)}`;
  } else if (isYesterday) {
    return `Yesterday you missed alarm at ${givenDate.toLocaleTimeString(
      "en-US",
      timeOptions
    )}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${givenDate.toLocaleTimeString("en-US", timeOptions)}`;
  } else if (differenceInDays < 0) {
    // In the past
    const daysAgo = Math.abs(differenceInDays);
    return daysAgo === 1
      ? `1 day ago you missed the alarm at ${givenDate.toLocaleTimeString(
          "en-US",
          timeOptions
        )}`
      : `${daysAgo} days ago you missed the alarm at ${givenDate.toLocaleTimeString(
          "en-US",
          timeOptions
        )}`;
  } else if (differenceInDays <= 7) {
    // Within a week
    const dayName = givenDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    });
    return `Next week ${dayName} at ${givenDate.toLocaleTimeString(
      "en-US",
      timeOptions
    )}`;
  } else {
    // Farther in the future
    return givenDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }
};

export default formatRelativeDate;
