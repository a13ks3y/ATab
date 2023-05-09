const { getBookmarks, removeImageFromTitle } = require("./getBookmarks.js");

describe('Test getBookmarks function', () => {
    // @todo: Move it to separate file?
    // @todo: Make it shorter. 
    // @todo: You don't need all bookmarks for test purposes.
    const bookmarksTree = [
        {
            "children": [
                {
                    "children": [
                        {
                            "dateAdded": 1392218133498,
                            "id": "17",
                            "index": 0,
                            "parentId": "1",
                            "title": "",
                            "url": "chrome://extensions/"
                        },
                        {
                            "children": [
                                {
                                    "dateAdded": 1625304765101,
                                    "id": "23",
                                    "index": 0,
                                    "parentId": "22",
                                    "title": "Jarvis",
                                    "url": "http://localhost:3000/jarvis/#/youtube"
                                },
                                {
                                    "dateAdded": 1625304765102,
                                    "id": "24",
                                    "index": 1,
                                    "parentId": "22",
                                    "title": "User Data Directory",
                                    "url": "https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/user_data_dir.md"
                                },
                                {
                                    "dateAdded": 1625304765102,
                                    "id": "25",
                                    "index": 2,
                                    "parentId": "22",
                                    "title": "puppeteer attach to existing chrome - Google Search",
                                    "url": "https://www.google.com/search?q=puppeteer+attach+to+existing+chrome&oq=puppeteer+attach+to+existing+chrome&aqs=chrome.0.69i59j0i22i30.78418j0j1&sourceid=chrome&ie=UTF-8"
                                },
                                {
                                    "dateAdded": 1625304765102,
                                    "id": "26",
                                    "index": 3,
                                    "parentId": "22",
                                    "title": "Puppeteer-web: Protocol error (Target: getBrowserContexts) not allowed - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/57572062/puppeteer-web-protocol-error-target-getbrowsercontexts-not-allowed"
                                },
                                {
                                    "dateAdded": 1625304765102,
                                    "id": "27",
                                    "index": 4,
                                    "parentId": "22",
                                    "title": "I would like to use puppeteer with my current chrome (keeping my credentials) · Issue #3543 · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/issues/3543"
                                },
                                {
                                    "dateAdded": 1625304765102,
                                    "id": "28",
                                    "index": 5,
                                    "parentId": "22",
                                    "title": "127.0.0.1",
                                    "url": "http://127.0.0.1:9222/json/version"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "29",
                                    "index": 6,
                                    "parentId": "22",
                                    "title": "puppeteer/puppeteer: Headless Chrome Node.js API",
                                    "url": "https://github.com/puppeteer/puppeteer"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "30",
                                    "index": 7,
                                    "parentId": "22",
                                    "title": "puppeteer/examples at main · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/tree/main/examples/"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "31",
                                    "index": 8,
                                    "parentId": "22",
                                    "title": "transitive-bullshit/awesome-puppeteer: A curated list of awesome puppeteer resources.",
                                    "url": "https://github.com/transitive-bullshit/awesome-puppeteer"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "32",
                                    "index": 9,
                                    "parentId": "22",
                                    "title": "puppeteer/api.md at v10.1.0 · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/blob/v10.1.0/docs/api.md"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "33",
                                    "index": 10,
                                    "parentId": "22",
                                    "title": "How can i disable puppeteer dev profile. · Issue #1791 · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/issues/1791"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "34",
                                    "index": 11,
                                    "parentId": "22",
                                    "title": "Work on predefined profile · Issue #866 · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/issues/866"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "35",
                                    "index": 12,
                                    "parentId": "22",
                                    "title": "node.js - set browser profile settings via puppeteer - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/62790413/set-browser-profile-settings-via-puppeteer"
                                },
                                {
                                    "dateAdded": 1625304765103,
                                    "id": "36",
                                    "index": 13,
                                    "parentId": "22",
                                    "title": "automated tests - How to use chrome profile in puppeteer - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/53236692/how-to-use-chrome-profile-in-puppeteer"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "37",
                                    "index": 14,
                                    "parentId": "22",
                                    "title": "javascript - Puppeter not using the specified chrome-profile - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/62488121/puppeter-not-using-the-specified-chrome-profile"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "38",
                                    "index": 15,
                                    "parentId": "22",
                                    "title": "google chrome - Make Puppeteer use local profile's cookies - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/51865092/make-puppeteer-use-local-profiles-cookies"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "39",
                                    "index": 16,
                                    "parentId": "22",
                                    "title": "javascript - In Puppeteer how to switch to chrome window from default profile to desired profile - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/57623828/in-puppeteer-how-to-switch-to-chrome-window-from-default-profile-to-desired-prof"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "40",
                                    "index": 17,
                                    "parentId": "22",
                                    "title": "how to tell puppeteer not create profile site:stackoverflow.com - Google Search",
                                    "url": "https://www.google.com/search?q=how+to+tell+puppeteer+not+create+profile+site:stackoverflow.com&sxsrf=ALeKk02ySacfspOCgQaWw1Gqaarv4KZQyQ:1625302054966&sa=X&ved=2ahUKEwiFpo39wcbxAhVOhP0HHQsfAnwQrQIoBHoECAgQBQ&biw=1920&bih=937"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "41",
                                    "index": 18,
                                    "parentId": "22",
                                    "title": "about:blank",
                                    "url": "about:blank"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "42",
                                    "index": 19,
                                    "parentId": "22",
                                    "title": "puppeteer/troubleshooting.md at main · puppeteer/puppeteer",
                                    "url": "https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "43",
                                    "index": 20,
                                    "parentId": "22",
                                    "title": "javascript - Puppeteer \"Unable to move ShaderCache\" when attempting to load Chrome profile - Stack Overflow",
                                    "url": "https://stackoverflow.com/questions/55276368/puppeteer-unable-to-move-shadercache-when-attempting-to-load-chrome-profile"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "44",
                                    "index": 21,
                                    "parentId": "22",
                                    "title": "Сведения о версии",
                                    "url": "chrome://version/"
                                },
                                {
                                    "dateAdded": 1625304765104,
                                    "id": "45",
                                    "index": 22,
                                    "parentId": "22",
                                    "title": "A list of useful Google Chrome command line switches - gHacks Tech News",
                                    "url": "https://www.ghacks.net/2013/10/06/list-useful-google-chrome-command-line-switches/"
                                },
                                {
                                    "dateAdded": 1625304765105,
                                    "id": "46",
                                    "index": 23,
                                    "parentId": "22",
                                    "title": "List of Chromium Command Line Switches « Peter Beverloo",
                                    "url": "https://peter.sh/experiments/chromium-command-line-switches/#load-extension"
                                }
                            ],
                            "dateAdded": 1625304765100,
                            "dateGroupModified": 1625304765105,
                            "id": "22",
                            "index": 5,
                            "parentId": "1",
                            "title": "📺"
                        },
                        {
                            "children": [
                                {
                                    "dateAdded": 1572467240284,
                                    "id": "374",
                                    "index": 0,
                                    "parentId": "373",
                                    "title": "Let's Play - Core War",
                                    "url": "http://crypto.stanford.edu/~blynn/play/redcode.html"
                                },
                                {
                                    "dateAdded": 1572465121292,
                                    "id": "375",
                                    "index": 1,
                                    "parentId": "373",
                                    "title": "Coding \"Snake\" in 4 min 30 sec (plain browser JavaScript) - YouTube",
                                    "url": "https://www.youtube.com/watch?v=xGmXxpIj6vs"
                                },
                                {
                                    "dateAdded": 1575310111103,
                                    "id": "376",
                                    "index": 2,
                                    "parentId": "373",
                                    "title": "Gameplay & Random Map! - A Week of Game Development in Unity #11 - YouTube",
                                    "url": "https://www.youtube.com/watch?v=C5mp4WtjJtk"
                                },
                                {
                                    "dateAdded": 1578170398268,
                                    "id": "377",
                                    "index": 3,
                                    "parentId": "373",
                                    "title": "Any over 998,001 and its Mysterious Recurring Decimals - Numberphile - YouTube",
                                    "url": "https://www.youtube.com/watch?v=daro6K6mym8"
                                },
                                {
                                    "dateAdded": 1578570528635,
                                    "id": "378",
                                    "index": 4,
                                    "parentId": "373",
                                    "title": "hbam2011-09.pdf",
                                    "url": "https://preprint.math.uni-hamburg.de/public/papers/hbam/hbam2011-09.pdf"
                                },
                                {
                                    "dateAdded": 1579034070092,
                                    "id": "379",
                                    "index": 5,
                                    "parentId": "373",
                                    "title": "Метод неопределенных коэффициентов - YouTube",
                                    "url": "https://www.youtube.com/watch?v=A7shQ2gf7ho"
                                },
                                {
                                    "dateAdded": 1580556135840,
                                    "id": "380",
                                    "index": 6,
                                    "parentId": "373",
                                    "title": "(2) Как найти значения синуса и косинуса, НЕ запоминая! - YouTube",
                                    "url": "https://www.youtube.com/watch?v=73Wwk7lIyW8"
                                },
                                {
                                    "dateAdded": 1580729761392,
                                    "id": "381",
                                    "index": 7,
                                    "parentId": "373",
                                    "title": "Javascript-путешествие с шестью символами / Хабр",
                                    "url": "https://habr.com/ru/post/312172/"
                                },
                                {
                                    "dateAdded": 1580745258488,
                                    "id": "382",
                                    "index": 8,
                                    "parentId": "373",
                                    "title": "Pooping Snake",
                                    "url": "https://a13ks3y.github.io/pooping-snake.html"
                                },
                                {
                                    "dateAdded": 1581292352166,
                                    "id": "383",
                                    "index": 9,
                                    "parentId": "373",
                                    "title": "(2) Guns N' Roses played with guns and roses - YouTube",
                                    "url": "https://www.youtube.com/watch?v=97IdAnG6Av0"
                                },
                                {
                                    "dateAdded": 1582044394223,
                                    "id": "384",
                                    "index": 10,
                                    "parentId": "373",
                                    "title": "JS1k 2011 - Demo 966",
                                    "url": "https://js1k.com/2011-trail/demo/966"
                                },
                                {
                                    "dateAdded": 1589497804461,
                                    "id": "385",
                                    "index": 11,
                                    "parentId": "373",
                                    "title": "ГРИФФИНЫ ЛУЧШИЕ МОМЕНТЫ #16 - YouTube",
                                    "url": "https://www.youtube.com/watch?v=53uRWbdOMgI"
                                },
                                {
                                    "dateAdded": 1591141891964,
                                    "id": "386",
                                    "index": 12,
                                    "parentId": "373",
                                    "title": "29 minutes to 4:20",
                                    "url": "https://zzzen.com/420/"
                                },
                                {
                                    "dateAdded": 1595162871023,
                                    "id": "387",
                                    "index": 13,
                                    "parentId": "373",
                                    "title": "Как я заработал 30$ на ставках на спорт / Habr",
                                    "url": "https://m.habr.com/en/post/511456/"
                                },
                                {
                                    "dateAdded": 1596614199388,
                                    "id": "388",
                                    "index": 14,
                                    "parentId": "373",
                                    "title": "Gource - a software version control visualization tool",
                                    "url": "https://gource.io/"
                                },
                                {
                                    "dateAdded": 1596799492123,
                                    "id": "389",
                                    "index": 15,
                                    "parentId": "373",
                                    "title": "Електронний кабінет",
                                    "url": "https://ez.osvitavsim.org.ua/"
                                },
                                {
                                    "dateAdded": 1596803414904,
                                    "id": "390",
                                    "index": 16,
                                    "parentId": "373",
                                    "title": "ELVSTUP",
                                    "url": "https://cabinet-bak.osvitavsim.org.ua/profile/specialities"
                                },
                                {
                                    "dateAdded": 1597425911491,
                                    "id": "391",
                                    "index": 17,
                                    "parentId": "373",
                                    "title": "Mary Poppins Sings Death Metal - YouTube",
                                    "url": "https://www.youtube.com/watch?v=iU2hy0L5lgg"
                                },
                                {
                                    "dateAdded": 1599738202969,
                                    "id": "392",
                                    "index": 18,
                                    "parentId": "373",
                                    "title": "Amazon.com: PC USB Foot Switch Keyboard Pedal: Computers & Accessories",
                                    "url": "https://www.amazon.com/USB-Foot-Switch-Keyboard-Pedal/dp/B008MU0TBU"
                                },
                                {
                                    "dateAdded": 1602582094088,
                                    "id": "393",
                                    "index": 19,
                                    "parentId": "373",
                                    "title": "midi.city - free online synth instrument",
                                    "url": "https://midi.city/"
                                },
                                {
                                    "dateAdded": 1603220537713,
                                    "id": "394",
                                    "index": 20,
                                    "parentId": "373",
                                    "title": "Scott Hanselman's 2007 Ultimate Developer and Power Users Tool List for Windows - Scott Hanselman's Blog",
                                    "url": "http://www.hanselman.com/blog/scott-hanselmans-2007-ultimate-developer-and-power-users-tool-list-for-windows"
                                },
                                {
                                    "dateAdded": 1603297788629,
                                    "id": "395",
                                    "index": 21,
                                    "parentId": "373",
                                    "title": "How to Hide Desktop Icons on Mac (Multiple Methods) | Beebom",
                                    "url": "https://beebom.com/how-hide-desktop-icons-mac/"
                                },
                                {
                                    "dateAdded": 1603480057361,
                                    "id": "396",
                                    "index": 22,
                                    "parentId": "373",
                                    "title": "Remapping Keys (Keyboard, Mouse and Joystick) | AutoHotkey",
                                    "url": "https://www.autohotkey.com/docs/misc/Remap.htm"
                                },
                                {
                                    "dateAdded": 1604088145742,
                                    "id": "397",
                                    "index": 23,
                                    "parentId": "373",
                                    "title": "Синтезатор: 1 800 грн. - Синтезаторы Киев на Olx",
                                    "url": "https://www.olx.ua/obyavlenie/sintezator-IDJ27uG.html?sd=1#17c91f1734"
                                },
                                {
                                    "dateAdded": 1604088156382,
                                    "id": "398",
                                    "index": 24,
                                    "parentId": "373",
                                    "title": "arenda-prokat-udarnoy-ustanovki-gretsch-catalina-club",
                                    "url": "https://rento.ua/arenda-prokat-udarnoy-ustanovki-gretsch-catalina-club/"
                                },
                                {
                                    "dateAdded": 1604315372537,
                                    "id": "399",
                                    "index": 25,
                                    "parentId": "373",
                                    "title": "Welcome! | Million Song Dataset",
                                    "url": "http://millionsongdataset.com/"
                                },
                                {
                                    "dateAdded": 1602707696864,
                                    "id": "400",
                                    "index": 26,
                                    "parentId": "373",
                                    "title": "Калея закатечичи экстракт купить по лучшей цене | KRATOMAN.COM.UA",
                                    "url": "https://kratoman.com.ua/shop/cratom/kaleya.html"
                                },
                                {
                                    "dateAdded": 1599868313337,
                                    "id": "401",
                                    "index": 27,
                                    "parentId": "373",
                                    "title": "Expanding Brain Meme Generator - Imgflip",
                                    "url": "https://imgflip.com/memegenerator/Expanding-Brain"
                                },
                                {
                                    "dateAdded": 1602869516106,
                                    "id": "402",
                                    "index": 28,
                                    "parentId": "373",
                                    "title": "Чем помыть бонг? - Страница 5 - Девайсы - CannaClub",
                                    "url": "https://club.cannaclub.in.net/forums/topic/3905-chem-pomyt-bong/?page=5"
                                },
                                {
                                    "dateAdded": 1627429182711,
                                    "id": "403",
                                    "index": 29,
                                    "parentId": "373",
                                    "title": "Про изобретения | Растаманские Народные Сказки | Rastaman Folk Tales",
                                    "url": "https://www.rastamantales.com/skazki/content/pro-izobreteniya"
                                },
                                {
                                    "dateAdded": 1627429207091,
                                    "id": "404",
                                    "index": 30,
                                    "parentId": "373",
                                    "title": "Про тараканов | Растаманские Народные Сказки | Rastaman Folk Tales",
                                    "url": "https://www.rastamantales.com/skazki/content/pro-tarakanov"
                                }
                            ],
                            "dateAdded": 1597733639700,
                            "dateGroupModified": 1627429207091,
                            "id": "373",
                            "index": 10,
                            "parentId": "1",
                            "title": "😕"
                        },
                    ],
                    "dateAdded": 1638349026362,
                    "dateGroupModified": 1650913090939,
                    "id": "1",
                    "index": 0,
                    "parentId": "0",
                    "title": "Bookmarks bar"
                },
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "dateAdded": 1624558004991,
                                    "id": "54",
                                    "index": 0,
                                    "parentId": "53",
                                    "title": "Etender / E-Tender · GitLab",
                                    "url": "http://gitlab.e-tender.ua/etender/e-tender"
                                },
                                {
                                    "dateAdded": 1624558004991,
                                    "id": "55",
                                    "index": 1,
                                    "parentId": "53",
                                    "title": "Введение для нового Front-End - Development - Confluence E-Tender",
                                    "url": "http://services.e-tender.biz/confluence/pages/viewpage.action?pageId=11927721"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "56",
                                    "index": 2,
                                    "parentId": "53",
                                    "title": "Slack",
                                    "url": "https://join.slack.com/t/e-tech-co/shared_invite/enQtNzMyNjIxNjM2ODM4LWYzMGU2YjI0YmQwMGRkNTU4Y2M3NDM5NjViZjZlMDgwNTA4NmY1Mjk5ZTZmZmQ5YWU5NmMxMzgxY2U5ZDJjMTY"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "57",
                                    "index": 3,
                                    "parentId": "53",
                                    "title": "EMail",
                                    "url": "https://outlook.office365.com/mail/inbox"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "58",
                                    "index": 4,
                                    "parentId": "53",
                                    "title": "Pass22w0rd123",
                                    "url": "http://pass22w0rd123/"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "59",
                                    "index": 5,
                                    "parentId": "53",
                                    "title": "e-Docs  Pass22w0rd123",
                                    "url": "https://online.e-docs.ua/#!/infoPanel/538"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "60",
                                    "index": 6,
                                    "parentId": "53",
                                    "title": "E-Tender-Notes - Google Docs",
                                    "url": "https://docs.google.com/document/d/1lJcz_aMTPkaF0k6Gsl4P5PE7ck3A_YGr9ZvyuUeh4_w/edit"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "61",
                                    "index": 7,
                                    "parentId": "53",
                                    "title": "Dev2",
                                    "url": "https://dev2.e-tender.ua/"
                                },
                                {
                                    "dateAdded": 1624558004992,
                                    "id": "62",
                                    "index": 8,
                                    "parentId": "53",
                                    "title": "slack",
                                    "url": "https://e-tech-co.slack.com/messages/CLAMKM38U"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "63",
                                    "index": 9,
                                    "parentId": "53",
                                    "title": "Agents > Connected (4) — TeamCity",
                                    "url": "https://tc.e-tender.ua/agents.html"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "64",
                                    "index": 10,
                                    "parentId": "53",
                                    "title": "Projects — TeamCity",
                                    "url": "https://tc.e-tender.ua/"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "65",
                                    "index": 11,
                                    "parentId": "53",
                                    "title": "http://angular.element%28document.body%29.injector%28%29.get%28%27servicename%27%29/",
                                    "url": "chrome://newtab/"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "66",
                                    "index": 12,
                                    "parentId": "53",
                                    "title": "System Dashboard - E-Tender",
                                    "url": "http://services.e-tender.biz/jira/secure/Dashboard.jspa"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "67",
                                    "index": 13,
                                    "parentId": "53",
                                    "title": "My year of refactoring a large scale AngularJS project…",
                                    "url": "https://medium.com/swlh/my-year-of-refactoring-a-large-scale-angularjs-project-cd4745da4242"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "68",
                                    "index": 14,
                                    "parentId": "53",
                                    "title": "GitHub - ui-router/angular-hybrid: Upgrade an ng1 UI-Router app to a ng1+ng2 hybrid using ng-upgrade",
                                    "url": "https://github.com/ui-router/angular-hybrid"
                                },
                                {
                                    "dateAdded": 1624558004993,
                                    "id": "69",
                                    "index": 15,
                                    "parentId": "53",
                                    "title": "Миграция с AngularJS на Angular7 через гибридное приложение / Хабр",
                                    "url": "https://habr.com/ru/post/484862/?_ga=2.19186353.862954250.1579505514-1411265010.1568732544"
                                },
                                {
                                    "dateAdded": 1624558004994,
                                    "id": "70",
                                    "index": 16,
                                    "parentId": "53",
                                    "title": "Драфт архітектури каталогу V0.5 - Google Docs",
                                    "url": "https://docs.google.com/document/d/1OExKXp6_j5ybJBJQ_rDWxGJCXPvqCPgf5Wx8IdOCESI/edit"
                                },
                                {
                                    "dateAdded": 1624558004994,
                                    "id": "71",
                                    "index": 17,
                                    "parentId": "53",
                                    "title": "Державні закупівлі та тендери Прозоро (ProZorro)",
                                    "url": "http://localhost:6234/MyTenders"
                                },
                                {
                                    "dateAdded": 1624558004994,
                                    "id": "72",
                                    "index": 18,
                                    "parentId": "53",
                                    "title": "NgUpgrade in Depth. Victor Savkin is a co-founder of Nrwl… | by Victor Savkin | Nrwl",
                                    "url": "https://blog.nrwl.io/ngupgrade-in-depth-436a52298a00"
                                },
                                {
                                    "dateAdded": 1624558004994,
                                    "id": "73",
                                    "index": 19,
                                    "parentId": "53",
                                    "title": "rwaldron/idiomatic.js: Principles of Writing Consistent, Idiomatic JavaScript",
                                    "url": "https://github.com/rwaldron/idiomatic.js/"
                                },
                                {
                                    "children": [
                                        {
                                            "dateAdded": 1603303748441,
                                            "id": "75",
                                            "index": 0,
                                            "parentId": "74",
                                            "title": "omreps/programmer-competency-matrix: ENG -> RU: Матрица компетентности программиста, мой перевод",
                                            "url": "https://github.com/omreps/programmer-competency-matrix"
                                        },
                                        {
                                            "dateAdded": 1603303748441,
                                            "id": "76",
                                            "index": 1,
                                            "parentId": "74",
                                            "title": "programmer-competency-matrix/partII.md at master · omreps/programmer-competency-matrix",
                                            "url": "https://github.com/omreps/programmer-competency-matrix/blob/master/partII.md"
                                        },
                                        {
                                            "dateAdded": 1603303748441,
                                            "id": "77",
                                            "index": 2,
                                            "parentId": "74",
                                            "title": "Learn to become a modern frontend developer",
                                            "url": "https://roadmap.sh/frontend"
                                        },
                                        {
                                            "dateAdded": 1603303748441,
                                            "id": "78",
                                            "index": 3,
                                            "parentId": "74",
                                            "title": "kamranahmedse/developer-roadmap: Roadmap to becoming a web developer in 2020",
                                            "url": "https://github.com/kamranahmedse/developer-roadmap"
                                        }
                                    ],
                                    "dateAdded": 1603303748440,
                                    "dateGroupModified": 1603303748441,
                                    "id": "74",
                                    "index": 20,
                                    "parentId": "53",
                                    "title": "Фронт Рофдмап"
                                },
                                {
                                    "dateAdded": 1609314468006,
                                    "id": "79",
                                    "index": 21,
                                    "parentId": "53",
                                    "title": "[ET-17831] Prozorro.Market - Редизайн UI/UX - E-Tender",
                                    "url": "http://services.e-tender.biz/jira/browse/ET-17831"
                                },
                                {
                                    "dateAdded": 1605287921823,
                                    "id": "80",
                                    "index": 22,
                                    "parentId": "53",
                                    "title": "[9:46] Дмитрий Вознюк       Поменялся пароль от джиры и конфлюенса Прозорро, новый dev_team 1qase432",
                                    "url": "chrome://newtab/"
                                },
                                {
                                    "dateAdded": 1619797154697,
                                    "id": "81",
                                    "index": 23,
                                    "parentId": "53",
                                    "title": "Yaware.TimeTracker - Automated Time and Productivity Tracking",
                                    "url": "http://192.168.103.120/user/reports/by-productivity/applications"
                                },
                                {
                                    "dateAdded": 1617649521866,
                                    "id": "82",
                                    "index": 24,
                                    "parentId": "53",
                                    "title": "aborodij/simple-tender: Simple Tender 1.0 is a real-time web application written in Angular/TypeScript/HTML/SCSS. This project was generated with Angular CLI version 11.2.3. Also used Angular Material 11, AngularFire 6, ngx-translate 13, Bootstrap 4, etc.",
                                    "url": "https://github.com/aborodij/simple-tender"
                                },
                                {
                                    "dateAdded": 1623430463666,
                                    "id": "83",
                                    "index": 25,
                                    "parentId": "53",
                                    "title": "kualkua/slim-rabbit: A Node.js micro-services framework based on RabbitMQ.",
                                    "url": "https://github.com/kualkua/slim-rabbit"
                                }
                            ],
                            "dateAdded": 1624557983545,
                            "dateGroupModified": 1624558004994,
                            "id": "53",
                            "index": 0,
                            "parentId": "2",
                            "title": "zzArchive"
                        }
                    ],
                    "dateAdded": 1638349026362,
                    "dateGroupModified": 1645635048409,
                    "id": "2",
                    "index": 1,
                    "parentId": "0",
                    "title": "Other bookmarks"
                },
                {
                    "children": [
                        {
                            "dateAdded": 1597733639685,
                            "dateGroupModified": 1597733639685,
                            "id": "8",
                            "index": 0,
                            "parentId": "3",
                            "title": "420"
                        },
                        {
                            "dateAdded": 1454328477278,
                            "id": "12",
                            "index": 1,
                            "parentId": "3",
                            "title": "Outlook Web App",
                            "url": "https://webmail.lohika.com/owa/auth/logon.aspx?url=https://webmail.lohika.com/owa/&reason=0"
                        },
                        {
                            "dateAdded": 1460978232514,
                            "id": "13",
                            "index": 2,
                            "parentId": "3",
                            "title": "Note Identification",
                            "url": "http://www.musictheory.net/exercises/note"
                        },
                        {
                            "dateAdded": 1533201846576,
                            "id": "14",
                            "index": 3,
                            "parentId": "3",
                            "title": "Проститутки Днепропетровска: элитные, дешевые, индивидуалки, VIP (вип).",
                            "url": "http://sexdnepr.net/"
                        },
                        {
                            "dateAdded": 1545584834279,
                            "id": "15",
                            "index": 4,
                            "parentId": "3",
                            "title": "Аренда Gopro, прокат экшн камеры Киев, прокат gopro Киев, Экшн камера Sony напрокат - Кемпинг Актив",
                            "url": "https://naprokat.kiev.ua/arenda-gopro.html"
                        },
                        {
                            "dateAdded": 1578671149329,
                            "id": "16",
                            "index": 5,
                            "parentId": "3",
                            "title": "Unity WebGL Player | EatItAll",
                            "url": "https://hdg255.000webhostapp.com/index.html"
                        },
                        {
                            "dateAdded": 1648122968599,
                            "id": "1033",
                            "index": 6,
                            "parentId": "3",
                            "title": "Карта повітряних тривог України",
                            "url": "https://war.ukrzen.in.ua/alerts/"
                        },
                        {
                            "dateAdded": 1649281264752,
                            "id": "1034",
                            "index": 7,
                            "parentId": "3",
                            "title": "Нова вкладка",
                            "url": "chrome-native://newtab/"
                        },
                        {
                            "dateAdded": 1650110676219,
                            "id": "1035",
                            "index": 8,
                            "parentId": "3",
                            "title": "Жизненно необходимые и важнейшие лекарственные препараты — Википедия",
                            "url": "https://ru.m.wikipedia.org/wiki/%D0%96%D0%B8%D0%B7%D0%BD%D0%B5%D0%BD%D0%BD%D0%BE_%D0%BD%D0%B5%D0%BE%D0%B1%D1%85%D0%BE%D0%B4%D0%B8%D0%BC%D1%8B%D0%B5_%D0%B8_%D0%B2%D0%B0%D0%B6%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5_%D0%BB%D0%B5%D0%BA%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5_%D0%BF%D1%80%D0%B5%D0%BF%D0%B0%D1%80%D0%B0%D1%82%D1%8B"
                        },
                        {
                            "dateAdded": 1650154219982,
                            "id": "1036",
                            "index": 9,
                            "parentId": "3",
                            "title": "Подбор пароля Wi-Fi утилитой aircrack-ng - RUSLAN NOVIKOV - Full Stack Developer /Chief Technology Officer (CTO)",
                            "url": "https://novikov.ua/%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80-%D0%BF%D0%B0%D1%80%D0%BE%D0%BB%D1%8F-wi-fi-%D1%83%D1%82%D0%B8%D0%BB%D0%B8%D1%82%D0%BE%D0%B9-aircrack-ng/"
                        },
                        {
                            "dateAdded": 1651237954084,
                            "id": "1037",
                            "index": 10,
                            "parentId": "3",
                            "title": "Карта войны в Украине. Посмотрите, где в последние дни шли бои (обновляем данные с задержкой) by meduza · MapHub",
                            "url": "https://maphub.net/meduza/map-a-temp-1"
                        }
                    ],
                    "dateAdded": 1638349026362,
                    "dateGroupModified": 1651237954084,
                    "id": "3",
                    "index": 2,
                    "parentId": "0",
                    "title": "Mobile bookmarks"
                }
            ],
            "dateAdded": 1682708359168,
            "id": "0",
            "title": ""
        }
    ];
    beforeEach(() => {
        chrome.bookmarks.getTree.mockImplementation((c) => c(bookmarksTree));
    });
    it('Should return a flat list of all bookmarks', async () => {
        const bookmarks = await getBookmarks();
        expect(bookmarks.length).toBeGreaterThan(2);
        expect(bookmarks[0].url).toBe('chrome://extensions/');
    });
    it('removeImageFromTitle should remove image from title.', () => {
        const textNoImgIitle = 'Just text';
        const textWithImgTitle = 'Image 123213:Title text';
        const resultForNoImgTitle = removeImageFromTitle(textNoImgIitle);
        const resultForImgTitle = removeImageFromTitle(textWithImgTitle);
        expect(resultForNoImgTitle).toBe(textNoImgIitle);
        expect(resultForImgTitle).toBe('Title text');
    });
});