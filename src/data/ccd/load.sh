#!/bin/bash

csvsql --table publicschools1415 --db postgresql:///carbonwars --insert "EDGE_GEOIDS_201415_PUBLIC_SCHOOL.csv"
csvsql --table publicschoolsdetails1415 --tabs --db postgresql://czubakskees:tousle8251,waterside@localhost:3333/environment --insert "ccd_sch_029_1415_w_0216601a.txt"