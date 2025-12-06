# Documentation

This folder centralizes everything related to operating and extending the
full-stack developer portfolio. Start with the overview below and dive into the
linked guides when you need more depth.

## Contents

- [`architecture.md`](architecture.md) – System diagram, module layout, and data
  flow between the Next.js frontend, the Express API, and MongoDB.
- [`development.md`](development.md) – Environment variables, workspace
  commands, and tips for running or testing each app locally.
- [`deployment/aws.md`](deployment/aws.md) – Step-by-step AWS workflow covering
  Elastic Beanstalk, Amplify, Route 53, and ACM.

## Directory map

```
docs/
├── README.md
├── architecture.md
├── development.md
└── deployment/
    └── aws.md
```

When adding new knowledge (e.g. runbooks, Terraform notes, or SLA details),
prefer creating another document in this folder so the root of the repository
stays focused on source code.
