<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">MAAWF.me</h3>

  <p align="center">
    An awesome light weight e2e encrypted messaging app
    <br />
    <a href="https://github.com/Dopeamin/project_angular_backend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://maawf.me/register">View Demo</a>
    ·
    <a href="https://github.com/Dopeamin/project_angular_backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/Dopeamin/project_angular_backend/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#deploying">Deploying</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![MAAWF Screen Shot][product-screenshot]](https://maawf.me)

This is our lightweight message web app. offers the typical chatting app features like group chat and networking features


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This project is built mainly using NestJs, Mysql, Typeorm

- [![NestJs][nest.js]][nestjs-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

First make sure you have npm and node installed

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install NPM packages
- npm
   ```sh
   npm install
   ```
- yarn
   ```sh
   yarn
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Start development server
- npm
   ```sh
   npm run start:dev
   ```
- yarn
   ```sh
   yarn run start:dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Deploying -->

## Deploying
To automatically run the deployment from dev all the way to production, you can use the following command:
- bash
```sh
   git checkout dev && git pull && git push && git checkout test && git merge dev && git push && git checkout prod && git merge test && git push && git checkout dev
```

<!-- ROADMAP -->

## Roadmap

- [x] Add Authentication Module
- [x] Add Secure Messaging Module
- [x] Add Friendship and Friends Module
- [x] Add Group chats
- [ ] Add User Profile (in works)
- [x] Add User Feed (homepage)

See the [open issues](https://github.com/Dopeamin/project_angular_backend/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

- [Img Shields](https://shields.io)
- [GitHub Pages](https://pages.github.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Dopeamin/project_angular_backend.svg?style=for-the-badge
[contributors-url]: https://github.com/Dopeamin/project_angular_backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Dopeamin/project_angular_backend.svg?style=for-the-badge
[forks-url]: https://github.com/Dopeamin/project_angular_backend/network/members
[stars-shield]: https://img.shields.io/github/stars/Dopeamin/project_angular_backend.svg?style=for-the-badge
[stars-url]: https://github.com/Dopeamin/project_angular_backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/Dopeamin/project_angular_backend.svg?style=for-the-badge
[issues-url]: https://github.com/Dopeamin/project_angular_backend/issues
[license-shield]: https://img.shields.io/github/license/Dopeamin/project_angular_backend.svg?style=for-the-badge
[license-url]: https://github.com/Dopeamin/project_angular_backend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: https://i.ibb.co/8x3yHtH/Screenshot-2023-01-17-at-12-49-03.png
[next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[vue-url]: https://vuejs.org/
[angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[angular-url]: https://angular.io/
[svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[svelte-url]: https://svelte.dev/
[laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[laravel-url]: https://laravel.com
[laravel.com]: https://img.shields.io/badge/Nestjs-FF2D20?style=for-the-badge&logo=nestjs&logoColor=white
[laravel-url]: https://nestjs.com
[tailwind.com]: https://img.shields.io/badge/tailwind-563D7C?style=for-the-badge&logo=tailwind&logoColor=white
[tailwind-url]: https://tailwind.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
