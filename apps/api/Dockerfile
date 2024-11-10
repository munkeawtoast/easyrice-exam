FROM public.ecr.aws/lambda/nodejs:20
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY dist/apps/api ${LAMBDA_TASK_ROOT}
WORKDIR ${LAMBDA_TASK_ROOT}
EXPOSE 8080

RUN pnpm i --frozen-lockfile

CMD ["index.lambdaHandler"]
