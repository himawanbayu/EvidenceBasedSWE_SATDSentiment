import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the data from the CSV file
file_path = r"C:\Users\miaml\Desktop\EvidenceBasedSWE_SATDSentiment\RQ1\scored-data.csv"
data = pd.read_csv(file_path)

# Ensure the columns of interest are selected (replace 'ColumnA' and 'ColumnB' with actual column names)
data_subset = data[['classification', 'roberta']]

# Rename columns for clarity (optional)
data_subset.columns = ['TechnicalDebtType', 'Sentiment']# Count occurrences for each combination of TechnicalDebtType and Sentiment
counts = data_subset.groupby(['TechnicalDebtType', 'Sentiment']).size().reset_index(name='Count')

# Create a bar plot using seaborn
plt.figure(figsize=(12, 8))
sns.barplot(
    data=counts,
    x='TechnicalDebtType',
    y='Count',
    hue='Sentiment',
    palette='muted'
)

# Customize the plot
plt.title('Counts of Technical Debt Types by Sentiment', fontsize=16)
plt.xlabel('Technical Debt Type', fontsize=12)
plt.ylabel('Count', fontsize=12)
plt.legend(title='Sentiment', fontsize=10)
plt.tight_layout()

# Show the plot
plt.show()