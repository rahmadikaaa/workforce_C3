import React from 'react';
import { View, Text, StyleSheet, Svg, Polygon, Line } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 10,
  },
  nodeWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeBox: {
    backgroundColor: '#f3f0ff',
    color: '#1e293b',
    borderRadius: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d8b4fe',
    borderStyle: 'solid',
    minWidth: 150,
    maxWidth: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  arrowContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: '100%',
  },
});

export default function CustomWorkflowDiagramPDF({ steps }) {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return null;

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <View style={styles.nodeWrapper} wrap={false}>
            <View style={styles.nodeBox}>
              <Text style={styles.nodeText}>{step.name}</Text>
            </View>
          </View>

          {index < steps.length - 1 && (
            <View style={styles.arrowContainer} wrap={false}>
              <Svg height="24" width="10">
                <Line x1="5" y1="0" x2="5" y2="18" strokeWidth={1} stroke="#475569" />
                <Polygon points="1,18 9,18 5,24" fill="#475569" />
              </Svg>
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
