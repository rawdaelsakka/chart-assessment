This is a [Next.js](https://nextjs.org/) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start checking the main page directly @[http://localhost:3000](http://localhost:3000) and corresponding code @`pages/index.js`.
The page auto-updates as you edit the file.

The view will look like this screenshot, you'll select a country and a camps to start loading the corresponding data related to the schools.
[alt text](https://github.com/rawdaelsakka/chart-assessment/public/1.png?raw=true)

Upon selection the view chart will be loaded like the following screen.
[alt text](https://github.com/rawdaelsakka/chart-assessment/public/2.png?raw=true)
## Learn more
1. Loading the raw data from the server from [https://raw.githubusercontent.com/abdelrhman-arnos/analysis-fe-challenge/master/data.json](https://raw.githubusercontent.com/abdelrhman-arnos/analysis-fe-challenge/master/data.json)
2. The user will see 3 drop-down lists at the top should filter the data. When the user selects the country and camp the schools dropdown will be loaded with data.
3. A chart renders the data of the selected schools similar to the image above.
4. On the right of the screen, the total number of lessons is displayed for the selected Camp, School, and Country, followed by a list of the schools with how many lessons each offers.
5. The user can click on the school from the schools list **point 4**.
6. Upon clicking on a point in the chart from **point 5**, the app will navigate to another page where all the details of that item are shown like country, camp, school, month, total of lessons and detailed view of lessons per each month.
7. After coming back from the details page implemented in **point 6**, the last filtering state should be preserved.
