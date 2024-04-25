export default function transformDataForLineChart(data) {
  if (!data) {
    return [
      ["Date", "Completion"],
      [new Date(), 0],
    ];
  }
  const result = [["Date", "Completion"]];
  data.forEach((entry) => {
    const date = new Date(entry.date);
    const completionRatio = parseFloat(entry.completion_ratio);
    result.push([date, completionRatio]);
  });

  return result;
}
