import pandas as pd
from scipy.stats import kruskal



def kruskal_wallis(df, issue_type):
    # Convert zz_duration from seconds to hours (if not already done)
    df['zz_duration'] = df['zz_duration'] / 3600

    # Group zz_duration by sentiment
    groups = [df.loc[df['roberta'] == sentiment, 'zz_duration'] for sentiment in df['roberta'].unique()]

    # Perform the Kruskal-Wallis test
    stat, p_value = kruskal(*groups)

    # Print results
    print(f"Kruskal-Wallis Statistic: {stat}")
    print(f"P-Value: {p_value}")

    # Interpret the results
    if p_value < 0.05:
        print(f"There is a significant difference in zz_duration between sentiment groups in issue type: {issue_type}.")
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