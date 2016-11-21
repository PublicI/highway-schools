#!/bin/bash

csvsql --table headstart16 --db postgresql:///carbonwars --insert "ALL_all.csv"