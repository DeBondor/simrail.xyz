# SimRail XYZ

A set of free, open-source tools for the SimRail community, built with Next.js.

![SimRail XYZ screenshot](screens/screen.png)

## Features

### Route Generator

Generate aesthetic train route boards for SimRail with:

- **Train categories** — EIP (Pendolino), IC (InterCity), TLK, Regio, and more
- **Custom categories** — define your own name and color palette
- **Intermediate stations** — add, reorder (drag & drop), and toggle bold
- **Segment styles** — solid, dashed, or mixed line styles between stations
- **XML import** — import routes directly from SimRail timetable `.xml` files
- **Advanced settings** — fine-tune shape sizes, track position, station gap, and more
- **PNG export** — download the generated route board as a high-quality PNG image
- **Live canvas preview** — see changes in real time

### Live Map *(Soon)*

Track train positions in real time on an interactive map of SimRail servers.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/DeBondor/simrail.xyz.git
cd simrail.xyz

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## License

This project is unofficial and not affiliated with SimRail. All content is provided under the [GPL-3.0 License](LICENSE).
