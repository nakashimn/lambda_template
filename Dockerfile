FROM public.ecr.aws/lambda/nodejs:20 as prod

COPY ./src/app.js ${LAMBDA_TASK_ROOT}

CMD [ "app.handler" ]
