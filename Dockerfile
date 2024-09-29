FROM public.ecr.aws/lambda/nodejs:20

COPY ./src/app.js ${LAMBDA_TASK_ROOT}

CMD [ "app.handler" ]
