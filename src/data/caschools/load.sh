#!/bin/bash

csvsql -t --table caschools --db postgresql:///carbonwars --insert "pubschls.txt"