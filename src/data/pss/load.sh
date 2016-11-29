#!/bin/bash

csvsql -t --table privateschools1112 --db postgresql:///carbonwars --insert "pss1112_pu.txt"