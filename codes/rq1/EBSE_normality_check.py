import pandas as pd
from scipy.stats import shapiro, normaltest, anderson
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

#TODO: update to your file path before using the code

#function that checks the normality (zz_duration against sentiment)
def normality_check(dataframe, dataframe_type):            
    # Group by sentiment
    sentiment_groups = dataframe.groupby('roberta')
    # Dictionary to store results
    normality_results = {}
    for sentiment, group in sentiment_groups:
        zz_duration = group['zz_duration'].dropna()  # Drop missing values

        #change time from seconds to hours
        zz_duration = zz_duration / 3600
        #if there is too little data left:
        if(len(zz_duration) < 3):
            print(f"too little data in: {key}, size: {len(zz_duration)}")
            continue
        # Perform Shapiro-Wilk test
        stat, p_value = shapiro(zz_duration)
        # Store the result
        normality_results[sentiment] = {'Shapiro-Wilk Statistic': stat, 'p-value': p_value}

        #uncomment below to plot the histogram and Q-Q plot for visualization
        plt.figure(figsize=(12, 5))
        # plt.subplot(1, 2, 1)
        sns.histplot(zz_duration, kde=True, bins=80, color='skyblue')
        plt.title(f'Histogram for {sentiment}, {dataframe_type}')
        plt.xlabel('zz_duration')
        plt.ylabel('Frequency')
        # plt.subplot(1, 2, 2)
        # sns.scatterplot(x=np.sort(zz_duration), y=np.sort(np.random.normal(np.mean(zz_duration), np.std(zz_duration), len(zz_duration))))
        # plt.title(f'Q-Q Plot for {sentiment}')
        # plt.xlabel('Theoretical Quantiles')
        # plt.ylabel('Sample Quantiles')
        plt.tight_layout()
        plt.show()
    # Print results
    for sentiment, result in normality_results.items():
        print(f"Sentiment: {sentiment}")
        print(f"  Shapiro-Wilk Statistic: {result['Shapiro-Wilk Statistic']:.4f}")
        print(f"  p-value: {result['p-value']:.4f}")
        print(f"number data points: {len(zz_duration)}")
        if result['p-value'] > 0.05:
            print("  Conclusion: Likely Normally Distributed\n")
        else:
            print("  Conclusion: Not Normally Distributed\n") 

#function that takes pulled apart data and combines into one dataset again
#input: dataframe -> data seperated into projects, type_df -> type of data to combine, e.g. comments (style: "_comment", "_summary")
def combine_data(dataframe, type_df):
    list_dataframes = []
    for key, dataframe in dataframe.items():
        if type_df in key:  # Filter for keys ending with '_comment'
            list_dataframes.append(dataframe)  # Add the DataFrame to the list

    print(f"appended {type_df}")
    return pd.concat(list_dataframes, ignore_index=True)

# Load the CSV file into a pandas DataFrame UPDATE TO YOUR FILE PATH
file_path = r"C:\Users\miaml\Desktop\EvidenceBasedSWE_SATDSentiment\RQ1\scored-data.csv"
df = pd.read_csv(file_path)

# Dictionary to hold the resulting dataframes
result_dfs = {}

#Group by 'project'
projects = df['project'].unique()

#data has to first be grouped into projects as IDs of comments/summaries/description overlap between projects
for project in projects:
    project_df = df[df['project'] == project]
    
    # Further group by 'issue_type', grouping all 'comment_*' types together
    project_types = project_df['issue_type'].unique()
    
    for issue_type in project_types:
        if issue_type.startswith('comment_'):
            # Combine all 'comment_*' issue types into a single group
            comment_df = project_df[project_df['issue_type'].str.startswith('comment_')]
            
            # Process comments grouped by 'issue_number'
            processed_comments = []

            #used to count how many groups did not have a majority
            non_majority = 0
            for issue_number, group in comment_df.groupby('issue_number'):
                sentiment_counts = group['roberta'].value_counts()
                # Check for the most frequent sentiment
                if len(sentiment_counts) == 1 or sentiment_counts.iloc[0] > sentiment_counts.iloc[1]:
                    # Keep all rows and assign the most frequent sentiment
                    most_frequent_sentiment = sentiment_counts.idxmax()
                    group['roberta'] = most_frequent_sentiment
                    processed_comments.append(group)
                else:
                    # Tie case: Skip the group
                    non_majority = non_majority + 1

                    #prints the issue_number of a (set of comments) where there is a tie in sentiment
                    # print(issue_number)
                    continue
            
            #uncomment to print in how many data points no majority could be established, these data points will be dropped
            # print(f"Non-Majority: {non_majority}, {project} ")
            non_majority = 0
            
            # Combine processed comments back into a single DataFrame
            if processed_comments:
                final_comments_df = pd.concat(processed_comments, ignore_index=True)
                result_dfs[f'{project}_comment'] = final_comments_df
            
        else:
            specific_type_df = project_df[project_df['issue_type'] == issue_type]
            result_dfs[f'{project}_{issue_type}'] = specific_type_df



#uncomment to save into separate .csv files
# for key, dataframe in result_dfs.items():
#     dataframe.to_csv(f'{key}.csv', index=False)

#uncomment to create a file with that includes the the entirety of the cleaned data
# combine_data(result_dfs, "_comment").to_csv("cleaned_data_comments.csv", index=False)
# combine_data(result_dfs, "_description").to_csv("cleaned_data_description.csv", index=False)



#Output the resulting dataframes
for key, dataframe in result_dfs.items():
    print(f"DataFrame for {key}:")
    print(dataframe)
    print("\n")


#checks for normality, outputs in written form wether the data is normally distributed or not as well as a histogram for visualisation
normality_check(combine_data(result_dfs, "_comment"), "comment")
normality_check(combine_data(result_dfs, "_summary"), "summary")
normality_check(combine_data(result_dfs, "_description"), "description")




