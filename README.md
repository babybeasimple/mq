mq
==
Small message queue test application

### Install application
```bash
make install
```

### Run application
```bash
make run
```

### Get errors
```bash
make geterrors
```

### Run application cluster
with default size equal 8
```bash
make cluster
```

with custom size
```bash
make cluster size=100
```

### Run tests (WARNING it used database 0, and will flush it)
```bash
make mocha
```
