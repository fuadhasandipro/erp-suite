<div align="center">
  <img src="https://img.icons8.com/color/96/000000/flow-chart.png" alt="Logo" width="80" height="80">

  <h1 align="center">ERP Suite - Modern Invoice Builder</h1>

  <p align="center">
    A meticulously crafted, responsive Enterprise Resource Planning (ERP) component built with Next.js and Tailwind CSS. Featuring dynamic Data Table generation, seamless print rendering, and a state-of-the-art Dnd-Kit powered interface.
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

<!-- Badges -->
<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</div>

<br />

## ✨ Features

- **Dynamic Invoice Builder:** An extremely flexible, modern interface to generate customized professional invoices on the fly.
- **Fluid Drag & Drop Arrays:** Built to seamlessly support column reordering with `@dnd-kit`. Reorganize invoice table parameters natively on both Desktop and Mobile devices without visual glitches or text distortion.
- **Responsive "Card" Layout:** Completely avoids horizontal, cramped scrolling on smartphones. Data grids eloquently transform into responsive, stacked mobile cards for effortless entry.
- **Isolated Print Engine:** Employs an under-the-hood invisible rendering template. Modifying content structurally binds to a clean print replica, ensuring downloaded PDFs look incredibly professional without UI-clutter. 
- **Global Data Persistence:** Leverages robust App Context to maintain global schema states cross-app effortlessly.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Draggable Contexts:** [@dnd-kit](https://dndkit.com/)
- **Language:** TypeScript 

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need Node.js (v18+) and your preferred package manager installed.
```bash
npm install npm@latest -g
```

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/your_username/erp-suite.git
   ```
2. Navigate to the directory
   ```bash
   cd erp-suite
   ```
3. Install NPM packages
   ```bash
   npm install
   # or
   pnpm install
   ```
4. Start the development server
   ```bash
   npm run dev
   ```
   
> **Note:** The application will run smoothly at `http://localhost:3000`.

## 📁 Project Architecture

- `/app` - Houses the core Next.js routing mechanics, generic layout, and root globals.
- `/components` - Contains the modular React elements (Topbar, Sidebar, interactive Invoice Builder engine).
- `/context` - Exposes the Global Application State orchestrator driving complex interactions between components.
- `/types` - Maintains standard TypeScript definitions securely across the application.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
