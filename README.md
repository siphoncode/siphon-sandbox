
siphon-sandbox
==============

Running (without Siphon)
------------------------

Make sure that node and watchman are installed and then install the React Native
client:

    $ brew install nvm
    $ nvm install node && nvm alias default node
    $ brew install watchman
    $ npm install -g react-native-cli

Create a new React Native project:

    $ react-native init SiphonSandbox
    $ cd SiphonSandbox/

Now, either clone siphon-base repo to another directory and manually copy the
files over to SiphonSandbox, or run the following in the SiphonSandbox/
directory (delete the index.ios.js file before this):

    $ git init
    $ git remote add origin git@bitbucket.org:getsiphon/siphon-sandbox.git
    $ git fetch
    $ git checkout -- .

After the fetch, git will register the siphon-sandbox files as being deleted
(since they are not there) so the last command 'undoes' this.

Install the dependencies of the Sandbox:

    $ npm install
