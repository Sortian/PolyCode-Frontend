import React from "react";

const CHART_HEIGHT = 100;
const CHART_PAD = { top: 8, right: 4, bottom: 22, left: 4 };

function bucketWeeks(days) {
  const weeks = [];
  for (let index = 0; index < days.length; index += 7) {
    const chunk = days.slice(index, index + 7);
    if (!chunk.length) continue;
    const start = chunk[0];
    const end = chunk[chunk.length - 1];
    weeks.push({
      key: start.key,
      label: `${start.label} – ${end.label}`,
      shortLabel: end.label,
      count: chunk.reduce((sum, day) => sum + day.count, 0),
    });
  }
  return weeks;
}

function sampleAxisLabels(items, maxLabels = 5) {
  if (items.length <= maxLabels) return items.map((item, index) => ({ index, label: item.shortLabel || item.label }));
  const step = Math.max(1, Math.floor((items.length - 1) / (maxLabels - 1)));
  const labels = [];
  for (let index = 0; index < items.length; index += step) {
    labels.push({ index, label: items[index].shortLabel || items[index].label });
  }
  const lastIndex = items.length - 1;
  if (labels[labels.length - 1]?.index !== lastIndex) {
    labels.push({ index: lastIndex, label: items[lastIndex].shortLabel || items[lastIndex].label });
  }
  return labels;
}

function ChartTooltip({ tooltip }) {
  if (!tooltip) return null;
  return (
    <div
      className="profile-activity-tooltip profile-chart-tooltip"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      {tooltip.text}
    </div>
  );
}

export function ActivityLineChart({ days }) {
  const [tooltip, setTooltip] = React.useState(null);
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const width = Math.max(days.length * 6, 280);
  const innerW = width - CHART_PAD.left - CHART_PAD.right;
  const innerH = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom;
  const axisLabels = sampleAxisLabels(
    days.map((day) => ({ ...day, shortLabel: day.label })),
  );

  const points = days.map((day, index) => {
    const x =
      CHART_PAD.left +
      (days.length <= 1 ? innerW / 2 : (index / (days.length - 1)) * innerW);
    const y = CHART_PAD.top + innerH - (day.count / maxCount) * innerH;
    return { ...day, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? CHART_PAD.left} ${
    CHART_PAD.top + innerH
  } L ${points[0]?.x ?? CHART_PAD.left} ${CHART_PAD.top + innerH} Z`;

  const showTooltip = (event, day) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: `${day.label}: ${day.count} lesson${day.count === 1 ? "" : "s"}`,
    });
  };

  return (
    <div className="profile-activity-chart profile-activity-line-chart">
      <h3>Daily trend</h3>
      <div className="profile-chart-wrap">
        <svg
          className="profile-chart-svg"
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Line chart of daily lesson completions"
        >
          <defs>
            <linearGradient id="profile-activity-line-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan, #00d4ff)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--cyan, #00d4ff)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={CHART_PAD.left}
              x2={width - CHART_PAD.right}
              y1={CHART_PAD.top + innerH * (1 - ratio)}
              y2={CHART_PAD.top + innerH * (1 - ratio)}
              className="profile-chart-grid-line"
            />
          ))}
          <path d={areaPath} className="profile-chart-area" />
          <path d={linePath} className="profile-chart-line" />
          {points.map((point) => (
            <circle
              key={point.key}
              cx={point.x}
              cy={point.y}
              r={point.count > 0 ? 3.5 : 2}
              className={`profile-chart-point${point.count > 0 ? " is-active" : ""}`}
              tabIndex={0}
              aria-label={`${point.label}: ${point.count} lessons`}
              onMouseEnter={(event) => showTooltip(event, point)}
              onMouseLeave={() => setTooltip(null)}
              onFocus={(event) => showTooltip(event, point)}
              onBlur={() => setTooltip(null)}
            />
          ))}
          {axisLabels.map(({ index, label }) => {
            const x =
              CHART_PAD.left +
              (days.length <= 1 ? innerW / 2 : (index / (days.length - 1)) * innerW);
            return (
              <text
                key={`${label}-${index}`}
                x={x}
                y={CHART_HEIGHT - 4}
                className="profile-chart-axis-label"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}
        </svg>
        <ChartTooltip tooltip={tooltip} />
      </div>
    </div>
  );
}

export function ActivityBarChart({ days }) {
  const [tooltip, setTooltip] = React.useState(null);
  const weeks = React.useMemo(() => bucketWeeks(days), [days]);
  const maxCount = Math.max(1, ...weeks.map((week) => week.count));
  const width = Math.max(weeks.length * 28, 280);
  const innerW = width - CHART_PAD.left - CHART_PAD.right;
  const innerH = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom;
  const barGap = 8;
  const barWidth = Math.max(
    10,
    (innerW - barGap * Math.max(weeks.length - 1, 0)) / Math.max(weeks.length, 1),
  );
  const axisLabels = sampleAxisLabels(weeks);

  const showTooltip = (event, week) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: `${week.label}: ${week.count} lesson${week.count === 1 ? "" : "s"}`,
    });
  };

  return (
    <div className="profile-activity-chart profile-activity-bar-chart">
      <h3>Weekly totals</h3>
      <div className="profile-chart-wrap">
        <svg
          className="profile-chart-svg"
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Bar chart of weekly lesson completions"
        >
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={CHART_PAD.left}
              x2={width - CHART_PAD.right}
              y1={CHART_PAD.top + innerH * (1 - ratio)}
              y2={CHART_PAD.top + innerH * (1 - ratio)}
              className="profile-chart-grid-line"
            />
          ))}
          {weeks.map((week, index) => {
            const barHeight = (week.count / maxCount) * innerH;
            const x = CHART_PAD.left + index * (barWidth + barGap);
            const y = CHART_PAD.top + innerH - barHeight;
            return (
              <rect
                key={week.key}
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, week.count > 0 ? 3 : 0)}
                rx={3}
                className={`profile-chart-bar${week.count > 0 ? " is-active" : ""}`}
                tabIndex={0}
                aria-label={`${week.label}: ${week.count} lessons`}
                onMouseEnter={(event) => showTooltip(event, week)}
                onMouseLeave={() => setTooltip(null)}
                onFocus={(event) => showTooltip(event, week)}
                onBlur={() => setTooltip(null)}
              />
            );
          })}
          {axisLabels.map(({ index, label }) => {
            const x = CHART_PAD.left + index * (barWidth + barGap) + barWidth / 2;
            return (
              <text
                key={`${label}-${index}`}
                x={x}
                y={CHART_HEIGHT - 4}
                className="profile-chart-axis-label"
                textAnchor="middle"
              >
                {label}
              </text>
            );
          })}
        </svg>
        <ChartTooltip tooltip={tooltip} />
      </div>
    </div>
  );
}
