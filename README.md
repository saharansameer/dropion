# Dropion

**Dropion** is a web-based platform for uploading, storing, and sharing files — with support for folders, nested structure, and shareable links. Upload images, videos, PDFs, or text files, organize them in folders, and access them anytime via direct links. Built as a learning project to explore full-stack development and cloud file handling.

---

## Tech Stack

- **Next.js** – Full-stack React framework for SSR and routing
- **PostgreSQL** – Relational database for storing file and folder metadata
- **Drizzle** – Type-safe SQL ORM for PostgreSQL
- **Neon** – Serverless Postgres hosting 
- **ImageKit** – File storage, CDN delivery, and optimization
- **Redis** – Caching and Rate Limiting
- **Tailwind CSS** – Utility-first CSS framework for UI styling
- **shadcn/ui** – Prebuilt UI components built on top of Radix and Tailwind
- **TypeScript** - Typed superset of JavaScript used across the app
- **Clerk** – User authentication and session management

---

## Features

- **File Uploads:** Upload images, videos, PDFs, and TXT files.
- **Folder Support:** Create folders and organize your files, with support for nested folders.
- **Rename Files & Folders:** Easily rename both individual files and folders.
- **Starred Items:** Mark important files or folders as starred for quick access.
- **Trash System:** Move files or folders to trash and restore or permanently delete them.
- **Shareable Links:** Generate direct links to share your uploaded files.
- **Responsive UI:** Clean and accessible interface built with Tailwind CSS.

---

## Architecture Notes

- **Database:** PostgreSQL (via Neon) handles all user, file, folder, and trash metadata with Drizzle as ORM.
- **File Storage & CDN:** All files are uploaded and served through **ImageKit**, enabling fast delivery and transformation.
- **Folder Structure:** Folder nesting is implemented using a parent-child relationship model in the database.
- **Link Sharing:** File links are generated using ImageKit URLs, allowing for secure, fast access.
- **Authentication:** Handled with Clerk for login, signup, and session management.
- **Rate Limiting & Caching:** Implemented using Upstash-Redis to control API usage and cache frequent queries.
- **UI & Styling:** Tailwind CSS and shadcn/ui power the layout, design system, and component structure.
- **Deployment:** Hosted on Vercel with edge-optimized middleware and smart caching strategies.

---

## Deployment

Deployed at [`dropion.sameersaharan.com`](https://dropion.sameersaharan.com)  
Built by [Sameer Saharan](https://sameersaharan.com) 

