import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Load the dataset
file_path = '../trialdata/data4.csv'  # Update this with your file path
data = pd.read_csv(file_path)

# Extract features (x) and target (y)
X = data[['x']]  # Features should be in a 2D array
y = data['y']    # Target variable

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize the Linear Regression model
model = LinearRegression()

# Train the model on the training data
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Example: Predicting new values
example_input = [[30]]  # Replace with new values to predict
example_prediction = model.predict(example_input)

# Output only the numeric prediction value
print(example_prediction[0])
