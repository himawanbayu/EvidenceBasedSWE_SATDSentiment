import pandas as pd
from scipy.stats import kruskal
import numpy as np
import scikit_posthocs as sp

def verify_data(df):
    print(df['roberta'].value_counts())
    print(df.groupby('roberta')['zz_duration'].agg(['mean', 'median', 'std', 'size']))
    df = df[df['zz_duration'].notna()]
    print(df.dtypes)
    df['zz_duration'] = pd.to_numeric(df['zz_duration'], errors='coerce')
    df['roberta'] = df['roberta'].astype('category')
    # Check group sizes
    print(df['roberta'].value_counts())

    # Check for missing or non-numeric values in zz_duration
    print(df['zz_duration'].isna().sum())
    print(df['zz_duration'].describe())

    # Check for groups with no variability
    print(df.groupby('roberta')['zz_duration'].agg(['mean', 'std', 'size']))

    # Remove groups with fewer than 2 observations or no variability
    filtered_groups = df['roberta'].value_counts()[df['roberta'].value_counts() > 1].index
    df = df[df['roberta'].isin(filtered_groups)]


def kruskal_wallis(df, issue_type):
    # Convert zz_duration from seconds to hours (if not already done)
    df['zz_duration'] = df['zz_duration'] / 3600

    # Group zz_duration by sentiment
    unique_sentiments = df['roberta'].unique()
    groups = [df.loc[df['roberta'] == sentiment, 'zz_duration'] for sentiment in unique_sentiments]

    # Perform the Kruskal-Wallis test
    stat, p_value = kruskal(*groups)

    # Print results
    print(f"Kruskal-Wallis Statistic: {stat}")
    print(f"P-Value: {p_value}")

    # Interpret the results
    if p_value < 0.05:
        print(f"There is a significant difference in zz_duration between sentiment groups in issue type: {issue_type}.")
        
        # Post hoc analysis using Dunn test
        print("\nPerforming post hoc analysis with Dunn test...")

        
        verify_data(df)

        
        # Perform Dunn test
        posthoc_results = sp.posthoc_dunn(df, val_col='zz_duration', group_col='roberta', p_adjust='holm')


        # Convert results to a DataFrame for better readability
        results_df = pd.DataFrame(posthoc_results, index=unique_sentiments, columns=unique_sentiments)
        print("\nPairwise comparisons (Dunn test with Bonferroni adjustment):")
        print(results_df)

        # Save the results to a CSV file
        # results_df.to_csv(f'posthoc_results_{issue_type}.csv')
        print(f"\nPost hoc results saved to: posthoc_results_{issue_type}.csv")
    else:
        print(f"No significant difference in zz_duration between sentiment groups in issue type {issue_type}.")


# Load the CSV file into a pandas DataFrame UPDATE TO YOUR FILE PATH
file_path_comments = r"C:\Users\miaml\Desktop\EvidenceBasedSWE_SATDSentiment\RQ1\cleaned_data_comments.csv"
df_comments = pd.read_csv(file_path_comments)
kruskal_wallis(df_comments, "comments")

# Load the CSV file into a pandas DataFrame UPDATE TO YOUR FILE PATH
file_path_description = r"C:\Users\miaml\Desktop\EvidenceBasedSWE_SATDSentiment\RQ1\cleaned_data_description.csv"
df_description = pd.read_csv(file_path_description)
kruskal_wallis(df_description, "description")
