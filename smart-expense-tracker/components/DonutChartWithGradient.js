import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';


export default function DonutChartWithGradient() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        (async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const snap = await getDocs(collection(db, 'users', user.uid, 'receipts'));
                const totals = {};
                let sum = 0;

                snap.forEach(doc => {
                    let { category, total } = doc.data();
                    let value = parseFloat(String(total).replace(/,/g, ''));
                    if (!isNaN(value) && category) {
                        totals[category] = (totals[category] || 0) + value;
                        sum += value;
                    }
                });

                const colors = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336', '#FFC107'];
                const data = Object.entries(totals).map(([cat, val], i) => ({
                    value: parseFloat(val.toFixed(2)),
                    color: colors[i % colors.length],
                    gradientCenterColor: colors[i % colors.length],
                    text: cat,
                    category: cat,
                }));

                setChartData(data);
                setTotalSpent(sum);
            } catch (e) {
                console.error('Error loading donut chart data:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#4A90E2" />;
    if (!chartData.length) return <Text style={styles.noData}>No data to show</Text>;

    return (
        <View style={styles.container}>

            {/* Title */}
            <Text style={styles.title}>📊 Spending by Category</Text>

            {/* Chart + Legend Row */}
            <View style={styles.chartLegendRow}>
                <PieChart
                    data={chartData}
                    donut
                    showText={false}
                    radius={100}
                    innerRadius={80}
                    isAnimated
                    centerLabelComponent={() => (
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            LKR {totalSpent.toFixed(0)}
                        </Text>
                    )}
                />
                <View style={styles.legendContainer}>
                    {chartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <Text style={styles.legendLabel}>{item.category}</Text>
                        </View>
                    ))}
                </View>
            </View>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        elevation: 3,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    chartLegendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        marginBottom: 24,
    },
    legendContainer: {
        flexDirection: 'column',
        maxWidth: 110,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    legendLabel: {
        fontSize: 14,
        color: '#333',
    },
    
    noData: {
        color: '#888',
        marginTop: 30,
        textAlign: 'center',
    },
});
