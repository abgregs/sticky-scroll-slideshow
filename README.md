# Sticky Scroll Slideshow Demo

This is a demo of a scroll-based animation using a combination of sticky elements as well as elements in the normal doc flow that animate. Scroll progress is used to track the active section to determine the animations. The overall effect is similar to something I've seen popularized from time to time, where once a use begins scrolling some particular content, sticky elements off to one side animate in and out to provide additional context or visual interest.

This demo uses Framer Motion for animations and Next.js for the project setup for demo purposes, but the code (aside from Next's `Image` component) can be dropped in a React client component as a starting point.

If you find it useful, throw it a star or give me a shout [@abgregs](https://twitter.com/abgregs) on Twitter.

## Demo

[https://sticky-scroll-slideshow.vercel.app/](https://sticky-scroll-slideshow.vercel.app/)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
