# Social App Template

The Social Application Template (SAT) is an example client app that demonstrates how to use [Gateway Services](https://github.com/ProjectLibertyLabs/gateway) for integrating with [Frequency](https://github.com/frequency-chain/frequency) and [DSNP](https://dsnp.org/).

<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
- [🔍 Arch Map](#-arch-maps)
- [🛠 Built With](#built-with)
  - [Tech Stack](#tech-stack)
  - [Key Features](#key-features)
- [💻 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Quick Start](#quick-start)
  - [Deployment](#deployment)
- [🚀 Live OpenAPI Docs](#-live-docs)
- [🤝 Contributing](#-contributing)
- [❓FAQ](#faq)
- [📝 License](#-license)

The Social Application Template (SAT) is an example client app that demonstrates how to use [Gateway Services](https://github.com/ProjectLibertyLabs/gateway).

# 📖 Social Application Template (SAT) <a name="about-project"></a>

The [Gateway Services](https://github.com/ProjectLibertyLabs/gateway) are a suite of services designed to make interacting with [Frequency](https://github.com/frequency-chain/frequency) easy for applications integrating with [DSNP](https://dsnp.org/).
The SAT is an example client that shows you how to use Gateway.

Gateway enables web2 companies to use a simple gateway into web3 using tooling they are accustomed to. It aims to let service providers self-serve with minimal help outside of docs and tools, rather than
interacting with Frequency directly. Providers no longer need to fully understand blockchain tooling to build on DSNP over Frequency.

<!-- Mermaid Arch maps -->

## 🔭 Arch Maps

### Overview of the Social App Template in relation to Gateway Services

![Arch Map](./docs/social_app_template_arch.drawio.png)

Key: * = coming soon

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

**Tech Stack Overview:**
This project uses a modern JavaScript/TypeScript stack with React for the frontend and Node.js/Express for the backend. It integrates with Gateway Services to provide a seamless connection to the Frequency blockchain and DSNP protocols without requiring deep Web3 knowledge.

<details>
  <summary>Frontend</summary>
  <ul>
    <li>Framework: <a href="https://react.dev/">React</a> - A JavaScript library for building user interfaces</li>
    <li>Language: <a href="https://www.typescriptlang.org/">TypeScript</a> - Adds static typing to JavaScript</li>
    <li>State Management: React Context API and custom hooks</li>
    <li>Testing Library:
      <ul>
        <li><a href="https://jestjs.io/">Jest</a> - JavaScript testing framework</li>
        <li><a href="https://testing-library.com/">Testing Library</a> - Simple and complete testing utilities</li>
      </ul>
    </li>
    <li>UI Library: <a href="https://ant.design/">Ant Design</a> - A design system for enterprise-level products</li>
    <li>Build Tool: Vite - Next generation frontend tooling</li>
  </ul>
</details>

<details>
<summary>Backend</summary>
  <ul>
    <li>Framework: <a href="https://nodejs.org/">Node.js</a> with <a href="https://expressjs.com/">Express</a> - Fast, unopinionated, minimalist web framework</li>
    <li>Language: <a href="https://www.typescriptlang.org/">TypeScript</a> - Strongly typed programming language</li>
    <li>Testing Library: <a href="https://vitest.dev/">Vitest</a> - Blazing fast unit test framework</li>
    <li>API Documentation:
      <ul>
        <li><a href="https://swagger.io/">Swagger</a> - API development tools</li>
        <li><a href="https://learn.openapis.org/">OpenAPI</a> - API description format</li>
      </ul>
    </li>
    <li>Gateway Integration: Integration with Gateway Services for DSNP/Frequency functionality</li>
    <li>Containerization: Docker for consistent development and deployment environments</li>
  </ul>
</details>

<!-- Features -->

### Key Features

- **[Sign in with Frequency](https://github.com/ProjectLibertyLabs/siwf)**
- **Create a post**
- **Create a comment on a post**
- **View a feed**
- **View other users' profiles**
- **Follow a user**

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- LIVE Docs -->

## 🚀 Live Docs

- [Gateway Live Docs](https://ProjectLibertyLabs.github.io/gateway/)
- Open Api docs coming soon...

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started

- ### Frontend

  See [Frontend Readme](./frontend/README.md)

- ### Backend

  See [Backend Readme](./backend/README.md)

### Prerequisites

In order to run this project on anything other than a local chain, you need to...

- Become a provider. To do so, visit the [Provider Dashboard](https://provider.frequency.xyz/)!
  - **Note**: If you're using localhost for the Frequency provider, you can complete this step after the installation process.
- [Get Docker](https://docs.docker.com/get-docker/)

### Setup

Clone this repository to your desired folder:

Example commands:

```sh
  git clone https://github.com/ProjectLibertyLabs/social-app-template.git
  cd social-app-template
```

### Quick Start

Enter the following command and answer the prompts. Press <ENTER> to accept the default values.

```sh
  ./start.sh
```

#### Note: When connecting to a local Frequency node, you will need to execute `cd backend && npm install` to install the necessary dependencies. See the [Backend Readme](./backend/README.md) for more details.

### Shutting Down

Enter the following command to stop the services:

```sh
  ./stop.sh
```

### Deployment

You can deploy using containers. Check the [docker-compose.yaml](docker-compose.yaml) file for more details.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Open Issues](https://github.com/ProjectLibertyLabs/social-app-template/issues) - Please search open issues before filing a new one.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- FAQ (optional) -->

## ❓FAQ

- **Who is the Gateway built for?**

- Developers wanting a better understanding of how DSNP/Frequency works.
- Developers wanting an example of integrating Gateway Services.

- **Who is a provider and how do you become one?**

  - Visit the [Provider Dashboard](https://provider.frequency.xyz/)!

- **Do I need Web 3 experience?**

  - Nope! The Gateway is an open source suite that enables Frequency integrations without web3 programming skills. The Gateway makes building/integrating a social network on the DSNP/Frequency stack as easy as a Web2 API integration.

- **Do I need to know anything about cryptocurrency?**

  - Nope! The Gateway has a coinless user interface that does not require using cryptocurrency tokens.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>

<!-- LICENSE -->

## 📝 License

This project is [Apache 2.0](./LICENSE) licensed.

<p align="right">(<a href="#-table-of-contents">back to top</a>)</p>
