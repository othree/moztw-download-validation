This is a file validator for moztw's Firefox installer download link.

Require:

* node
* jdk
* go

Install protractor:

    npm i -g protractor
    webdriver-manager update

Start webdriver:

    webdriver-manager start

Install deps:

    npm i

Use iojs for Promise:

    nvm use iojs

And run:

    protroctor conf.js

Go deps:
   
    go get github.com/vaughan0/go-ini
    go get github.com/kardianos/osext

