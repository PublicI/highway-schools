#!/bin/bash

csvsql --table publicschools1415 --db postgresql:///carbonwars --insert "EDGE_GEOIDS_201415_PUBLIC_SCHOOL.csv"