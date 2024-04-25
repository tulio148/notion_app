export function findInstanceWithHighestCounts(dataArray) {
  let highestDoneCount = 0;
  let highestNotStartedCount = 0;
  let instanceWithHighestCounts = null;

  dataArray.forEach((item) => {
    if (item.cumulative_done_count > highestDoneCount) {
      highestDoneCount = item.cumulative_done_count;
      highestNotStartedCount = item.cumulative_not_started_count;
      instanceWithHighestCounts = item;
    }
  });

  return instanceWithHighestCounts;
}

// Function to calculate completion rate
export function calculateCompletionRate(completions, nonCompletions) {
  const total = completions + nonCompletions;
  return total > 0 ? (completions / total) * 100 : 0;
}
