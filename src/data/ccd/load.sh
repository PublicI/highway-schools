#!/bin/bash

csvsql --table publicshools1415 --db postgresql:///carbonwars --insert "EDGE_GEOIDS_201415_PUBLIC_SCHOOL.csv"