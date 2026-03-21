import { NextResponse } from "next/server";
import { Builder, By, until } from "selenium-webdriver";
import fs from "fs";

export async function GET() {
    /*
    does the user's browser need to be edge for it to work?
    */
    let driver = await new Builder().forBrowser("MicrosoftEdge").build();
    try{
        await driver.get("https://uwaterloo.ca/sustainability/events");
        
        // Wait for elements to load
        await driver.wait(until.elementLocated(By.css(".card__title a")), 10000);
        await driver.wait(until.elementLocated(By.css(".uw-date")), 10000);
        await driver.wait(until.elementLocated(By.css(".card__content p")), 10000);
        
        // Get all event elements by css
        let titles = await driver.findElements(By.css(".card__title a"));
        let contents = await driver.findElements(By.css(".card__content p"));
        let dates = await driver.findElements(By.css(".uw-date"));

        let data = [];

        for (let i = 0; i < titles.length; i++) {
            // Getting text from each element
            let title = await titles[i].getText();
            let dateText = await dates[i].getText();
            let contentText = await contents[i].getText();

            // Only adding the location if it contains "SLC Marketplace"
            let location = contentText.includes("SLC Marketplace") ? "SLC Marketplace" : "";
            
            // Splitting date and time
            let match = dateText.match(/^(.*\d{4})\s+(\d{1,2}:\d{2}\s*[APMapm]{2})\s*-\s*(\d{1,2}:\d{2}\s*[APMapm]{2})(?:.*)$/);

      let datePart, startTime, endTime;
      if (match) {
        datePart = match[1].trim();
        startTime = match[2].trim();
        endTime = match[3].trim();
      } else {
        datePart = dateText;
        startTime = "";
        endTime = "";
      }

      let information = {
        name: title,
        location,
        date: datePart,
        startTime,
        endTime,
        content: contentText,
      };

      data.push(information);
    }

    // Save JSON to project root (optional)
    fs.writeFileSync("output.json", JSON.stringify(data, null, 2));

    return NextResponse.json(data);

  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  } finally {
    await driver.quit();
  }
}
