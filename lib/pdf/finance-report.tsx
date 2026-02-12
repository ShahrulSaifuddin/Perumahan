import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { FinanceOverview } from "@/lib/api/finance";
import { Transaction } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#112233",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  summaryGrid: {
    flexDirection: "row",
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f6f6f6",
    marginRight: 10,
    borderRadius: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  colDate: { width: "15%", fontSize: 10 },
  colType: { width: "10%", fontSize: 10 },
  colCat: { width: "20%", fontSize: 10 },
  colDesc: { width: "35%", fontSize: 10 },
  colAmount: { width: "20%", fontSize: 10, textAlign: "right" },
});

interface FinanceReportProps {
  year: number;
  overview: FinanceOverview;
  transactions: any[];
}

export const FinanceReportPDF = ({
  year,
  overview,
  transactions,
}: FinanceReportProps) => {
  const txs = transactions as Transaction[];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            DBKL Flat Management - Finance Report
          </Text>
          <Text style={styles.subtitle}>
            Year: {year} | Generated on {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Allocation</Text>
            <Text style={styles.summaryValue}>
              RM {overview.allocation.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>
              RM {overview.spent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remaining Balance</Text>
            <Text style={styles.summaryValue}>
              RM {overview.balance.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 14,
            marginTop: 20,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          Transaction History
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDate}>Date</Text>
            <Text style={styles.colType}>Type</Text>
            <Text style={styles.colCat}>Category</Text>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {txs.map((tx) => (
            <View key={tx.id} style={styles.tableRow}>
              <Text style={styles.colDate}>{tx.transaction_date}</Text>
              <Text style={styles.colType}>{tx.type}</Text>
              <Text style={styles.colCat}>{tx.category}</Text>
              <Text style={styles.colDesc}>{tx.description}</Text>
              <Text style={styles.colAmount}>
                {tx.type === "IN" ? "+" : "-"} {Number(tx.amount).toFixed(2)}
              </Text>
            </View>
          ))}
          {txs.length === 0 && (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 10, color: "#666" }}>
                No transactions found for this period.
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
