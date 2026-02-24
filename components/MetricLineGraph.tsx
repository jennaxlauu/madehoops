import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, Polyline, Text as SvgText } from 'react-native-svg';

type DataPoint = {
  date: string;
  value: number;
};

type MetricLineGraphProps = {
  data: DataPoint[];
  title: string;
  unit?: string;
};

export function MetricLineGraph({ data, title, unit = '' }: MetricLineGraphProps) {
  if (data.length < 2) {
    return null;
  }

  const width = Dimensions.get('window').width - 48;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - ((point.value - minValue) / valueRange) * graphHeight;
    return { x, y, value: point.value, date: point.date };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Svg width={width} height={height}>
        <Line
          x1={padding.left}
          y1={padding.top + graphHeight}
          x2={padding.left + graphWidth}
          y2={padding.top + graphHeight}
          stroke="#333333"
          strokeWidth="1"
        />

        <Line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + graphHeight}
          stroke="#333333"
          strokeWidth="1"
        />

        <Polyline points={polylinePoints} fill="none" stroke="#34C759" strokeWidth="2" />

        {points.map((point, index) => (
          <Circle key={index} cx={point.x} cy={point.y} r="4" fill="#34C759" />
        ))}

        {points.map((point, index) => (
          <SvgText
            key={`value-${index}`}
            x={point.x}
            y={point.y - 10}
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            {point.value.toFixed(1)}
            {unit}
          </SvgText>
        ))}

        <SvgText
          x={padding.left}
          y={padding.top + graphHeight + 25}
          fill="#999999"
          fontSize="10"
          textAnchor="middle"
        >
          {formatDate(data[0].date)}
        </SvgText>

        {data.length > 2 && (
          <SvgText
            x={padding.left + graphWidth / 2}
            y={padding.top + graphHeight + 25}
            fill="#999999"
            fontSize="10"
            textAnchor="middle"
          >
            {formatDate(data[Math.floor(data.length / 2)].date)}
          </SvgText>
        )}

        <SvgText
          x={padding.left + graphWidth}
          y={padding.top + graphHeight + 25}
          fill="#999999"
          fontSize="10"
          textAnchor="middle"
        >
          {formatDate(data[data.length - 1].date)}
        </SvgText>

        <SvgText
          x={padding.left - 10}
          y={padding.top + 5}
          fill="#999999"
          fontSize="10"
          textAnchor="end"
        >
          {maxValue.toFixed(1)}
        </SvgText>

        <SvgText
          x={padding.left - 10}
          y={padding.top + graphHeight}
          fill="#999999"
          fontSize="10"
          textAnchor="end"
        >
          {minValue.toFixed(1)}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
    marginBottom: 16,
  },
});
