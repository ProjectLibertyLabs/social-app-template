#!/bin/sh

ENV_TEMPLATES=$( ls environment/*.template )

for template in ${ENV_TEMPLATES}
do
    env_file=.$( basename ${template} .template )
    service=${env_file##.env.}
    cp -n ${template} ${env_file}
done
