<a href="https://badget-eight-gilt.vercel.app/">
  <h1 align="center">Badget: Revolutionizing Financial Management</h1>
</a>

 <img width="1440" alt="dashboard_mockup" src="https://github.com/projectx-codehagen/Badget/assets/24507211/2c2b8e43-3d18-4b28-b8d0-5dc0cbdb530f">

<p align="center">
  Empower your financial management with Badget - AI-driven insights at your fingertips. Optimize your finances effortlessly.
</p>

<p align="center">
  <!-- <a href="https://twitter.com/placeholder">
    <img src="https://img.shields.io/twitter/follow/badget?style=flat&label=%40badgety&logo=twitter&color=0bf&logoColor=fff" alt="Twitter" />
  </a> -->
  <a href="https://github.com/projectx-codehagen/Badget/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/projectx-codehagen/Badget?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#tech-stack--features"><strong>Tech Stack + Features</strong></a> ·
  <a href="#contributing"><strong>Credits</strong></a>
</p>
<br/>

## Introduction

Welcome to Badget, where we're ushering in a new era of financial management. Leveraging cutting-edge AI, Badget redefines how you track, analyze, and optimize your finances, ensuring smarter, more secure financial decisions.

With Badget, gain unparalleled insights into your spending habits and financial patterns, empowering you to budget better and experience more. Trusted by the world's most innovative companies, Badget is here to revolutionize your financial management experience.

## What we are using

Lets goooo - Next.js 14, Turborepo, Prisma, Neon, Next.auth, Resend, React Email, Shadcn/ui, and Stripe.
<br/>
All seamlessly integrated with the Badget to accelerate the development.

## Directory Structure

Badget is a monorepo managed by [Turborepo](https://turbo.build/repo). The monorepo is split between `apps` and `packages` directories.

    .
    ├── apps                         # Its app workspace which contains
    │    ├── www                     # Nextjs app which is deployed in Vercel
    │    ├── api                     # Hono app that is our REST-api for our SDK
    │    └── ...
    ├── packages                     # are the shared packages that are used by the apps 
    │    ├── db                      # Prisma DB connector
    │    └── ui                      # Shared UI components (Shadcn)
    ├── tooling                      # are the shared configuration that are used by the apps and packages
    │    ├── eslint                  # Shared eslint presets
    │    ├── prettier                # Shared prettier configuration
    │    ├── tailwind                # Shared tailwind configuration
    │    └── typescript              # Shared tsconfig you can extend from
    ├── LICENSE
    └── README.md

## Installation

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/projectx-codehagen/Badget
```

1. Install dependencies using pnpm:

```bash
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```bash
cp .env.example .env.local
```

4. Input everything you need for the env.

   1. Create [Neon Database](https://neon.tech/) Account
   2. Create [Clerk](https://clerk.dev) Account

5. Start the development server from either yarn or turbo:

```bash
# To start the server
pnpm dev

## Tech Stack + Features

### Frameworks

- [Next.js](https://nextjs.org/) – React framework for building performant apps with the best developer experience
- [Clerk](https://clerk.com/) – Handle user authentication with ease with providers like Google, Twitter, GitHub
- [Prisma](https://www.prisma.io/) – Typescript-first ORM for Node.js
- [React Email](https://react.email/) – Versatile email framework for efficient and flexible email development

### Platforms

- [Vercel](https://vercel.com/) – Easily preview & deploy changes with git
- [Neon](https://neon.tech/) – A cutting-edge database platform for seamless, scalable data management
- [Resend](https://resend.com/) – A powerful email framework for streamlined email development

### UI

- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development
- [Shadcn/ui](https://ui.shadcn.com/) – Re-usable components built using Radix UI and Tailwind CSS
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Lucide](https://lucide.dev/) – Beautifully simple, pixel-perfect icons
- [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) – Optimize custom fonts and remove external network requests for improved performance
- [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) – Generate dynamic Open Graph images at the edge

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/projectx-codehagen/badget/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/projectx-codehagen/badget/pull) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/projectx-codehagen/badget/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=projectx-codehagen/badget" />
</a>

## Repo Activity

![Nextify repo activity – generated by Axiom](https://repobeats.axiom.co/api/embed/f90bd65d98d57ce8fc8bbf36079da64f0c5c8764.svg "Repobeats analytics image")