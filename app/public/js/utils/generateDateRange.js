//Generate a date range in epoch format given a desired time differential
export default function generateDateRange(timeDiff) {
  var now = new Date();
  var start = new Date(now.getTime() - (now.getTime() % 86400000));
  var end = new Date(start);

  switch (timeDiff) {
    case "today":
      end.setDate(end.getDate() + 1);
      break;
    case "tomorrow":
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 2);
      break;
    case "week":
      start.setDate(start.getDate() - start.getDay() + 1);
      end.setDate(end.getDate() - end.getDay() + 8);
      break;
    case "month":
      start.setDate(start.getDate() - start.getDate() + 1);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      break;
  }

  return { start: start.getTime(), end: end.getTime() };
}
