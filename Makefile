install:
	npm install

run:
	node ./app.js

geterrors:
	node ./app.js --getErrors

cluster:
	node ./src/cluster.js --size=$(size)

mocha:
	./node_modules/mocha/bin/mocha ./test/support/setup.js ./test/{,**/,**/**/}*_test.js
