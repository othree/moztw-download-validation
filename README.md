This is a file validator for moztw's Firefox installer download link.

Require:

* node
* jdk
* go

Build go:

    make

Install deps:

    npm i

And run:

    npm test

Go deps:
   
    go get github.com/vaughan0/go-ini
    go get github.com/kardianos/osext

Update ChromeDriver version:

1. Update chromedriver version in `package.json` https://www.npmjs.com/package/chromedriver
2. Update chromedriver version in `wdio.conf.js` https://chromedriver.storage.googleapis.com
