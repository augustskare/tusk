const formatter = new Intl.RelativeTimeFormat("en", {
  style: "short",
});
const formatter2 = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
function daysAgo(dateString: string) {
  const date = new Date(dateString);
  const hours = (date.getTime() - new Date().getTime()) / 36e5;
  const minutes = hours * 60;

  if (Math.abs(minutes) <= 60) {
    return formatter.format(Math.round(minutes), "minutes");
  }

  if (Math.abs(hours) <= 24) {
    return formatter.format(Math.round(hours), "hours");
  }

  return formatter2.format(date);
}

function Time(props: { children: string }) {
  return (
    <time
      dateTime={props.children}
      title={new Date(props.children).toLocaleString()}
    >
      {daysAgo(props.children)}
    </time>
  );
}

export { Time };
