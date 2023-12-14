a. Prerequisites：
Ensure that your environment meets all the necessary requirements:

npm hardhat


b. Configuration：

Environment Setup:
Create a .env file in your project root directory and specify the following configurations:

GOERLI_API_URL: Your Goerli testnet API URL.
PRIVATE_KEY: Your Ethereum wallet private key.
CONTRACT_ADDRESS: "0x53d02b01dcB128224F51715AF4F2Cf32c262113f" 
Note：Just leave this exact contract address here, I can't remove the contract address otherwise the code won't properly run. 

c. Running the Application
1. Start the Frontend:
Run the following command to start the frontend server. This will serve the application on localhost:3000.
node index.js

2. Start the Backend:
In a separate terminal, start the backend server which will run on localhost:4000.
node server.js

3. Access the Web Application:
Open a web browser and navigate to http://localhost:3000 to access the application.

4. Connect to Metamask:
Ensure that Metamask is installed in your browser and connect it to the application.

5. Participate in Voting:

If there's an existing vote, you can view the candidates and submit your vote.
To create a new vote, navigate to the 'Create Vote' page and follow the instructions to set up a new voting session.


Note
The application is configured for the Goerli testnet. Ensure your Metamask is set to the Goerli network.
Interactions with the blockchain, such as submitting votes or creating a new vote, require a connection to your Ethereum wallet via Metamask.
