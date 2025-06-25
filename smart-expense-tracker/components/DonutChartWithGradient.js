import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function DonutChartWithGradient({ refreshTrigger }) {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSpent, setTotalSpent] = useState(0);

    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

    const fetchChartData = async () => {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;

        try {
            const snapshot = await getDocs(collection(db, 'users', user.uid, 'receipts'));
            const totals = {};
            let sum = 0;

            const selectedYear = parseInt(selectedMonth.split('-')[0]);
            const selectedMonthNum = parseInt(selectedMonth.split('-')[1]) - 1;
            const monthStart = new Date(selectedYear, selectedMonthNum, 1);
            const monthEnd = new Date(selectedYear, selectedMonthNum + 1, 0);

            snapshot.forEach(doc => {
                const { category, total, date } = doc.data();
                const value = parseFloat(String(total).replace(/,/g, ''));
                const receiptDate = new Date(date);

                if (!isNaN(value) && category && receiptDate >= monthStart && receiptDate <= monthEnd) {
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
    };

    useEffect(() => {
        fetchChartData();
    }, [selectedMonth, refreshTrigger]);

    const getMonthOptions = () => {
        const options = [];
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= currentYear - 2; y--) {
            for (let m = 11; m >= 0; m--) {
                const key = `${y}-${String(m + 1).padStart(2, '0')}`;
                const label = new Date(y, m).toLocaleString('default', { month: 'short', year: 'numeric' });
                options.push({ label, value: key });
            }
        }
        return options;
    };

    if (loading) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>📊 Spending by Category</Text>

            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={setSelectedMonth}
                    style={styles.picker}
                    mode="dropdown"
                    dropdownIconColor="#4A90E2"
                >
                    {getMonthOptions().map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>

            <View style={styles.chartLegendRow}>
                {chartData.length ? (
                    <>
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
                    </>
                ) : (
                    <Text style={styles.noData}>No data available for this month</Text>
                )}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    pickerWrapper: {
        width: '100%',
        backgroundColor: '#F0F4F8',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        height: Platform.OS === 'android' ? 48 : undefined,
        color: '#212121',
    },
    chartLegendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
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
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },

});
