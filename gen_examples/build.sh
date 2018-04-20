#!/bin/bash
grao generate:bundle --schemas Person --force
grao generate:bundle --schemas Customer,Customersituation --force
grao generate:bundle --schemas Sale,Saletype --force
grao generate:bundle --schemas Service,Servicecategory,Servicepropertie --force

