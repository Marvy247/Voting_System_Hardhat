🖥️ Application Workflow
1️⃣ Welcome Screen (Landing Page)
Purpose: Acts as the entry point of the DApp, prompting users to connect their wallet before proceeding.

Components:

Header/Navbar: App branding, navigation (if applicable).

Wallet Connection Button: Calls connectWallet() and stores the user's address.

Notification/Error Messages: Displays connection status.

🔄 Flow:
➡️ User connects wallet → Redirects to Dashboard

2️⃣ Dashboard (Home)
Purpose: Serves as the main page after wallet connection, displaying voting status and options.

Components:

Voting Status Indicator: Calls isVotingActive().

Start Voting Button (if admin): Calls startVoting(duration).

End Voting Button (if admin): Calls endVoting().

Total Votes Counter: Calls getTotalVotes().

Candidate List: Fetches candidates using getAllCandidates().

Vote Button: Calls vote(candidateId).

Add Candidate Button (if admin): Opens a modal to add a candidate.

🔄 Flow:
➡️ Admin can start/end voting
➡️ Users can view candidates and vote
➡️ Admin can add/remove candidates

3️⃣ Candidate Management (Admin Only)
Purpose: Allows the admin to manage candidates.

Components:

Add Candidate Form: Calls addCandidate(name).

Delete Candidate Button: Calls deleteCandidate(candidateId).

Candidate List: Displays all candidates and their vote count.

🔄 Flow:
➡️ Admin adds/deletes candidates

4️⃣ Voting Page
Purpose: Allows users to view candidates and vote.

Components:

Candidate List: Calls getAllCandidates().

Vote Button (If user hasn’t voted): Calls vote(candidateId).

Vote Confirmation Message: Shows transaction receipt after voting.

Voting Status: Calls hasVoted(userAddress).

🔄 Flow:
➡️ Users select a candidate and vote
➡️ Vote is recorded and updated in UI

5️⃣ Voting Results Page
Purpose: Displays the results after voting ends.

Components:

Candidate List with Vote Count: Calls getAllCandidates().

Total Votes Count: Calls getTotalVotes().

Winner Announcement (if applicable).

🔄 Flow:
➡️ Users view election results

6️⃣ Notifications & Event Listeners
Purpose: Keeps the app updated in real-time with blockchain events.

Components:

Voting Started Event Listener: Calls listenToVotingStarted().

Voting Ended Event Listener: Calls listenToVotingEnded().

Candidate Added/Removed Listener: Calls listenToCandidateAdded() and listenToCandidateRemoved().

Vote Cast Listener: Calls listenToVoteCast().
