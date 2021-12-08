#!/bin/bash

if command -v python &> /dev/null
then
  python -m http.server 8080
fi

if command -v python3 &> /dev/null
then
  python3 -m http.server 8080
else
  echo "Python is not installed :-("
fi

