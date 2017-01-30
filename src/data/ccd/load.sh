#!/bin/bash

csvsql --table publicschools1415 --insert "EDGE_GEOIDS_201415_PUBLIC_SCHOOL.csv"
csvsql --table publicschoolsdetails1415 --tabs --insert "ccd_sch_029_1415_w_0216601a.txt"