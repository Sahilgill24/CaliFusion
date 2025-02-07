# this would be a trial model to be tested
# and see if it works and do the pderson commitments on it and then send it to the blockchain along with
# the commitment generators to make it private and secure
# as the blockchain is the one that is aggregating the final results
# so the challenge is to provide the blockchain with the commitment generators
# source for this linear regression model 
# https://www.geeksforgeeks.org/ml-linear-regression/
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.axes as ax
from matplotlib.animation import FuncAnimation



data = pd.read_csv('./data.csv')
data.dropna(inplace=True)

train_input = np.array(data.x[0:175]).reshape(175, 1)
train_output = np.array(data.y[0:175]).reshape(175, 1)

class LinearRegression:
    def __init__(self):
        self.parameters = {}

    def forward_propagation(self, train_input):
        m = self.parameters['m']
        c = self.parameters['c']
        predictions = np.multiply(m, train_input) + c
        return predictions

    def cost_function(self, predictions, train_output):
        cost = np.mean((train_output - predictions) ** 2)
        return cost

    def backward_propagation(self, train_input, train_output, predictions):
        derivatives = {}
        df = (predictions - train_output)
        # dm = 2/n * mean of (predictions-actual) * input
        dm = 2 * np.mean(np.multiply(train_input, df))
        # dc = 2/n * mean of (predictions-actual)
        dc = 2 * np.mean(df)
        derivatives['dm'] = dm
        derivatives['dc'] = dc
        return derivatives

    def update_parameters(self, derivatives, learning_rate):
        self.parameters['m'] = self.parameters['m'] - learning_rate * derivatives['dm']
        self.parameters['c'] = self.parameters['c'] - learning_rate * derivatives['dc']

    def train(self, train_input, train_output, learning_rate, iters):
        # Initialize random parameters
        self.parameters['m'] = np.random.randn() * 0.01  # Small random value
        self.parameters['c'] = np.random.randn() * 0.01  # Small random value


        # Initialize loss
        self.loss = []

        # Initialize figure and axis for animation
        fig, ax = plt.subplots()
        x_vals = np.linspace(min(train_input), max(train_input), 100)
        line, = ax.plot(x_vals, self.parameters['m'] * x_vals + self.parameters['c'], color='red', label='Regression Line')
        ax.scatter(train_input, train_output, marker='o', color='green', label='Training Data')

        # Set y-axis limits to exclude negative values
        ax.set_ylim(0, max(train_output) + 1)

        def update(frame):
            # Forward propagation
            predictions = self.forward_propagation(train_input)

            # Cost function
            cost = self.cost_function(predictions, train_output)

            # Back propagation
            derivatives = self.backward_propagation(train_input, train_output, predictions)

            # Update parameters
            self.update_parameters(derivatives, learning_rate)

            # Update the regression line
            line.set_ydata(self.parameters['m'] * x_vals + self.parameters['c'])

            # Append loss and print
            self.loss.append(cost)
            cost = int(cost * (10**3)) 
            # now this cost will be first encrypted using the Pederson commitments and then in the aggregator.py sent to the blockchain for aggregation and it is normalized so will be /1000
            print("Iteration = {}, Loss = {}".format(frame + 1, cost))
            return line,

        # Create animation
        ani = FuncAnimation(fig, update, frames=iters, interval=200, blit=True)

        # Save the animation as a video file (e.g., MP4)
        ani.save('linear_regression_A.gif', writer='ffmpeg')

        plt.xlabel('Input')
        plt.ylabel('Output')
        plt.title('Linear Regression')
        plt.legend()
        plt.show()

        

        return self.parameters, self.loss


linear_reg = LinearRegression()
parameters, loss = linear_reg.train(train_input, train_output, 0.0001, 10)
loss_final = int(loss * (10**3)) 
print(loss_final)
# this is for the normalization of the commitments 

