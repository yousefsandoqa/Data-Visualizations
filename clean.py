#https://www.kaggle.com/datasets/adilshamim8/student-depression-dataset

import pandas as pd

df = pd.read_csv('data.csv')

df.dropna(inplace=True) #empty values dropped
df.drop_duplicates(inplace=True) #duplicate rows dropped
columns_to_drop = ['Study Satisfaction', 'Job Satisfaction', 'Sleep Duration', 
                    'Academic Pressure', 'Work Pressure', 'Dietary Habits',
                    'Financial Stress','Family History of Mental Illness', 'CGPA' ] #non needed columns dropped
df.drop(columns=columns_to_drop, inplace=True)
df.to_csv('cleaned_data.csv', index=False)