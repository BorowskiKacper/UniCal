<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://github.com/BorowskiKacper/UniCal"><img src="images/logo.svg" alt="Logo" width="160" height="160"></a>
  <h3 align="center">UniCal</h3>

  <p align="center">
    An automation tool to quickly add your university course schedule to your Google Calendar.
    <br />
    <br />
    <a href="https://collegetocalendar.com">Use UniCal</a>
    ·
    <a href="https://github.com/BorowskiKacper/UniCal/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/BorowskiKacper/UniCal/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
<summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

Manually entering your entire university schedule into a digital calendar is tedious and boring. UniCal solves this problem by using AI to automatically convert unstructured schedule text and images into structured calendar events.

Students can simply paste their schedule as text or upload a screenshot, and UniCal generates an interactive weekly calendar view. From there, the schedule can be easily exported to Google Calendar or downloaded as an ICS file for use with other calendar applications.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- [![UniCal Product Screenshot][product-screenshot]](https://collegetocalendar.com) -->

### Built With

* [![React][React.js]][React-url]
* [![Express.js][Express.js]][Express-url]
* [![Node.js][Node.js]][Node-url]
* [![OpenAI API][OpenAI-shield]][OpenAI-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have `npm` installed on your machine.
* npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Get API Keys:** You will need an API key from [OpenAI](https://platform.openai.com/account/api-keys) to run the backend processing.
2.  **Clone the repo:**
    ```sh
    git clone [https://github.com/BorowskiKacper/UniCal.git](https://github.com/BorowskiKacper/UniCal.git)
    cd UniCal
    ```
3.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```
4.  **Add API Key to Backend:** Create a `.env` file in the `backend` directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY='YOUR_API_KEY'
    ```
5.  **Run the Backend Server:** From the `backend` directory:
    ```sh
    npm start
    ```
6.  **Install Frontend Dependencies:** Open a new terminal window and navigate to the `frontend` directory:
    ```sh
    cd frontend
    npm install
    ```
7.  **Run the Frontend App:** From the `frontend` directory:
    ```sh
    npm start
    ```
    Your application should now be running locally at `http://localhost:3000`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

1.  Navigate to the web interface.
2.  Either paste your schedule text directly into the text box or use the upload button to select a screenshot of your schedule.
3.  Click "Generate" and watch as the AI populates the weekly calendar with your courses.
4.  Review the generated events.
5.  Use the "Export to Google Calendar" or "Download ICS" buttons to add the schedule to your personal calendar.

<!-- _For more examples, please refer to the [Documentation](https://github.com/BorowskiKacper/UniCal)_ -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ## Contact
Kacper Borowski - [@YourTwitterHandle](https://twitter.com/YourTwitterHandle) - your.email@example.com 

Project Link: [https://github.com/BorowskiKacper/UniCal](https://github.com/BorowskiKacper/UniCal)

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [React Icons](https://react-icons.github.io/react-icons/search)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/BorowskiKacper/UniCal.svg?style=for-the-badge
[contributors-url]: https://github.com/BorowskiKacper/UniCal/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/BorowskiKacper/UniCal.svg?style=for-the-badge
[forks-url]: https://github.com/BorowskiKacper/UniCal/network/members
[stars-shield]: https://img.shields.io/github/stars/BorowskiKacper/UniCal.svg?style=for-the-badge
[stars-url]: https://github.com/BorowskiKacper/UniCal/stargazers
[issues-shield]: https://img.shields.io/github/issues/BorowskiKacper/UniCal.svg?style=for-the-badge
[issues-url]: https://github.com/BorowskiKacper/UniCal/issues
[license-shield]: https://img.shields.io/github/license/BorowskiKacper/UniCal.svg?style=for-the-badge
[license-url]: https://github.com/BorowskiKacper/UniCal/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/kacper-borowski-677206229/
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[OpenAI-shield]: https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white
[OpenAI-url]: https://openai.com/
