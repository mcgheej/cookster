# Managing Firestore Snapshot Listeners

Started getting errors fromthe snapshot listeners when logging out of application.

Needed to change how snapshot listener for plans collection was managed to factor in whether or not the user is authenticated. Changed the contructor to handle _onAuthStateChanged_ events and start / stop snaphot listeners as required.
