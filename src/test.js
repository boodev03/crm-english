import dayjs from "dayjs";

const day = dayjs("2025-05-10");

for (let i = 0; i < 7; i++) {
  const newDate = day.add(i, "day");
  console.log(dayjs(newDate).day());
}
