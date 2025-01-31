import pandas as pd
from scipy.stats import shapiro, normaltest, anderson
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np


# Load the CSV file into a pandas DataFrame
df = pd.read_csv('camel_comment.csv')

# Group by sentiment
sentiment_groups = df.groupby('roberta')

# Dictionary to store results
normality_results = {}

for sentiment, group in sentiment_groups:
    zz_duration = group['zz_duration'].dropna()  # Drop missing values

    # Perform Shapiro-Wilk test
    stat, p_value = shapiro(zz_duration)

    # Store the result
    normality_results[sentiment] = {'Shapiro-Wilk Statistic': stat, 'p-value': p_value}

    # Plot the histogram and Q-Q plot for visualization
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    sns.histplot(zz_duration, kde=True, bins=20, color='skyblue')
    plt.title(f'Histogram for {sentiment}')
    plt.xlabel('zz_duration')
    plt.ylabel('Frequency')

    plt.subplot(1, 2, 2)
    sns.scatterplot(x=np.sort(zz_duration), y=np.sort(np.random.normal(np.mean(zz_duration), np.std(zz_duration), len(zz_duration))))
    plt.title(f'Q-Q Plot for {sentiment}')
    plt.xlabel('Theoretical Quantiles')
    plt.ylabel('Sample Quantiles')

    plt.tight_layout()
    plt.show()

# Print results
for sentiment, result in normality_results.items():
    print(f"Sentiment: {sentiment}")
    print(f"  Shapiro-Wilk Statistic: {result['Shapiro-Wilk Statistic']:.4f}")
    print(f"  p-value: {result['p-value']:.4f}")
    if result['p-value'] > 0.05:
        print("  Conclusion: Likely Normally Distributed\n")
    else:
        print("  Conclusion: Not Normally Distributed\n")
